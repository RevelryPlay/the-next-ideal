import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import Parser from 'rss-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { RSS_FEED } from './src/config.js';
import { ADMIN_PASSWORD } from './server.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const parser = new Parser();

// Security headers - CSP disabled for development, other headers active
const isDev = process.env.NODE_ENV !== 'production';
app.use(helmet({
  contentSecurityPolicy: false, // Disabled to allow flexible development
  hsts: false // Disabled in case you're not using HTTPS locally
}));

// Rate limiter for auth endpoints (5 attempts per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

// Limit request body size to prevent DoS
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// =============================================================================
// SECURITY HELPERS
// =============================================================================

/**
 * Validate email format
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 254) return false; // RFC 5321

  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  // Reject emails starting with dangerous characters (CSV injection attempts)
  if (/^[=+\-@\t\r]/.test(email)) return false;

  // Only allow reasonable characters in local part (before @)
  // Letters, numbers, dots, underscores, hyphens, plus (for plus addressing)
  const localPart = email.split('@')[0];
  if (!/^[a-zA-Z0-9._+-]+$/.test(localPart)) return false;

  return true;
}

/**
 * Sanitize string for CSV to prevent CSV injection attacks
 * Malicious payloads like =CMD|' /C calc'!A0 could execute in Excel
 */
function sanitizeForCsv(value) {
  if (typeof value !== 'string') return '';
  // Remove or escape dangerous characters that trigger formula execution
  let sanitized = value.trim();
  // If starts with dangerous chars, prefix with single quote (Excel escape)
  if (/^[=+\-@\t\r]/.test(sanitized)) {
    sanitized = "'" + sanitized;
  }
  // Escape double quotes and wrap in quotes if contains comma or quote
  if (sanitized.includes('"') || sanitized.includes(',')) {
    sanitized = '"' + sanitized.replace(/"/g, '""') + '"';
  }
  return sanitized;
}

/**
 * Validate URL to prevent SSRF attacks
 * Only allows http/https to external hosts
 */
function isValidExternalUrl(urlString) {
  try {
    const url = new URL(urlString);

    // Only allow http and https
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false;
    }

    const hostname = url.hostname.toLowerCase();

    // Block localhost and loopback
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return false;
    }

    // Block private IP ranges
    const privateRanges = [
      /^10\./,                          // 10.0.0.0/8
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
      /^192\.168\./,                    // 192.168.0.0/16
      /^169\.254\./,                    // Link-local
      /^0\./,                           // 0.0.0.0/8
    ];

    for (const range of privateRanges) {
      if (range.test(hostname)) {
        return false;
      }
    }

    // Block metadata endpoints (cloud providers)
    if (hostname === '169.254.169.254' || hostname.endsWith('.internal')) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Compare with dummy to maintain constant time
    crypto.timingSafeEqual(bufA, Buffer.alloc(bufA.length));
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Decode HTML entities and sanitize for safe output
 * React handles XSS escaping, so we just decode entities and strip dangerous tags
 */
function sanitizeHtml(str) {
  if (typeof str !== 'string') return '';

  // First, decode &amp; so we can then decode other entities
  // (some feeds double-encode, e.g., &amp;#x27;)
  let decoded = str.replace(/&amp;/g, '&');

  // Decode common HTML entities to their actual characters
  decoded = decoded
    .replace(/&#x27;/gi, "'")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x22;/gi, '"')
    .replace(/&#34;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(num))
    .replace(/&#x([a-fA-F0-9]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

  // Strip any HTML tags (keep text content only)
  decoded = decoded.replace(/<[^>]*>/g, '');

  return decoded;
}

// Block direct access to sensitive files
app.use((req, res, next) => {
  const blockedFilenames = [
    'emails.csv',
    'server.config.js',
    '.env',
    'config.js',
    'package.json',
    'package-lock.json',
  ];

  // Helper to serve 404 page identical to actual not-found response
  const serve404 = () => {
    if (process.env.NODE_ENV === 'production') {
      // Serve the React app which will render the NotFound component
      return res.status(404).sendFile(path.join(__dirname, 'dist', 'index.html'));
    }
    // In dev mode, just return 404 status (Vite handles the app)
    return res.status(404).send('Not found');
  };

  // Decode URL and normalize path to prevent traversal attacks
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(req.path);
  } catch {
    // Invalid encoding - block it
    return serve404();
  }

  // Normalize to handle ../ and ./ segments, then lowercase
  const normalizedPath = path.normalize(decodedPath).toLowerCase();
  const basename = path.basename(normalizedPath);

  // Block access to sensitive files by checking normalized path and basename
  if (blockedFilenames.some(file => basename === file || normalizedPath.endsWith('/' + file))) {
    return serve404();
  }

  // Block access to source files
  if (normalizedPath.startsWith('/src/') || normalizedPath.endsWith('.jsx') || normalizedPath.endsWith('.js')) {
    // Allow Vite dev server assets
    if (!normalizedPath.startsWith('/assets/') && !normalizedPath.startsWith('/@')) {
      return serve404();
    }
  }

  next();
});

// In production, serve the built React app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Email signup endpoint
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const csvPath = path.join(__dirname, 'emails.csv');

  // Check if email already exists
  if (fs.existsSync(csvPath)) {
    const existingData = fs.readFileSync(csvPath, 'utf-8');
    const existingEmails = existingData
      .split('\n')
      .slice(1) // Skip header row
      .map(line => line.split(',')[0]?.toLowerCase().trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);

    if (existingEmails.includes(normalizedEmail)) {
      // Return success to avoid leaking info about existing emails
      return res.json({ success: true, message: 'Thanks for subscribing!' });
    }
  } else {
    // Create header if file doesn't exist
    fs.writeFileSync(csvPath, 'email,subscribed_at\n');
  }

  // Sanitize for CSV to prevent formula injection
  const sanitizedEmail = sanitizeForCsv(normalizedEmail);
  const csvLine = `${sanitizedEmail},${new Date().toISOString()}\n`;

  fs.appendFileSync(csvPath, csvLine);
  res.json({ success: true, message: 'Thanks for subscribing!' });
});

// Download emails (password protected with rate limiting)
app.post('/api/download-emails', authLimiter, (req, res) => {
  const { password } = req.body;

  // Use timing-safe comparison to prevent timing attacks
  if (!safeCompare(password || '', ADMIN_PASSWORD)) {
    // Log failed attempt for security monitoring
    console.warn('Failed admin auth attempt', {
      ip: req.ip,
      timestamp: new Date().toISOString(),
      userAgent: req.get('user-agent')
    });
    return res.status(401).json({ error: 'Invalid password' });
  }

  const csvPath = path.join(__dirname, 'emails.csv');

  if (!fs.existsSync(csvPath)) {
    return res.status(404).json({ error: 'No emails collected yet' });
  }

  // Log successful download
  console.info('Admin download initiated', {
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  res.download(csvPath, 'emails.csv');
});

// RSS feed endpoint
app.get('/api/feed', async (req, res) => {
  try {
    // Use configured feed URL, ignore user-provided URL to prevent SSRF
    // If you need to allow user URLs, validate with isValidExternalUrl()
    const feedUrl = RSS_FEED.url;

    // If you want to allow user-provided URLs (uncomment below):
    // const userUrl = req.query.url;
    // if (userUrl && !isValidExternalUrl(userUrl)) {
    //   return res.status(400).json({ error: 'Invalid feed URL' });
    // }
    // const feedUrl = userUrl || RSS_FEED.url;

    const feed = await parser.parseURL(feedUrl);

    // Get feed-level image for fallback
    const feedImage = feed.itunes?.image || feed.image?.url || null;

    res.json({
      title: sanitizeHtml(feed.title || ''),
      description: sanitizeHtml(feed.description || ''),
      image: feedImage,
      items: feed.items.map((item, index) => ({
        title: sanitizeHtml(item.title || ''),
        link: item.link,
        date: item.pubDate,
        content: sanitizeHtml(item.contentSnippet || item.content || ''),
        // Podcast-specific fields
        audioUrl: item.enclosure?.url || null,
        duration: item.itunes?.duration || null,
        episode: item.itunes?.episode || null,
        season: item.itunes?.season || null,
        // Use episode image if available, otherwise fall back to feed image
        image: item.itunes?.image || feedImage
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch RSS feed' });
  }
});

// In production, handle client-side routing
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
