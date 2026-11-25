import fs from 'node:fs';
import path from 'node:path';
import { resolveEnvBaseUrl } from '../src/seo/domainResolver.ts';
import { injectSeoIntoHtml } from '../src/seo/htmlInjector.ts';
import { SEO_PAGES } from '../src/seo/seoData.ts';

const distDir = path.resolve(process.cwd(), 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(indexPath, 'utf8');
const baseUrl = resolveEnvBaseUrl();

for (const page of SEO_PAGES) {
  const html = injectSeoIntoHtml(templateHtml, baseUrl, page.path, page);
  const outPath =
    page.path === '/'
      ? indexPath
      : path.join(distDir, `${page.path.slice(1)}.html`);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
}

// Also generate dist/404.html with noindex so static hosts return 404 + noindex on unknown paths
const notFoundHtml = injectSeoIntoHtml(templateHtml, baseUrl, '/404');
fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf8');

console.log(
  `Pre-rendered ${SEO_PAGES.length} SEO routes + 404.html in dist/ for ${baseUrl}`
);
