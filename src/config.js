/**
 * Site Configuration;
 * Update these values to customize your site
 */

export const SITE = {
  name: 'The Next Ideal',
  tagline: 'Stormlight Self-Help',

  // SEO & Social Sharing
  // Used in meta-tags and social sharing cards needs to also be updated in index.html
  description: 'A podcast exploring self-improvement through the lens of Brandon Sanderson\'s Stormlight Archive.',
  keywords: 'stormlight archive, brandon sanderson, self-help, podcast, fantasy, cosmere, radiant, ideals',
  url: 'https://thenextideal.com', // Your production URL (used for social sharing)
  image: '/social-share.png', // Social share image (1200x630 PNG)
  twitterHandle: '@thenextideal', // Your Twitter/X handle
  themeColor: '#1a1a2e',

  // Favicon (uses logo by default)
  favicon: '/TNI-logo_full-color-2.svg',
};

export const RSS_FEED = {
  // The Stormpod - A Stormlight Archive podcast
  url: 'https://feeds.buzzsprout.com/285939.rss',
};

export const TRAILER = {
  // YouTube embed URL for the podcast trailer
  url: 'https://www.youtube.com/embed/YOUR_VIDEO_ID',
  title: 'Podcast Trailer',
};

export const EMAIL_SIGNUP = {
  heading: 'Stay Updated',
  description: 'Subscribe to get the latest updates delivered to your inbox.',
  placeholder: 'Enter your email',
  buttonText: 'Subscribe',
  successMessage: 'Thanks for subscribing!',
};

/**
 * Social Links
 * Set a URL to show the link, or leave empty/remove to hide it
 */
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/yourhandle',
  instagram: 'https://instagram.com/yourhandle',
  facebook: 'https://facebook.com/yourpage',
  linkedin: '',
  youtube: 'https://youtube.com/@yourchannel',
  tiktok: '',
  github: '',
};

/**
 * Support Links
 * Set a URL to show the link, or leave empty/remove to hide it
 */
export const SUPPORT_LINKS = {
  kofi: 'https://ko-fi.com/yourpage', // Leave empty to hide
  patreon: 'https://patreon.com/yourpage', // Leave empty to hide
};

/**
 * Admin Settings
 * Note: Password is stored separately in server.config.js for security
 */
export const ADMIN = {
  // Path to access admin page (e.g., thenextideal.com/admin)
  path: '/admin',
};


/** * Default User Preferences
 */
export const defaultPreferences = {
    theme: 'system', // 'light' | 'dark' | 'system'
    itemsPerPage: 25,
    reduceAnimations: false
}