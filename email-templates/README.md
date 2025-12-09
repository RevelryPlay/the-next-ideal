# Email Templates

This folder contains email templates for The Next Ideal mailing list.

## Templates

### 1. welcome-email.html
A warm welcome email sent when someone first subscribes, featuring:
- "Welcome, Radiant" greeting with the First Ideal
- Introduction to the podcast and hosts
- What to expect from future emails
- "Browse Episodes" CTA button
- Mental health resources section
- Social links to connect with the community
- Brief host bios
- Support buttons (Ko-fi, Patreon)

**When to use:** Automatically send when someone subscribes (Mailchimp automation/autoresponder)

### 2. monthly-newsletter.html
A comprehensive monthly newsletter template featuring:
- Header with logo and Stormlight-inspired gradient
- Featured episode section with CTA button
- Mental health reflection/insight box
- Resources section (Next Step Coin, NerdHQ, TimelyCare, 988)
- Community/social links section
- Support buttons (Ko-fi, Patreon)
- Footer with unsubscribe link

**When to use:** Regular monthly digest sent to all subscribers

### 3. new-episode-alert.html
A focused email announcing a single new episode, featuring:
- "New Episode" badge at the top
- Episode title and number
- Episode description and key topics covered
- Large "Listen Now" CTA button
- Optional quote/teaser from the episode
- Quick link to resources
- Simplified footer

**When to use:** Send when a new episode is published (can be automated or manual)

### 4. re-engagement.html
A warm, compassionate email for inactive subscribers, featuring:
- "We Miss You, Radiant" heading
- Acknowledgment that journeys aren't linear
- What they've missed since last engagement
- Mental health resources reminder
- Clear "I'm Back!" CTA or unsubscribe option
- No pressure, honoring their choice

**When to use:** Send to subscribers who haven't opened emails in 60-90 days (Mailchimp can automate this)

### 5. special-announcement.html
A flexible template for big news and special events, featuring:
- "Special Announcement" badge
- Large headline and subheadline
- Featured content box with key details
- Date/time/location information section
- "What to Expect" section with highlights
- Prominent CTA button
- Optional quote/testimonial section
- Social sharing encouragement

**When to use:** Guest episodes, live events, milestone celebrations, important updates, new partnerships

### 6. feedback-survey.html
A thoughtful request for listener feedback, featuring:
- "We Value Your Voice" messaging
- Explanation of why feedback matters
- List of what you're asking about
- Time estimate and anonymity note
- Large "Share Your Thoughts" CTA
- Alternative feedback methods (email, Instagram, reviews)
- Optional incentive section (commented out)
- Gratitude and no-pressure tone

**When to use:** Quarterly or biannually to gather listener insights and improve the show

## Template Overview

**Brand Colors Used:**
- Midnight: `#202020`
- Kholin Blue: `#1C4668`
- Stormlight Gold: `#E2A63B`
- Stone: `#FEF6DF`
- Ko-fi Red: `#FF5E5B`
- Patreon Red: `#FF424D`

## How to Use

### Setting Up in Mailchimp

1. **Create a new campaign** in Mailchimp
2. **Design Email** → Choose "Code your own" → "Paste in code"
3. **Copy and paste** the template HTML
4. **Replace content placeholders** (see below)
5. **Preview and test** before sending

### Mailchimp Merge Tags (Already Included)

These tags are automatically replaced by Mailchimp:
- `*|FNAME:Radiant|*` - Subscriber's first name (defaults to "Radiant" if not set)
- `*|UNSUBSCRIBE|*` - Unsubscribe link (required)
- `*|ARCHIVE|*` - "View in browser" link
- `*|HTML:LIST_ADDRESS_HTML|*` - Your physical mailing address (required by law)
- `*|CURRENT_YEAR|*` - Current year for copyright

### Content Placeholders to Replace

Replace these placeholders with your actual content:
   - `[CHAPTER/TOPIC]` - Current chapter or theme being discussed
   - `[EPISODE TITLE]` - Title of the featured episode
   - `[Brief episode description...]` - Summary of the episode content
   - `[EPISODE_LINK]` - Link to the episode (Acast, YouTube, etc.)
   - `[QUOTE OR INSIGHT...]` - Quote from the book or episode insight
   - `[Brief explanation...]` - Connection to mental health/ideals

3. **Test the email** (Mailchimp provides this):
   - Use Mailchimp's "Preview and Test" feature
   - Send a test email to yourself
   - Check on both desktop and mobile
   - Verify all links work and merge tags are replaced correctly

4. **Optional customizations**:
   - Add/remove sections as needed
   - Update social links if platforms change
   - Modify spacing or colors (inline styles only for email compatibility)

## Email Best Practices

- **Subject lines**: Keep under 50 characters, use Radiant language ("Your Next Step", "Journey Update", etc.)
- **Preview text**: First ~100 characters appear in inbox - make them compelling
- **Images**: Always include alt text for accessibility
- **Links**: Use full URLs and test all links before sending
- **Mobile**: Over 50% of emails are read on mobile - this template is responsive
- **Frequency**: Monthly is recommended to avoid overwhelming subscribers

## Adding New Templates

When creating new templates:
1. Use inline CSS (email clients don't support external stylesheets well)
2. Use tables for layout (email clients have limited flexbox/grid support)
3. Include the brand colors and Stormlight Archive theming
4. Test thoroughly across email clients
5. Include accessibility features (alt text, semantic HTML)
6. Add documentation here about the template's purpose

## Technical Notes

- **Max width**: 600px (standard for email templates)
- **Inline styles**: Required for email client compatibility
- **Tables**: Used for layout structure instead of divs
- **Fonts**: Using system fonts for maximum compatibility
- **Logo**: Hosted on thenextideal.com (must be web-accessible)

## Outlook & Gmail Compatibility

This template has been optimized for both Outlook and Gmail:

### Outlook Fixes:
- **VML (Vector Markup Language)** code for buttons with rounded corners
- **Conditional comments** `<!--[if mso]>` for Outlook-specific rendering
- **MSO-specific CSS** properties (`mso-table-lspace`, `mso-table-rspace`)
- **Gradient fallback** - Solid background color with VML gradient for Outlook
- **Border-collapse** on all tables to prevent spacing issues
- **Fixed width attributes** on images for consistency

### Gmail Fixes:
- **Inline CSS only** - No external stylesheets or `<style>` blocks in body
- **Text size adjustment prevention** - `-webkit-text-size-adjust: 100%`
- **Gmail link color override** protection
- **Under 102KB** - Stays well under Gmail's clipping threshold
- **Proper DOCTYPE** and namespaces for rendering

### Testing Checklist:
Before sending, test in:
- [ ] Gmail (web)
- [ ] Gmail (mobile app - iOS/Android)
- [ ] Outlook (Windows desktop)
- [ ] Outlook.com (web)
- [ ] Apple Mail (macOS/iOS)
- [ ] Yahoo Mail
- [ ] Use [Litmus](https://litmus.com) or [Email on Acid](https://www.emailonacid.com) for comprehensive testing

### Known Limitations:
- **Border-radius**: May not appear in older Outlook versions (VML buttons compensate)
- **Gradients**: Limited support, fallback to solid colors where needed
- **Emojis**: May render differently across clients (🎙️ 💭 ⚡ used sparingly)
