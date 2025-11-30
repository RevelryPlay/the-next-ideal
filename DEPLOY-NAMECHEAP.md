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

## Step 2: Run the Automated Setup (Recommended)

**One command does everything!** This script will:
- Install all dependencies (Node.js, PM2, Nginx, Git, GitHub CLI, Certbot)
- Authenticate with GitHub
- Clone your repository
- Set up your admin password
- Build and start your site
- Configure SSL certificate
- Set up your domain with Nginx

Just run this one command:

```bash
curl -fsSL https://raw.githubusercontent.com/RevelryPlay/the-next-ideal/main/scripts/first-run.sh | sudo bash
```

**The script will prompt you for:**
1. GitHub authentication (follow the prompts)
2. Your domain name (default: thenextideal.com)
3. Whether to include www subdomain
4. Your admin password

**That's it!** The script handles everything. Skip to the "Updating Your Site" section below.

---

## Alternative: Manual Setup

If you prefer to set up manually or the automated script doesn't work for you:

<details>
<summary>Click to expand manual setup steps</summary>

### Step 2a: Update the Server

```bash
apt update && apt upgrade -y
```

### Step 2b: Install Dependencies

**Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

**Install other tools:**
```bash
apt install -y git nginx certbot
npm install -g pm2
```

**Install GitHub CLI:**
```bash
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null
apt update && apt install -y gh
```

### Step 2c: Authenticate GitHub

```bash
gh auth login
```

### Step 2d: Download Your Site

```bash
mkdir -p /var/www
cd /var/www
gh repo clone RevelryPlay/the-next-ideal landing
cd landing
```

### Step 2e: Configure Your Site

```bash
cp server.config.example.js server.config.js
nano server.config.js
```

Change the password, then save: `Ctrl + X`, `Y`, `Enter`

### Step 2f: Build and Start

```bash
npm install
npm run build
pm2 start ecosystem.config.cjs
pm2 startup
pm2 save
```

### Step 2g: SSL Certificate

```bash
systemctl stop nginx
certbot certonly --standalone -d thenextideal.com -d www.thenextideal.com
```

### Step 2h: Configure Nginx

```bash
cp /var/www/landing/nginx.conf.example /etc/nginx/sites-available/thenextideal.com
ln -s /etc/nginx/sites-available/thenextideal.com /etc/nginx/sites-enabled/
nginx -t
systemctl start nginx
```

**Your site is now live at https://thenextideal.com!**

</details>

---

## Updating Your Site

**Easy way** - use the update script:

```bash
cd /var/www/landing
./scripts/rebuild-restart.sh
```

This script will:
- Show recent commits from GitHub
- Pull latest changes
- Install dependencies
- Rebuild the site
- Restart the server
- Show deployment status

**Manual way:**

```bash
cd /var/www/landing
git pull
npm install
npm run build
pm2 restart landing
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
| Update the site | `cd /var/www/landing && ./scripts/rebuild-restart.sh` |
| Check if site is running | `pm2 status` |
| View error messages | `pm2 logs landing` |
| Restart the site | `pm2 restart landing` |
| Stop the site | `pm2 stop landing` |
| View repo status | `gh repo view` |
| List pull requests | `gh pr list` |
| List releases | `gh release list` |

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
