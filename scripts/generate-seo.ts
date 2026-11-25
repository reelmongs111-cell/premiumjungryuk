import fs from 'node:fs';
import path from 'node:path';
import { resolveEnvBaseUrl } from '../src/seo/domainResolver.ts';
import {
  buildRobotsTxt,
  buildRssXml,
  buildSitemapXml,
} from '../src/seo/sitemapBuilder.ts';

const rootDir = process.cwd();
const publicDir = path.resolve(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const baseUrl = resolveEnvBaseUrl();
const sitemapXml = buildSitemapXml(baseUrl);
const rssXml = buildRssXml(baseUrl);
const robotsTxt = buildRobotsTxt(baseUrl);

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');
fs.writeFileSync(path.join(publicDir, 'rss.xml'), rssXml, 'utf8');
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');

console.log(
  `Generated public/sitemap.xml, public/rss.xml, and public/robots.txt for ${baseUrl}`
);
