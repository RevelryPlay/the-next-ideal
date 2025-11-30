/**
 * Site Configuration;
 * Update these values to customize your site
 */

export const SITE = {
  name: 'The Next Ideal',
  tagline: 'Stormlight Self-Help',

  // SEO & Social Sharing
  // Used in meta-tags and social sharing cards needs to also be updated in index.html
  description: 'Real lessons from a fantasy world - we approach the Stormlight Archive as a therapy text, working our way through The Way of Kings by Brandon Sanderson, using modern psychology theories and practices to help you find your Next Ideal.',
  keywords: 'stormlight archive, brandon sanderson, self-help, podcast, fantasy, cosmere, radiant, ideals',
  url: 'https://thenextideal.com', // Your production URL (used for social sharing)
  image: '/social-share.png', // Social share image (1200x630 PNG)
  twitterHandle: '', // Your Twitter/X handle
  themeColor: '#1a1a2e',

  // Favicon (uses logo by default)
  favicon: '/TNI-logo_full-color-2.svg',
};

export const RSS_FEED = {
  url: 'https://feeds.acast.com/public/shows/690e5e1a7728b8766ce4638c',
};

export const TRAILER = {
  // YouTube embed URL for the podcast trailer
  url: 'https://www.youtube.com/embed/J6fLgg6PyeI?si=cXAS3Eszmjcec8RF',
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
  twitter: '',
  instagram: 'https://www.instagram.com/thenextideal',
  facebook: '',
  linkedin: '',
  youtube: 'https://youtube.com/@TheNextIdealPodcast',
  tiktok: '',
  github: '',
};

/**
 * Support Links
 * Set a URL to show the link, or leave empty/remove to hide it
 */
export const SUPPORT_LINKS = {
  kofi: 'https://ko-fi.com/thenextideal', // Leave empty to hide
  patreon: 'https://www.patreon.com/c/TheNextIdeal', // Leave empty to hide
};

/**
 * Admin Settings
 * Note: Password is stored separately in server.config.js for security
 */
export const ADMIN = {
  // Path to access admin page (e.g., thenextideal.com/admin)
  path: '/admin',
};

/**
 * Podcast Hosts
 * Information about the hosts of the podcast
 */
export const HOSTS = [
  {
    name: 'Steve Pond',
    image: 'steve-headshot',
    bio: 'Steven Pond is a voice actor and content creator who has been exploring the Cosmere on YouTube since 2018. He has been a panelist at almost every Dragonsteel convention, and is a licensed audiobook narrator for Sanderson\'s "Long Chills and Case Dough," which can be listened to on his YouTube Channel "Read And Find Out." Check out more of his voice work at stevenpond.com',
  },
  {
    name: 'Ben Jeppsen',
    image: 'Ben_Jeppsen_Horizontal',
    bio: '',
  },
];


/** * Default User Preferences
 */
export const defaultPreferences = {
    theme: 'system', // 'light' | 'dark' | 'system'
    itemsPerPage: 25,
    reduceAnimations: false
}