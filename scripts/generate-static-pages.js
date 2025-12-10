import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

// Define metadata for each route
// This should match the metadata in App.jsx
const routes = [
  {
    path: '/',
    file: 'index.html',
    title: 'The Next Ideal - Stormlight Self-Help',
    description: 'Real lessons from a fantasy world - we approach the Stormlight Archive as a therapy text, working our way through The Way of Kings by Brandon Sanderson, using modern psychology theories and practices to help you find your Next Ideal.',
    keywords: 'stormlight archive, brandon sanderson, self-help, podcast, fantasy, cosmere, radiant, ideals',
    image: 'https://thenextideal.com/social-share.png',
    url: 'https://thenextideal.com/',
  },
  {
    path: '/episodes',
    file: 'episodes/index.html',
    title: 'Episodes - The Next Ideal',
    description: 'Browse all episodes of The Next Ideal podcast. Journey through The Way of Kings chapter by chapter, exploring mental health themes, psychological insights, and the wisdom of the Radiant Ideals.',
    keywords: 'stormlight archive podcast, way of kings episodes, brandon sanderson podcast, mental health podcast, fantasy therapy',
    image: 'https://thenextideal.com/social-share.png',
    url: 'https://thenextideal.com/episodes',
  },
  {
    path: '/resources',
    file: 'resources/index.html',
    title: 'Mental Health Resources - The Next Ideal',
    description: 'Recommended mental health resources for Radiants. Learn about the Next Step Coin, find geek-focused counseling through NerdHQ, and discover 24/7 virtual mental health support from TimelyCare. Journey before destination.',
    keywords: 'mental health resources, next step coin, nerdhq, timelycare, stormlight mental health, radiant support',
    image: 'https://thenextideal.com/social-share.png',
    url: 'https://thenextideal.com/resources',
  },
];

/**
 * Updates metadata tags in HTML content
 */
function updateMetaTags(html, route) {
  let updated = html;

  // Update title
  updated = updated.replace(
    /<title>.*?<\/title>/,
    `<title>${route.title}</title>`
  );

  // Update meta name="title"
  updated = updated.replace(
    /<meta name="title" content=".*?"[^>]*>/,
    `<meta name="title" content="${route.title}" />`
  );

  // Update meta name="description"
  updated = updated.replace(
    /<meta name="description" content=".*?"[^>]*>/,
    `<meta name="description" content="${route.description}" />`
  );

  // Update meta name="keywords" (add if doesn't exist)
  if (updated.includes('name="keywords"')) {
    updated = updated.replace(
      /<meta name="keywords" content=".*?"[^>]*>/,
      `<meta name="keywords" content="${route.keywords}" />`
    );
  } else {
    // Add keywords after description
    updated = updated.replace(
      /(<meta name="description"[^>]*>)/,
      `$1\n    <meta name="keywords" content="${route.keywords}" />`
    );
  }

  // Update Open Graph tags
  updated = updated.replace(
    /<meta property="og:url" content=".*?"[^>]*>/,
    `<meta property="og:url" content="${route.url}" />`
  );
  updated = updated.replace(
    /<meta property="og:title" content=".*?"[^>]*>/,
    `<meta property="og:title" content="${route.title}" />`
  );
  updated = updated.replace(
    /<meta property="og:description" content=".*?"[^>]*>/,
    `<meta property="og:description" content="${route.description}" />`
  );
  updated = updated.replace(
    /<meta property="og:image" content=".*?"[^>]*>/,
    `<meta property="og:image" content="${route.image}" />`
  );

  // Update Twitter tags (if they exist, otherwise add them)
  const twitterCardRegex = /<meta name="twitter:card" content=".*?"[^>]*>/;
  if (updated.includes('twitter:card')) {
    updated = updated.replace(
      /<meta name="twitter:url" content=".*?"[^>]*>/,
      `<meta name="twitter:url" content="${route.url}" />`
    );
    updated = updated.replace(
      /<meta name="twitter:title" content=".*?"[^>]*>/,
      `<meta name="twitter:title" content="${route.title}" />`
    );
    updated = updated.replace(
      /<meta name="twitter:description" content=".*?"[^>]*>/,
      `<meta name="twitter:description" content="${route.description}" />`
    );
    updated = updated.replace(
      /<meta name="twitter:image" content=".*?"[^>]*>/,
      `<meta name="twitter:image" content="${route.image}" />`
    );
  } else {
    // Add Twitter tags after og:image
    const twitterTags = `
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${route.url}" />
    <meta name="twitter:title" content="${route.title}" />
    <meta name="twitter:description" content="${route.description}" />
    <meta name="twitter:image" content="${route.image}" />`;

    updated = updated.replace(
      /(<meta property="og:image"[^>]*>)/,
      `$1${twitterTags}`
    );
  }

  // Update canonical link
  if (updated.includes('rel="canonical"')) {
    updated = updated.replace(
      /<link rel="canonical" href=".*?"[^>]*>/,
      `<link rel="canonical" href="${route.url}" />`
    );
  } else {
    // Add canonical link in head
    updated = updated.replace(
      '</head>',
      `    <link rel="canonical" href="${route.url}" />\n  </head>`
    );
  }

  return updated;
}

/**
 * Main function to generate static pages
 */
function generateStaticPages() {
  console.log('🔨 Generating static pages with metadata...\n');

  // Check if dist folder exists
  if (!fs.existsSync(distPath)) {
    console.error('❌ Error: dist folder not found. Run `npm run build` first.');
    process.exit(1);
  }

  // Check if index.html exists
  if (!fs.existsSync(indexPath)) {
    console.error('❌ Error: dist/index.html not found. Run `npm run build` first.');
    process.exit(1);
  }

  // Read the base index.html
  const baseHtml = fs.readFileSync(indexPath, 'utf-8');

  // Generate a page for each route
  routes.forEach(route => {
    const outputPath = path.join(distPath, route.file);
    const outputDir = path.dirname(outputPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Update metadata for this route
    const updatedHtml = updateMetaTags(baseHtml, route);

    // Write the file
    fs.writeFileSync(outputPath, updatedHtml);
    console.log(`✓ Generated ${route.file} with metadata for ${route.path}`);
  });

  console.log('\n✅ All static pages generated successfully!');
  console.log('📝 Social media crawlers will now see the correct metadata for each page.');
}

// Run the script
generateStaticPages();
