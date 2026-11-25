import {
  MAIN_PAGE_DESCRIPTION,
  MAIN_PAGE_TITLE,
  SEO_PAGES,
} from './seoData.ts';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function normalizeBaseUrl(rawUrl: string): string {
  return rawUrl.replace(/\/+$/, '');
}

export function buildAbsoluteUrl(baseUrl: string, path: string): string {
  const cleanBase = normalizeBaseUrl(baseUrl);
  if (path === '/') {
    return `${cleanBase}/`;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

export function buildSitemapXml(baseUrl: string): string {
  const cleanBase = normalizeBaseUrl(baseUrl);
  const seenUrls = new Set<string>();
  const seenImages = new Set<string>();

  const urlNodes: string[] = [];

  for (const page of SEO_PAGES) {
    const pageLoc = buildAbsoluteUrl(cleanBase, page.path);
    if (seenUrls.has(pageLoc)) continue;
    seenUrls.add(pageLoc);

    const imageNodes: string[] = [];
    for (const img of page.images) {
      const imgLoc = buildAbsoluteUrl(cleanBase, img.path);
      if (seenImages.has(imgLoc)) continue;
      seenImages.add(imgLoc);

      imageNodes.push(
        `    <image:image>\n` +
          `      <image:loc>${escapeXml(imgLoc)}</image:loc>\n` +
          `      <image:title>${escapeXml(img.title)}</image:title>\n` +
          `    </image:image>`
      );
    }

    const imagesBlock = imageNodes.length > 0 ? `\n${imageNodes.join('\n')}` : '';

    urlNodes.push(
      `  <url>\n` +
        `    <loc>${escapeXml(pageLoc)}</loc>\n` +
        `    <lastmod>${escapeXml(page.lastmod)}</lastmod>\n` +
        `    <changefreq>${escapeXml(page.changefreq)}</changefreq>\n` +
        `    <priority>${escapeXml(page.priority)}</priority>${imagesBlock}\n` +
        `  </url>`
    );
  }

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    `${urlNodes.join('\n')}\n` +
    `</urlset>\n`
  );
}

export function buildRssXml(baseUrl: string): string {
  const cleanBase = normalizeBaseUrl(baseUrl);
  const homeUrl = buildAbsoluteUrl(cleanBase, '/');
  const rssUrl = buildAbsoluteUrl(cleanBase, '/rss.xml');
  const pubDateKst = 'Tue, 24 Nov 2026 09:00:00 +0900';

  const itemsXml = SEO_PAGES.filter(
    (page) => page.path !== '/privacy' && page.path !== '/terms'
  )
    .map((page) => {
      const link = buildAbsoluteUrl(cleanBase, page.path);
      return (
        `    <item>\n` +
        `      <title>${escapeXml(page.title)}</title>\n` +
        `      <link>${escapeXml(link)}</link>\n` +
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>\n` +
        `      <description>${escapeXml(page.description)}</description>\n` +
        `      <pubDate>${pubDateKst}</pubDate>\n` +
        `    </item>`
      );
    })
    .join('\n');

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
    `  <channel>\n` +
    `    <title>${escapeXml(MAIN_PAGE_TITLE)}</title>\n` +
    `    <link>${escapeXml(homeUrl)}</link>\n` +
    `    <description>${escapeXml(MAIN_PAGE_DESCRIPTION)}</description>\n` +
    `    <language>ko</language>\n` +
    `    <lastBuildDate>${pubDateKst}</lastBuildDate>\n` +
    `    <atom:link href="${escapeXml(rssUrl)}" rel="self" type="application/rss+xml" />\n` +
    `${itemsXml}\n` +
    `  </channel>\n` +
    `</rss>\n`
  );
}

export function buildRobotsTxt(baseUrl: string): string {
  const cleanBase = normalizeBaseUrl(baseUrl);
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    '',
    'User-agent: Yeti',
    'Allow: /',
    'Disallow: /api/',
    '',
    'User-agent: Googlebot',
    'Allow: /',
    'Disallow: /api/',
    '',
    `Sitemap: ${cleanBase}/sitemap.xml`,
    '',
  ].join('\n');
}
