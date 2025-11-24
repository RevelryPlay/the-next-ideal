import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Site URL from config (hardcoded here to avoid import issues with JSX config)
const SITE_URL = 'https://thenextideal.com';

// Public routes to include in sitemap (exclude admin and other private routes)
const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/episodes', priority: '0.8', changefreq: 'daily' },
];

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];

  const urlEntries = routes
    .map(
      (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

  const outputPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outputPath, sitemap);
  console.log('Sitemap generated: public/sitemap.xml');
  console.log(`Routes included: ${routes.length}`);
}

generateSitemap();
