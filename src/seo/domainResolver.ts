import type { Request } from 'express';

const FALLBACK_PUBLIC_URL =
  'https://ais-pre-qqdodvcmphbf4x73jjyqzm-1003992167908.asia-southeast1.run.app';

// Strict RFC-safe host[:port] check to prevent host header injection or CRLF/path tricks
const VALID_HOST_HEADER_RE =
  /^(?:\[[0-9a-fA-F:]+\]|[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)(?::\d{1,5})?$/;

export function parseValidHttpUrl(raw?: string | null): URL | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === 'MY_APP_URL') return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function resolveEnvBaseUrl(): string {
  const candidates = [
    process.env.SITE_URL,
    process.env.CANONICAL_URL,
    process.env.APP_URL,
  ];

  for (const candidate of candidates) {
    const parsed = parseValidHttpUrl(candidate);
    if (parsed) {
      return parsed.origin;
    }
  }

  return FALLBACK_PUBLIC_URL;
}

function getAllowedHostPatterns(): string[] {
  const configured = (process.env.ALLOWED_HOSTS ?? '')
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  const appUrl = parseValidHttpUrl(process.env.APP_URL);
  if (appUrl) {
    configured.push(appUrl.hostname.toLowerCase());
  }

  return configured;
}

function isLocalHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  return lower === 'localhost' || lower === '127.0.0.1' || lower === '[::1]';
}

function isTrustedHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (isLocalHostname(lower)) return true;
  if (lower.endsWith('.run.app')) return true;

  const allowlist = getAllowedHostPatterns();
  for (const pattern of allowlist) {
    if (pattern.startsWith('*.')) {
      const suffix = pattern.slice(1); // ".example.com"
      if (lower.endsWith(suffix) && lower.length > suffix.length) {
        return true;
      }
    } else if (lower === pattern) {
      return true;
    }
  }

  return false;
}

function extractFirstHeaderValue(value: string | string[] | undefined): string {
  if (!value) return '';
  const raw = Array.isArray(value) ? value[0] : value;
  return raw.split(',')[0].trim();
}

function stripPort(hostHeader: string): string {
  if (hostHeader.startsWith('[')) {
    const endIdx = hostHeader.indexOf(']');
    return endIdx !== -1 ? hostHeader.slice(0, endIdx + 1) : hostHeader;
  }
  const colonIdx = hostHeader.indexOf(':');
  return colonIdx !== -1 ? hostHeader.slice(0, colonIdx) : hostHeader;
}

export function resolveRequestBaseUrl(req?: Request): string {
  // Explicit canonical custom domain override always takes precedence
  const explicitSiteUrl =
    parseValidHttpUrl(process.env.SITE_URL) ??
    parseValidHttpUrl(process.env.CANONICAL_URL);
  if (explicitSiteUrl) {
    return explicitSiteUrl.origin;
  }

  if (!req) {
    return resolveEnvBaseUrl();
  }

  const forwardedHost = extractFirstHeaderValue(req.headers['x-forwarded-host']);
  const directHost = extractFirstHeaderValue(req.headers.host);
  const candidateHost = forwardedHost || directHost;

  if (candidateHost && VALID_HOST_HEADER_RE.test(candidateHost)) {
    const hostnameOnly = stripPort(candidateHost);
    if (isTrustedHostname(hostnameOnly)) {
      const forwardedProto = extractFirstHeaderValue(
        req.headers['x-forwarded-proto']
      ).toLowerCase();

      let proto: 'http' | 'https';
      if (forwardedProto === 'https' || forwardedProto === 'http') {
        proto = forwardedProto;
      } else if (req.protocol === 'https') {
        proto = 'https';
      } else {
        proto = isLocalHostname(hostnameOnly) ? 'http' : 'https';
      }

      return `${proto}://${candidateHost}`;
    }
  }

  return resolveEnvBaseUrl();
}
