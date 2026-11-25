import {
  DEFAULT_OG_IMAGE_PATH,
  NOT_FOUND_SEO,
  normalizePathname,
} from './seoData.ts';
import type { SeoPageConfig } from './seoData.ts';
import { buildAbsoluteUrl } from './sitemapBuilder.ts';
import { buildSsrRootHtml } from './ssrContent.ts';

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtmlText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function replaceOrInsertHeadTag(
  html: string,
  pattern: RegExp,
  replacement: string
): string {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }
  return html.replace('</head>', `    ${replacement}\n  </head>`);
}

export function injectSeoIntoHtml(
  templateHtml: string,
  baseUrl: string,
  pathname: string,
  matchedPage?: SeoPageConfig,
  naverVerificationToken?: string | null
): string {
  const isNotFound = !matchedPage;
  const title = matchedPage ? matchedPage.title : NOT_FOUND_SEO.title;
  const description = matchedPage
    ? matchedPage.description
    : NOT_FOUND_SEO.description;
  const keywords = matchedPage
    ? matchedPage.keywords
    : '정력원, 중년 남성 활력 영양제, 활력 케어';
  const robots = isNotFound
    ? NOT_FOUND_SEO.robots
    : 'index, follow, max-image-preview:large';
  const naverBotContent = isNotFound ? 'noindex, nofollow' : 'index, follow';

  const canonicalUrl = buildAbsoluteUrl(
    baseUrl,
    matchedPage ? matchedPage.path : normalizePathname(pathname)
  );
  const imagePath =
    matchedPage && matchedPage.images.length > 0
      ? matchedPage.images[0].path
      : DEFAULT_OG_IMAGE_PATH;
  const ogImageUrl = buildAbsoluteUrl(baseUrl, imagePath);
  const rssUrl = buildAbsoluteUrl(baseUrl, '/rss.xml');

  let html = templateHtml;

  html = replaceOrInsertHeadTag(
    html,
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtmlText(title)}</title>`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="description"[\s\S]*?>/i,
    `<meta name="description" content="${escapeHtmlAttr(description)}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="keywords"[\s\S]*?>/i,
    `<meta name="keywords" content="${escapeHtmlAttr(keywords)}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="robots"[\s\S]*?>/i,
    `<meta name="robots" content="${escapeHtmlAttr(robots)}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="Yeti"[\s\S]*?>/i,
    `<meta name="Yeti" content="${escapeHtmlAttr(naverBotContent)}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="NaverBot"[\s\S]*?>/i,
    `<meta name="NaverBot" content="${escapeHtmlAttr(naverBotContent)}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<link\s+rel="canonical"[\s\S]*?>/i,
    `<link rel="canonical" href="${escapeHtmlAttr(canonicalUrl)}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<link\s+rel="alternate"\s+type="application\/rss\+xml"[\s\S]*?>/i,
    `<link rel="alternate" type="application/rss+xml" title="정력원 RSS 피드" href="${escapeHtmlAttr(rssUrl)}" />`
  );

  if (naverVerificationToken) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+name="naver-site-verification"[\s\S]*?>/i,
      `<meta name="naver-site-verification" content="${escapeHtmlAttr(naverVerificationToken)}" />`
    );
  }

  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property="og:title"[\s\S]*?>/i,
    `<meta property="og:title" content="${escapeHtmlAttr(title)}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property="og:description"[\s\S]*?>/i,
    `<meta property="og:description" content="${escapeHtmlAttr(description)}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property="og:url"[\s\S]*?>/i,
    `<meta property="og:url" content="${escapeHtmlAttr(canonicalUrl)}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+property="og:image"[\s\S]*?>/i,
    `<meta property="og:image" content="${escapeHtmlAttr(ogImageUrl)}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="twitter:title"[\s\S]*?>/i,
    `<meta name="twitter:title" content="${escapeHtmlAttr(title)}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="twitter:description"[\s\S]*?>/i,
    `<meta name="twitter:description" content="${escapeHtmlAttr(description)}" />`
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta\s+name="twitter:image"[\s\S]*?>/i,
    `<meta name="twitter:image" content="${escapeHtmlAttr(ogImageUrl)}" />`
  );

  if (matchedPage && matchedPage.breadcrumbs.length > 0) {
    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: matchedPage.breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: crumb.name,
        item: buildAbsoluteUrl(baseUrl, crumb.path),
      })),
    };
    const serialized = JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c');
    html = replaceOrInsertHeadTag(
      html,
      /<script\s+id="route-breadcrumb-ld"\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
      `<script id="route-breadcrumb-ld" type="application/ld+json">${serialized}</script>`
    );
  }

  const ssrMarkup = `<!--ssr-root-start-->${buildSsrRootHtml(matchedPage)}<!--ssr-root-end-->`;
  if (/<!--ssr-root-start-->[\s\S]*?<!--ssr-root-end-->/.test(html)) {
    html = html.replace(
      /<!--ssr-root-start-->[\s\S]*?<!--ssr-root-end-->/,
      ssrMarkup
    );
  } else {
    html = html.replace(
      /<div\s+id="root"\s*><\/div>/i,
      `<div id="root">${ssrMarkup}</div>`
    );
  }

  return html;
}
