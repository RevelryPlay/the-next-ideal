# Deploying to Namecheap VPS

A step-by-step guide to get your site live. Each step builds on the previous one - follow them in order.

---

## Before You Start

You'll need:
- A Namecheap VPS (any Linux plan)
- Your domain's DNS pointed to your server's IP address
- About 30 minutes

**What we're setting up:**
- Your site's code on the server
- A process to keep it running 24/7
- HTTPS security (the padlock in browsers)

---

## Step 1: Connect to Your Server

1. Log into Namecheap and go to **Hosting List** > your VPS > **Manage**
2. Note your **server IP** and **root password**
3. Open Terminal (Mac) or PowerShell (Windows)
4. Type this command (replace YOUR_SERVER_IP with your actual IP):

```bash
ssh root@YOUR_SERVER_IP
```

5. Enter your password when asked (you won't see it as you type - that's normal)

You're now connected to your server!

---

## Step 2: Set Up the Server

Copy and paste these commands one at a time. Wait for each to finish before running the next.

**Update the server:**
```bash
apt update && apt upgrade -y
```

**Install Node.js (runs your site):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

**Install PM2 (keeps your site running):**
```bash
npm install -g pm2
```

**Install Nginx (connects your domain to your site):**
```bash
apt install -y nginx
```

**Install Git (downloads your code):**
```bash
apt install -y git
```

---

## Step 3: Download Your Site

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git landing
cd landing
```

Replace `YOUR_USERNAME/YOUR_REPO` with your actual GitHub repository path.

---

## Step 4: Configure Your Site

**Set up the admin password:**
```bash
cp server.config.example.js server.config.js
nano server.config.js
```

Change `'change-this-password'` to a secure password you'll remember.

Save the file: Press `Ctrl + X`, then `Y`, then `Enter`

**Install and build:**
```bash
npm install
npm run build
```

---

## Step 5: Start Your Site

```bash
pm2 start ecosystem.config.cjs
pm2 startup
pm2 save
```

Your site is now running! But it's only accessible via the IP address. Next we'll connect your domain.

---

## Step 6: Get an SSL Certificate

This gives your site the secure padlock (HTTPS).

First, temporarily stop nginx:
```bash
systemctl stop nginx
```

Then get your certificate (replace with your domain if different):
```bash
apt install -y certbot
certbot certonly --standalone -d thenextideal.com -d www.thenextideal.com
```

Follow the prompts - you'll need to enter an email address.

---

## Step 7: Connect Your Domain

Copy the nginx configuration file from your project:
```bash
cp /var/www/landing/nginx.conf.example /etc/nginx/sites-available/thenextideal.com
ln -s /etc/nginx/sites-available/thenextideal.com /etc/nginx/sites-enabled/
```

Test and start nginx:
```bash
nginx -t
systemctl start nginx
```

**Your site is now live at https://thenextideal.com!**

---

## Updating Your Site

When you make changes to your code:

```bash
cd /var/www/landing
git pull
npm install
npm run build
pm2 restart ecosystem.config.cjs
```

---

## Downloading Your Email List

The easiest way:

1. Go to `https://thenextideal.com/admin`
2. Enter your admin password
3. Click "Download CSV"

---

## Quick Reference

| What you want to do | Command |
|---------------------|---------|
| Check if site is running | `pm2 status` |
| View error messages | `pm2 logs landing` |
| Restart the site | `pm2 restart ecosystem.config.cjs` |
| Stop the site | `pm2 stop landing` |

---

## Something Not Working?

**Site won't load:**
1. Run `pm2 status` - you should see "landing" with status "online"
2. Run `pm2 logs landing` to see any error messages
3. Run `systemctl status nginx` - it should say "active (running)"

**Can't connect to server:**
1. Double-check your server IP in Namecheap
2. Try resetting the root password in your Namecheap panel

**SSL certificate errors:**
```bash
certbot renew --dry-run
```

---

## Need More Help?

- Namecheap Support: https://www.namecheap.com/support/
- PM2 Documentation: https://pm2.keymetrics.io/docs
