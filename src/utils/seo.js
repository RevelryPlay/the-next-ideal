import { SITE } from '../config';

/**
 * Sets or updates a meta tag in the document head
 */
function setMetaTag(attribute, value, content) {
  let element = document.querySelector(`meta[${attribute}="${value}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Sets or updates a link tag in the document head
 */
function setLinkTag(rel, href, type) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
  if (type) element.setAttribute('type', type);
}

/**
 * Initialize all SEO meta tags from config
 */
export function initSEO() {
  const title = `${SITE.name} - ${SITE.tagline}`;
  const fullImageUrl = SITE.image.startsWith('http')
    ? SITE.image
    : `${SITE.url}${SITE.image}`;

  // Document title
  document.title = title;

  // Primary Meta Tags
  setMetaTag('name', 'title', title);
  setMetaTag('name', 'description', SITE.description);
  setMetaTag('name', 'keywords', SITE.keywords);
  setMetaTag('name', 'author', SITE.name);
  setMetaTag('name', 'robots', 'index, follow');

  // Theme Color
  setMetaTag('name', 'theme-color', SITE.themeColor);
  setMetaTag('name', 'msapplication-TileColor', SITE.themeColor);

  // Open Graph / Facebook
  setMetaTag('property', 'og:type', 'website');
  setMetaTag('property', 'og:url', SITE.url);
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', SITE.description);
  setMetaTag('property', 'og:image', fullImageUrl);
  setMetaTag('property', 'og:site_name', SITE.name);

  // Twitter
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:url', SITE.url);
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', SITE.description);
  setMetaTag('name', 'twitter:image', fullImageUrl);
  if (SITE.twitterHandle) {
    setMetaTag('name', 'twitter:creator', SITE.twitterHandle);
    setMetaTag('name', 'twitter:site', SITE.twitterHandle);
  }

  // Favicon
  setLinkTag('icon', SITE.favicon, 'image/svg+xml');
  setLinkTag('apple-touch-icon', SITE.favicon);

  // Canonical URL
  setLinkTag('canonical', SITE.url);
}
