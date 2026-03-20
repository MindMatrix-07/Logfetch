# 🚀 LogFetch Deployment Guide

Step-by-step instructions to deploy LogFetch to production.

---

## Prerequisites

- Node.js 18+ installed
- Git account (GitHub)
- Vercel account (free) or Netlify account
- Live-TV backend URL (from your Live-TV deployment)

---

## Option 1: Deploy to Vercel (Recommended for Speed)

### Step 1: Prepare Your Local Environment

```bash
# Clone the Logfetch repository
git clone https://github.com/MindMatrix-07/Logfetch.git
cd Logfetch

# Install dependencies
npm install

# Verify it works locally
npm run dev
# Should open http://localhost:3000 in browser
```

### Step 2: Configure Environment

Copy the environment template:
```bash
cp .env.example .env
```

Edit `.env` with your actual backend URL:
```env
VITE_LOG_BACKEND_URL=https://your-live-tv-backend.com
```

Test locally:
```bash
npm run dev
# Visit http://localhost:3000
# Settings button should show your backend URL
```

### Step 3: Build & Push to Git

```bash
# Commit your configuration
git add .
git commit -m "chore: configure backend URL"
git push origin main
```

### Step 4: Deploy to Vercel

**Option A: Via Vercel CLI (Quick)**

```bash
# Install Vercel CLI globally (one-time)
npm i -g vercel

# Deploy from your project directory
cd /path/to/Logfetch
vercel deploy --prod

# Follow prompts:
# - Link to existing project? → No (first time)
# - Project name? → Logfetch
# - Framework? → Vite
# - Build settings? → Use defaults
```

**Option B: Via Vercel Dashboard (Click-Based)**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Select your GitHub account
4. Import `Logfetch` repository
5. Framework preset → Vite
6. Environment Variables section:
   - Add `VITE_LOG_BACKEND_URL` = `https://your-live-tv-url.com`
7. Click "Deploy"

### Step 5: Verify Deployment

Once deployment completes:

```bash
# You'll get a URL like: https://logfetch-xxxxx.vercel.app

# Test the endpoint in browser
curl https://logfetch-xxxxx.vercel.app/api/logs?action=summary

# Or visit the dashboard
https://logfetch-xxxxx.vercel.app
```

### Step 6: Set Custom Domain (Optional)

In Vercel Dashboard:
1. Go to your Logfetch project
2. Settings → Domains
3. Add custom domain (e.g., `logs.yourdomain.com`)
4. Update DNS records as instructed

---

## Option 2: Deploy to Netlify

### Step 1: Prepare Repository

```bash
git clone https://github.com/MindMatrix-07/Logfetch.git
cd Logfetch
npm install
```

### Step 2: Build Locally

```bash
npm run build
# Creates 'dist' folder with production files
```

### Step 3: Deploy Via Netlify UI

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Deploy manually"
3. Drag your `dist` folder into the upload area
4. Wait for build to complete

### Step 4: Configure Environment

1. In Netlify dashboard, go to Site settings
2. Environment → Environment variables
3. Add new variable:
   - Name: `VITE_LOG_BACKEND_URL`
   - Value: `https://your-live-tv-backend.com`
4. Redeploy site

### Step 5: Update Build Command

1. Site settings → Build & deploy
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Save

---

## Option 3: Deploy to Docker

### Step 1: Create Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Install serve to run the app
RUN npm install -g serve

# Copy built files
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Set environment variables
ENV VITE_LOG_BACKEND_URL=http://localhost:3000

# Start the app
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Step 2: Build Docker Image

```bash
docker build -t logfetch:latest .
```

### Step 3: Run Container

```bash
docker run \
  -p 3000:3000 \
  -e VITE_LOG_BACKEND_URL=https://your-live-tv-backend.com \
  logfetch:latest
```

Visit: `http://localhost:3000`

---

## Option 4: Deploy to Self-Hosted Server (SSH)

### Step 1: Connect to Server

```bash
ssh user@your-server.com
```

### Step 2: Clone & Setup

```bash
# Install Node.js 18+
curl -sL https://deb.nodesource.com/setup_18.x | bash
apt install nodejs

# Clone repo
cd /var/www
git clone https://github.com/MindMatrix-07/Logfetch.git
cd Logfetch

# Install dependencies
npm install

# Create .env file
cp .env.example .env
echo "VITE_LOG_BACKEND_URL=https://your-live-tv-backend.com" >> .env
```

### Step 3: Build & Start

```bash
# Build production bundle
npm run build

# Install PM2 (process manager)
npm install -g pm2

# Start with PM2
pm2 start "npm run preview" --name logfetch

# Save PM2 config to auto-restart on reboot
pm2 startup
pm2 save
```

### Step 4: Setup Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/logfetch
```

Add:
```nginx
server {
    listen 80;
    server_name logs.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/logfetch /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Setup HTTPS with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d logs.yourdomain.com
```

---

## Updating Deployment

### Update Backend URL

**Vercel**:
1. Dashboard → Project settings → Environment variables
2. Edit `VITE_LOG_BACKEND_URL`
3. Redeploy: `vercel deploy --prod`

**Netlify**:
1. Site settings → Environment
2. Edit variable
3. Trigger redeploy

**Self-hosted**:
```bash
cd /var/www/Logfetch
nano .env
# Update URL
npm run build
pm2 restart logfetch
```

### Update to Latest Code

```bash
cd /path/to/Logfetch
git pull origin main
npm install
npm run build

# For Vercel/Netlify: automatically redeploys on git push
# For self-hosted:
pm2 restart logfetch
```

---

## Troubleshooting Deployment

### "Backend connection error"

**Cause**: Backend URL not set or unreachable

**Fix**:
```bash
# Verify .env file has correct URL
cat .env | grep VITE_LOG_BACKEND_URL

# Test backend is reachable
curl https://your-live-tv-backend.com/api/logs?action=summary
```

### "Build fails with missing dependencies"

**Fix**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### "Port 3000 already in use"

**Fix** (Self-hosted):
```bash
ps aux | grep node
kill -9 <PID>

# Or use different port
PORT=3001 npm run preview
```

### "CORS error when fetching logs"

**Cause**: Backend doesn't allow LogFetch origin

**Fix**: Contact Live-TV admin to add LogFetch URL to CORS whitelist

---

## Monitoring Deployment

### Check Vercel Deployment

```bash
vercel logs
# Shows recent deployment errors
```

### Check Self-Hosted Logs

```bash
pm2 logs logfetch
# Real-time application logs

pm2 status
# Show running processes
```

### Monitor Performance

**Vercel**: Dashboard → Analytics tab

**Netlify**: Site settings → Analytics

**Self-hosted**: Use New Relic, Datadog, or similar APM tool

---

## Rollback Deployment

### Vercel

```bash
vercel rollback
# Shows recent deployments, select which to rollback to
```

### Netlify

1. Deploys tab → Select previous successful deploy → Publish

### Git (All platforms)

```bash
git log --oneline
git revert <commit-hash>
git push
# Auto-redeploys with reverted code
```

---

## Scaling & Performance

### CDN Configuration

**Vercel**: Automatic via CDN, no config needed

**Netlify**: Automatic via Netlify CDN

**Self-hosted**: Add Cloudflare in front:
1. Update DNS to point to Cloudflare
2. Enable caching for static assets
3. Minimize JS/CSS in build

### Caching Headers

Already configured in Vite to cache static assets for 1 year.

### Bundle Size Optimization

Current: ~150KB gzip

To reduce:
```bash
npm run build
# Analyze with:
npm install --save-dev vite-plugin-visualizer
```

---

## Security Checklist

- [ ] Environment variables not committed to git
- [ ] .env file added to .gitignore
- [ ] Backend URL uses HTTPS
- [ ] CORS headers properly configured
- [ ] No sensitive data in localStorage
- [ ] CSP headers set (if self-hosted)
- [ ] HTTPS enabled (Let's Encrypt for self-hosted)

---

## Production Checklist

- [ ] Deployment tested with actual Live-TV backend
- [ ] Logs loading within 5 seconds
- [ ] Filters working correctly
- [ ] Error display shows helpful messages
- [ ] Dark theme rendering properly
- [ ] Mobile responsive (on smaller screens)
- [ ] Auto-refresh working (5s intervals)
- [ ] Settings panel updates backend URL correctly

---

## Support

Deployment issues?
- Check [Live-TV Docs](https://github.com/MindMatrix-07/Live-TV)
- Open issue on [GitHub](https://github.com/MindMatrix-07/Logfetch/issues)
- Include deployment platform, error message, and environment details

---

**You're deployed! 🎉 Visit your LogFetch instance now.**
