# The Next Ideal - Podcast Website

This is the website for **The Next Ideal**, a podcast exploring self-improvement through the lens of Brandon Sanderson's Stormlight Archive.

## How to Update Content

Most content on the site can be changed by editing a single file: `src/config.js`

### Things You Can Change

| What | Where to Change It |
|------|-------------------|
| Site name & tagline | `SITE.name` and `SITE.tagline` |
| Site description | `SITE.description` |
| RSS feed URL | `RSS_FEED.url` |
| Trailer video | `TRAILER.url` (use YouTube embed URL) |
| Social media links | `SOCIAL_LINKS` section |
| Support links | `SUPPORT_LINKS` section |
| Email signup text | `EMAIL_SIGNUP` section |

### To Change the Intro Text

Edit the file `src/components/Intro.jsx` and update the text between the `<p>` tags.

## Viewing Subscriber Emails

1. Go to **thenextideal.com/admin**
2. Enter the admin password (found in `server.config.js` copy the `server.config.example.js` the first time)
3. You'll see a list of all email subscribers
4. You can download the list as a CSV file

## For Developers

See [DEPLOY-NAMECHEAP.md](./DEPLOY-NAMECHEAP.md) for setup and deployment instructions.

## Need Help?

If something isn't working or you need to make changes you can't figure out, reach out to your developer for assistance.
