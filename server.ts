import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveRequestBaseUrl } from './src/seo/domainResolver.ts';
import {
  DEFAULT_OG_IMAGE_PATH,
  NOT_FOUND_SEO,
  findSeoPage,
  normalizePathname,
} from './src/seo/seoData.ts';
import type { SeoPageConfig } from './src/seo/seoData.ts';
import {
  buildAbsoluteUrl,
  buildRobotsTxt,
  buildRssXml,
  buildSitemapXml,
} from './src/seo/sitemapBuilder.ts';
import { buildSsrRootHtml } from './src/seo/ssrContent.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

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

function getValidatedNaverVerificationToken(): string | null {
  const token = (process.env.NAVER_SITE_VERIFICATION ?? '').trim();
  if (!token) return null;
  return /^[a-zA-Z0-9_-]{8,128}$/.test(token) ? token : null;
}

function injectSeoIntoHtml(
  templateHtml: string,
  baseUrl: string,
  pathname: string,
  matchedPage?: SeoPageConfig
): string {
  const isNotFound = !matchedPage;
  const title = matchedPage ? matchedPage.title : NOT_FOUND_SEO.title;
  const description = matchedPage
    ? matchedPage.description
    : NOT_FOUND_SEO.description;
  const keywords = matchedPage
    ? matchedPage.keywords
    : '정력원, 중년 남성 활력, 웰니스';
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

  const naverToken = getValidatedNaverVerificationToken();
  if (naverToken) {
    html = replaceOrInsertHeadTag(
      html,
      /<meta\s+name="naver-site-verification"[\s\S]*?>/i,
      `<meta name="naver-site-verification" content="${escapeHtmlAttr(naverToken)}" />`
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

  // Inject semantic Korean HTML inside #root so Naver Yeti and non-JS crawlers read full page content
  const ssrMarkup = buildSsrRootHtml(matchedPage);
  html = html.replace(
    /<div\s+id="root"\s*><\/div>/i,
    `<div id="root">${ssrMarkup}</div>`
  );

  return html;
}

async function startServer() {
  const app = express();

  // Trust single-hop reverse proxy (Cloud Run / Nginx / CDN) safely
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  // Dynamic XML Sitemap (supports /sitemap.xml and /sitemap.xml/)
  app.get(['/sitemap.xml', '/sitemap.xml/'], (req: Request, res: Response) => {
    const baseUrl = resolveRequestBaseUrl(req);
    const xml = buildSitemapXml(baseUrl);

    res.status(200);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(xml);
  });

  // Dynamic RSS 2.0 Feed for Naver Search Advisor (/rss.xml, /rss.xml/, /feed.xml)
  app.get(
    ['/rss.xml', '/rss.xml/', '/feed.xml'],
    (req: Request, res: Response) => {
      const baseUrl = resolveRequestBaseUrl(req);
      const rss = buildRssXml(baseUrl);

      res.status(200);
      res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.send(rss);
    }
  );

  // Dynamic robots.txt synchronized with resolved canonical domain (allows Yeti + Googlebot)
  app.get('/robots.txt', (req: Request, res: Response) => {
    const baseUrl = resolveRequestBaseUrl(req);
    const robots = buildRobotsTxt(baseUrl);

    res.status(200);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(robots);
  });

  if (!IS_PRODUCTION) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use(async (req: Request, res: Response, next) => {
      if (req.method !== 'GET') {
        return next();
      }
      const cleanPath = normalizePathname(req.path);
      if (path.extname(cleanPath)) {
        return res.status(404).type('text/plain; charset=utf-8').send('Not Found');
      }

      try {
        const rawTemplate = fs.readFileSync(
          path.resolve(__dirname, 'index.html'),
          'utf8'
        );
        const transformedHtml = await vite.transformIndexHtml(
          req.originalUrl,
          rawTemplate
        );
        const baseUrl = resolveRequestBaseUrl(req);
        const matchedPage = findSeoPage(cleanPath);
        const finalHtml = injectSeoIntoHtml(
          transformedHtml,
          baseUrl,
          cleanPath,
          matchedPage
        );

        res
          .status(matchedPage ? 200 : 404)
          .setHeader('Content-Type', 'text/html; charset=utf-8')
          .send(finalHtml);
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        next(error);
      }
    });
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    const distIndexPath = path.join(distDir, 'index.html');

    app.use(
      express.static(distDir, {
        index: false,
        maxAge: '1h',
      })
    );

    app.use((req: Request, res: Response, next) => {
      if (req.method !== 'GET') {
        return next();
      }
      const cleanPath = normalizePathname(req.path);
      if (path.extname(cleanPath)) {
        return res.status(404).type('text/plain; charset=utf-8').send('Not Found');
      }

      if (!fs.existsSync(distIndexPath)) {
        return res
          .status(500)
          .type('text/plain; charset=utf-8')
          .send('Application build missing. Run npm run build first.');
      }

      const templateHtml = fs.readFileSync(distIndexPath, 'utf8');
      const baseUrl = resolveRequestBaseUrl(req);
      const matchedPage = findSeoPage(cleanPath);
      const finalHtml = injectSeoIntoHtml(
        templateHtml,
        baseUrl,
        cleanPath,
        matchedPage
      );

      res
        .status(matchedPage ? 200 : 404)
        .setHeader('Content-Type', 'text/html; charset=utf-8')
        .send(finalHtml);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Jeongryeokwon server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
