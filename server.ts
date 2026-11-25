import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveRequestBaseUrl } from './src/seo/domainResolver.ts';
import { injectSeoIntoHtml } from './src/seo/htmlInjector.ts';
import { findSeoPage, normalizePathname } from './src/seo/seoData.ts';
import {
  buildRobotsTxt,
  buildRssXml,
  buildSitemapXml,
} from './src/seo/sitemapBuilder.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

function getValidatedNaverVerificationToken(): string | null {
  const token = (process.env.NAVER_SITE_VERIFICATION ?? '').trim();
  if (!token) return null;
  return /^[a-zA-Z0-9_-]{8,128}$/.test(token) ? token : null;
}

async function startServer() {
  const app = express();

  // Trust single-hop reverse proxy (Cloudflare / Cloud Run / Nginx) safely
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
          matchedPage,
          getValidatedNaverVerificationToken()
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
        matchedPage,
        getValidatedNaverVerificationToken()
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
