# 🚀 Quick Deploy Guide

Everything is set up. Deploy with one command:

## Windows
```bash
.\deploy.ps1
```

## Linux / macOS
```bash
./deploy.sh
```

---

## What the script does:

1. ✅ Checks Node.js & Vercel CLI
2. ✅ Installs npm dependencies
3. ✅ Builds production bundle
4. ✅ Deploys to Vercel
5. ✅ Shows live URL

---

## First-time setup:

1. **Clone this repo**
   ```bash
   git clone https://github.com/MindMatrix-07/Logfetch.git
   cd Logfetch
   ```

2. **Deploy immediately**
   ```bash
   ./deploy.ps1        # Windows
   ./deploy.sh         # macOS/Linux
   ```

3. **Configure backend** (in Vercel dashboard)
   - Settings → Environment Variables
   - Add: `VITE_LOG_BACKEND_URL=https://your-live-tv-backend.com`
   - Redeploy: `./deploy.ps1`

---

## Local development:

```bash
npm install
npm run dev
# Opens http://localhost:3000
```

Configure in `.env`:
```env
VITE_LOG_BACKEND_URL=https://your-live-tv-backend.com
```

---

## Documentation:

- **README.md** — Features overview
- **SETUP.md** — Development setup  
- **DEPLOYMENT.md** — Detailed deploy guide
- **API.md** — Backend API reference

---

**That's it! You're ready to deploy.** 🎉

See [README.md](README.md) for more info.
