import type { Request } from 'express';

export const DEFAULT_CANONICAL_ORIGIN = 'https://powerwang.xyz';

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
  const candidates = [process.env.SITE_URL, process.env.CANONICAL_URL];

  for (const candidate of candidates) {
    const parsed = parseValidHttpUrl(candidate);
    if (parsed) {
      return parsed.origin;
    }
  }

  return DEFAULT_CANONICAL_ORIGIN;
}

function getAllowedHostPatterns(): string[] {
  const configured = (process.env.ALLOWED_HOSTS ?? '')
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  configured.push('powerwang.xyz', 'www.powerwang.xyz');
  return configured;
}

function isTrustedCustomHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  const allowlist = getAllowedHostPatterns();
  for (const pattern of allowlist) {
    if (pattern.startsWith('*.')) {
      const suffix = pattern.slice(1);
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

  if (req) {
    const forwardedHost = extractFirstHeaderValue(req.headers['x-forwarded-host']);
    const directHost = extractFirstHeaderValue(req.headers.host);
    const candidateHost = forwardedHost || directHost;

    if (candidateHost && VALID_HOST_HEADER_RE.test(candidateHost)) {
      const hostnameOnly = stripPort(candidateHost);
      if (isTrustedCustomHostname(hostnameOnly)) {
        const forwardedProto = extractFirstHeaderValue(
          req.headers['x-forwarded-proto']
        ).toLowerCase();

        const proto: 'http' | 'https' =
          forwardedProto === 'http' || forwardedProto === 'https'
            ? forwardedProto
            : req.protocol === 'http'
              ? 'http'
              : 'https';

        return `${proto}://${candidateHost}`;
      }
    }
  }

  return DEFAULT_CANONICAL_ORIGIN;
}
