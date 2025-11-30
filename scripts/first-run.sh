#!/bin/bash

# First Run Setup Script for Namecheap VPS Deployment
# This script installs system dependencies, clones the repository, and starts the server
#
# USAGE Option 1 - One-liner remote execution (recommended):
#        curl -fsSL https://raw.githubusercontent.com/RevelryPlay/the-next-ideal/main/scripts/first-run.sh | sudo bash
#
# USAGE Option 2 - SCP and run locally:
#        scp first-run.sh user@server:~/
#        ssh user@server
#        sudo ./first-run.sh

set -e  # Exit on any error

echo "🚀 Starting first-run setup for The Next Ideal..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="git@github.com:RevelryPlay/the-next-ideal.git"
INSTALL_DIR="/var/www"
PROJECT_NAME="landing"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
   echo -e "${RED}Please run this script with sudo${NC}"
   echo ""
   echo "Local execution:"
   echo "  sudo ./first-run.sh"
   echo ""
   echo "Remote execution:"
   echo "  curl -fsSL https://raw.githubusercontent.com/RevelryPlay/the-next-ideal/main/scripts/first-run.sh | sudo bash"
   exit 1
fi

# Get the actual user (when using sudo)
ACTUAL_USER="${SUDO_USER:-$USER}"

# Prompt for domain name
echo -e "${YELLOW}Enter your domain name (default: thenextideal.com):${NC}"
read -p "Domain [thenextideal.com]: " DOMAIN_NAME

# Use default if empty
if [ -z "$DOMAIN_NAME" ]; then
  DOMAIN_NAME="thenextideal.com"
fi

echo "Using domain: $DOMAIN_NAME"
echo ""

# Prompt for www subdomain
echo -e "${YELLOW}Do you want to include www.$DOMAIN_NAME? (default: yes):${NC}"
read -p "Include www [Y/n]: " INCLUDE_WWW

# Use default if empty
if [ -z "$INCLUDE_WWW" ]; then
  INCLUDE_WWW="y"
fi

echo ""

# Step 0: Update system
echo -e "${BLUE}Step 0: Updating system packages...${NC}"
apt update && apt upgrade -y
echo -e "${GREEN}✓ System updated${NC}"
echo ""

# Step 1: Install system dependencies
echo -e "${BLUE}Step 1: Installing system dependencies...${NC}"

# Check and install Git
if ! command -v git &> /dev/null; then
  echo "📦 Git is not installed. Installing..."
  apt install -y git
  echo -e "${GREEN}✓ Git installed${NC}"
else
  echo "✓ Git is already installed: $(git --version)"
fi

# Check and install Node.js
if ! command -v node &> /dev/null; then
  echo "📦 Node.js is not installed. Installing..."

  # Install Node.js 20.x from NodeSource
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs

  echo -e "${GREEN}✓ Node.js installed: $(node --version)${NC}"
else
  echo "✓ Node.js is already installed: $(node --version)"
fi

# Check and install nginx
if ! command -v nginx &> /dev/null; then
  echo "📦 nginx is not installed. Installing..."
  apt install -y nginx
  echo -e "${GREEN}✓ nginx installed${NC}"
else
  echo "✓ nginx is already installed"
fi

# Check and install certbot
if ! command -v certbot &> /dev/null; then
  echo "📦 certbot is not installed. Installing..."
  apt install -y certbot
  echo -e "${GREEN}✓ certbot installed${NC}"
else
  echo "✓ certbot is already installed"
fi

# Check and install GitHub CLI
if ! command -v gh &> /dev/null; then
  echo "📦 GitHub CLI is not installed. Installing..."
  # Install GitHub CLI from their official repository
  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
  chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null
  apt update
  apt install -y gh
  echo -e "${GREEN}✓ GitHub CLI installed${NC}"
else
  echo "✓ GitHub CLI is already installed: $(gh --version | head -n1)"
fi

echo -e "${GREEN}✓ All system dependencies installed${NC}"
echo ""

# Step 1.5: Authenticate GitHub CLI
echo -e "${BLUE}Step 1.5: Authenticating GitHub CLI...${NC}"
if sudo -u $ACTUAL_USER gh auth status &> /dev/null; then
  echo "✓ GitHub CLI is already authenticated"
else
  echo -e "${YELLOW}GitHub CLI needs authentication.${NC}"
  echo "Please follow the prompts to authenticate with GitHub:"
  echo ""
  sudo -u $ACTUAL_USER gh auth login
  echo -e "${GREEN}✓ GitHub CLI authenticated${NC}"
fi
echo ""

# Step 2: Clone repository
echo -e "${BLUE}Step 2: Cloning repository...${NC}"
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

if [ -d "$PROJECT_NAME" ]; then
  echo "⚠️  Directory $PROJECT_NAME already exists. Skipping clone."
else
  echo "Cloning repository using GitHub CLI..."
  sudo -u $ACTUAL_USER gh repo clone RevelryPlay/the-next-ideal "$PROJECT_NAME"
  echo -e "${GREEN}✓ Repository cloned to $INSTALL_DIR/$PROJECT_NAME${NC}"
fi
echo ""

# Navigate into the project
cd "$INSTALL_DIR/$PROJECT_NAME"

# Set up group permissions for user and nginx
echo -e "${BLUE}Step 2.1: Setting up file permissions...${NC}"

# Add user to www-data group (nginx runs as www-data)
usermod -a -G www-data $ACTUAL_USER

# Change ownership to user:www-data
chown -R $ACTUAL_USER:www-data "$INSTALL_DIR/$PROJECT_NAME"

# Set directory permissions to 775 (rwxrwxr-x)
find "$INSTALL_DIR/$PROJECT_NAME" -type d -exec chmod 775 {} \;

# Set file permissions to 664 (rw-rw-r--)
find "$INSTALL_DIR/$PROJECT_NAME" -type f -exec chmod 664 {} \;

# Set setgid bit on directories so new files inherit the group
find "$INSTALL_DIR/$PROJECT_NAME" -type d -exec chmod g+s {} \;

# Make scripts executable
chmod +x "$INSTALL_DIR/$PROJECT_NAME/scripts/"*.sh 2>/dev/null || true

echo -e "${GREEN}✓ File permissions configured${NC}"
echo -e "  - User '$ACTUAL_USER' added to 'www-data' group"
echo -e "  - Directory ownership: $ACTUAL_USER:www-data"
echo -e "  - User and nginx can read/write files"
echo ""

# Step 3: Setup server configuration
echo -e "${BLUE}Step 3: Setting up server configuration...${NC}"
if [ ! -f "server.config.js" ]; then
  # Prompt for admin password
  echo -e "${YELLOW}Please enter an admin password for the server:${NC}"
  read -s -p "Password: " ADMIN_PASSWORD
  echo ""
  read -s -p "Confirm password: " ADMIN_PASSWORD_CONFIRM
  echo ""

  # Check if passwords match
  if [ "$ADMIN_PASSWORD" != "$ADMIN_PASSWORD_CONFIRM" ]; then
    echo -e "${YELLOW}⚠️  Passwords don't match. Using default - you'll need to edit server.config.js manually.${NC}"
    cp server.config.example.js server.config.js
  else
    # Create server.config.js with the provided password
    cat > server.config.js << EOF
/**
 * Server Configuration (sensitive values)
 *
 * SETUP: Copy this file to server.config.js and update the values
 *        cp server.config.example.js server.config.js
 */

export const ADMIN_PASSWORD = '$ADMIN_PASSWORD';
EOF
    echo -e "${GREEN}✓ Created server.config.js with your password${NC}"
  fi
else
  echo "✓ server.config.js already exists"
fi
echo ""

# Step 4: Install dependencies
echo -e "${BLUE}Step 4: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 5: Build project
echo -e "${BLUE}Step 5: Building project...${NC}"
npm run build
echo -e "${GREEN}✓ Project built${NC}"
echo ""

# Step 6: Check if pm2 is installed
echo -e "${BLUE}Step 6: Checking pm2 installation...${NC}"
if ! command -v pm2 &> /dev/null; then
  echo "⚠️  pm2 is not installed. Installing globally..."
  npm install -g pm2
  echo -e "${GREEN}✓ pm2 installed${NC}"
else
  echo "✓ pm2 is already installed"
fi
echo ""

# Step 7: Start pm2 server
echo -e "${BLUE}Step 7: Starting pm2 server...${NC}"
# Run pm2 as the actual user, not root
sudo -u $ACTUAL_USER pm2 start ecosystem.config.cjs
echo -e "${GREEN}✓ Server started${NC}"
echo ""

# Step 8: Setup pm2 to start on boot
echo -e "${BLUE}Step 8: Configuring pm2 to start on system boot...${NC}"
sudo -u $ACTUAL_USER pm2 startup systemd -u $ACTUAL_USER --hp /home/$ACTUAL_USER | grep -v "PM2" | bash
sudo -u $ACTUAL_USER pm2 save
echo -e "${GREEN}✓ pm2 configured to start on boot${NC}"
echo ""

# Step 9: Get SSL Certificate
echo -e "${BLUE}Step 9: Obtaining SSL certificate...${NC}"
systemctl stop nginx

if [ "$INCLUDE_WWW" = "y" ] || [ "$INCLUDE_WWW" = "Y" ]; then
  certbot certonly --standalone -d $DOMAIN_NAME -d www.$DOMAIN_NAME --non-interactive --agree-tos --register-unsafely-without-email
else
  certbot certonly --standalone -d $DOMAIN_NAME --non-interactive --agree-tos --register-unsafely-without-email
fi

echo -e "${GREEN}✓ SSL certificate obtained${NC}"
echo ""

# Step 10: Configure nginx
echo -e "${BLUE}Step 10: Configuring nginx...${NC}"

# Create nginx config from template
if [ "$INCLUDE_WWW" = "y" ] || [ "$INCLUDE_WWW" = "Y" ]; then
  # Use the template with www subdomain
  sed "s/thenextideal.com/$DOMAIN_NAME/g" nginx.conf.example > /etc/nginx/sites-available/$DOMAIN_NAME
else
  # Create config without www subdomain
  cat > /etc/nginx/sites-available/$DOMAIN_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN_NAME;

    return 301 https://$DOMAIN_NAME\$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name $DOMAIN_NAME;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /assets/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }
}
EOF
fi

# Enable the site
ln -sf /etc/nginx/sites-available/$DOMAIN_NAME /etc/nginx/sites-enabled/

# Test nginx configuration
nginx -t

# Start nginx
systemctl enable nginx
systemctl start nginx

echo -e "${GREEN}✓ nginx configured and started${NC}"
echo ""

# Final instructions
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "Your site is now live at: https://$DOMAIN_NAME"
echo "Server is running on port 3000"
echo "Project location: $INSTALL_DIR/$PROJECT_NAME"
echo ""
echo "Admin panel: https://$DOMAIN_NAME/admin"
echo "Admin password: (the one you set during setup)"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: User '$ACTUAL_USER' has been added to the 'www-data' group.${NC}"
echo -e "${YELLOW}    Log out and log back in for group changes to take effect.${NC}"
echo ""
echo "File permissions:"
echo "  - Owner: $ACTUAL_USER"
echo "  - Group: www-data (shared with nginx)"
echo "  - You can read/write all files in $INSTALL_DIR/$PROJECT_NAME"
echo "  - New files will automatically inherit www-data group"
echo ""
echo "Useful commands:"
echo "  pm2 status          - Check server status"
echo "  pm2 logs landing    - View server logs"
echo "  pm2 stop landing    - Stop the server"
echo "  pm2 restart landing - Restart the server"
echo "  systemctl status nginx - Check nginx status"
echo "  certbot renew --dry-run - Test SSL certificate renewal"
echo ""
echo "GitHub CLI commands:"
echo "  gh repo view        - View repository details"
echo "  gh release list     - List releases"
echo "  gh pr list          - List pull requests"
echo "  gh run list         - List workflow runs"
echo ""
echo "To rebuild and restart in the future:"
echo "  cd $INSTALL_DIR/$PROJECT_NAME"
echo "  ./scripts/rebuild-restart.sh"
