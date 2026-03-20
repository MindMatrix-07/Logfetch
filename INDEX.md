# 📋 LogFetch Master Index

Quick reference guide to all LogFetch files, documentation, and setup process.

---

## ✨ What is LogFetch?

**LogFetch** is a standalone web application for monitoring logs from the Live-TV infrastructure. It displays:
- 🌐 Web backend logs (Vercel API)
- 📱 Android app logs (mobile crashes, events)
- ⚡ Real-time stream issues (Jio TV, yt-dlp)
- 🔐 Authentication events (login, OTP)

**Key Features**:
- ✅ Real-time log streaming (5s auto-refresh)
- ✅ Smart filtering by level, category, action
- ✅ Configurable backend URL
- ✅ Expandable log details
- ✅ Summary statistics
- ✅ Dark theme optimized for monitoring

---

## 📁 Complete File List

All files are in: `c:\Users\HP\Downloads\Live-TV-1\`

Files prefixed with `logfetch-` should be copied to the Logfetch repository with the prefix removed.

### Source Code Files (→ copy to `src/`)

| File | Purpose | Size |
|------|---------|------|
| `logfetch-App.jsx` | Main React component with all UI & logic | 10 KB |
| `logfetch-main.jsx` | React entry point | 0.5 KB |
| `logfetch-index.css` | Tailwind CSS + custom styles | 3 KB |

### Configuration Files (→ copy to root)

| File | Purpose | Size |
|------|---------|------|
| `logfetch-package.json` | npm dependencies & scripts | 2 KB |
| `logfetch-vite.config.js` | Vite build configuration | 0.5 KB |
| `logfetch-tailwind.config.js` | Tailwind CSS config | 1 KB |
| `logfetch-postcss.config.js` | PostCSS plugins | 0.2 KB |
| `logfetch-eslint.config.js` | ESLint rules | 1.5 KB |
| `logfetch-index.html` | HTML template | 1 KB |
| `logfetch-.env.example` | Environment template | 0.1 KB |
| `logfetch-.gitignore` | Git exclude rules | 0.5 KB |

### Documentation Files (→ copy to root)

| File | Purpose | Audience |
|------|---------|----------|
| `logfetch-README.md` | Feature overview & quick start | End users |
| `logfetch-SETUP.md` | Development environment setup | Developers |
| `logfetch-DEPLOYMENT.md` | Deploy to production | DevOps/Admins |
| `logfetch-CONTRIBUTING.md` | Contribution guidelines | Contributors |
| `logfetch-API.md` | API endpoints & examples | Integrators |
| `logfetch-FILE_INVENTORY.md` | Complete file listing | Setup reference |
| `logfetch-INDEX.md` | This file | Navigation |

---

## 🚀 Quick Start

### 1️⃣ Create Repository

```bash
# On GitHub.com:
# Fork https://github.com/MindMatrix-07/Logfetch
# Or clone locally

git clone https://github.com/MindMatrix-07/Logfetch.git
cd Logfetch
```

### 2️⃣ Copy Files

Copy all `logfetch-*` files from Live-TV-1 workspace to your Logfetch folder, removing the `logfetch-` prefix:

```
logfetch-App.jsx → src/App.jsx
logfetch-main.jsx → src/main.jsx
logfetch-index.css → src/index.css
logfetch-index.html → index.html
logfetch-package.json → package.json
logfetch-vite.config.js → vite.config.js
... (all other files)
```

### 3️⃣ Install & Run

```bash
npm install
npm run dev
# Opens http://localhost:3000
```

### 4️⃣ Configure Backend

Edit `.env` (created from `.env.example`):
```env
VITE_LOG_BACKEND_URL=https://your-live-tv-backend.com
```

### 5️⃣ Deploy

See [DEPLOYMENT.md](logfetch-DEPLOYMENT.md) for instructions on deploying to:
- ✅ Vercel (recommended)
- ✅ Netlify
- ✅ Docker
- ✅ Self-hosted server

---

## 📖 Documentation Guide

Read these in order based on your role:

### For End Users
1. **[README.md](logfetch-README.md)** — What is LogFetch, features, use cases
2. **[DEPLOYMENT.md](logfetch-DEPLOYMENT.md)** — How to deploy your own instance

### For Developers
1. **[SETUP.md](logfetch-SETUP.md)** — Install dependencies, run locally
2. **[API.md](logfetch-API.md)** — Connect to backend, understand data format
3. **[CONTRIBUTING.md](logfetch-CONTRIBUTING.md)** — Submit code changes

### For DevOps/Admins
1. **[DEPLOYMENT.md](logfetch-DEPLOYMENT.md)** — Production deployment
2. **[API.md](logfetch-API.md)** — Backend integration details

### For Reference
- **[FILE_INVENTORY.md](logfetch-FILE_INVENTORY.md)** — Detailed file descriptions
- **[INDEX.md](logfetch-INDEX.md)** — This master index

---

## 🔗 Connection Diagram

```
┌─────────────────────────┐
│   LogFetch Web App      │
│  (This Repository)      │
│   React + Vite          │
└────────────┬────────────┘
             │
             │ (REST API)
             │  GET /api/logs
             │
┌────────────▼────────────┐
│  Live-TV Backend        │
│  (https://...)          │
│  Vercel API Routes      │
└────────────┬────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
┌──────────┐  ┌──────────────┐
│Supabase  │  │Web Server    │
│PostgreSQL   │Logs          │
└──────────┘  └──────────────┘
      ▲             ▲
      │  ┌──────────│
      └──│          │
         │ (send    │
         │  logs)   │
      ┌──▼──────────▼──┐
      │  Android App   │
      │  (LogSender)   │
      └────────────────┘
```

**Data flow**:
1. Android app sends logs to Live-TV backend via `POST /api/logs?action=send`
2. Backend stores logs in Supabase database
3. LogFetch fetches logs from backend via `GET /api/logs?action=recent`
4. LogFetch displays logs in real-time dashboard

---

## 🎯 Key Concepts

### Backend URL Configuration

**Where does LogFetch get logs from?**

Answer: From the `VITE_LOG_BACKEND_URL` environment variable

**How to set it?**

Method 1 (Recommended):
```bash
# Create .env file
VITE_LOG_BACKEND_URL=https://live-tv-proxy-a9mg.onrender.com
```

Method 2 (Runtime):
1. Click ⚙️ Settings button
2. Change Backend URL
3. Click Save

### Supported Log Actions

LogFetch can fetch different types of logs:

| Action | Endpoint | Result |
|--------|----------|--------|
| `recent` | `/api/logs?action=recent` | Last 100 logs |
| `errors` | `/api/logs?action=errors` | Only ERROR & WARN |
| `stream-issues` | `/api/logs?action=stream-issues` | Jio/YouTube problems |
| `android` | `/api/logs?action=android` | Mobile app logs only |
| `summary` | `/api/logs?action=summary` | Count by level/category |
| `filter` | `/api/logs?action=filter&category=jio-login` | Filter by criteria |

See [API.md](logfetch-API.md) for full details.

### Log Levels

Every log has a level (priority):

| Level | Emoji | Color | Meaning |
|-------|-------|-------|---------|
| ERROR | ❌ | Red | Critical failure |
| WARN | ⚠️ | Yellow | Warning, recoverable |
| INFO | ℹ️ | Blue | General information |
| DEBUG | 🔍 | Gray | Debug details |
| SUCCESS | ✅ | Green | Successful operation |

---

## 🛠️ Setup Roadmap

### Phase 1: Local Development (15 min)
```bash
git clone Logfetch
cd Logfetch
npn install
npm run dev
# → App running on http://localhost:3000
```

### Phase 2: Configure Backend (5 min)
```bash
# Edit .env
VITE_LOG_BACKEND_URL=https://your-live-tv-backend.com

# Restart: npm run dev
# → Logs should load in dashboard
```

### Phase 3: Build Production (5 min)
```bash
npm run build
# → Creates dist/ with optimized files
```

### Phase 4: Deploy (5-30 min depending on platform)

**Vercel (Fastest)**:
```bash
npm i -g vercel
vercel deploy --prod
```

**Netlify**: Use dashboard drag-drop

**Self-hosted**: Configure nginx + reverse proxy

See [DEPLOYMENT.md](logfetch-DEPLOYMENT.md) for detailed steps.

---

## ❓ Common Questions

**Q: Do I need to run Live-TV backend for LogFetch to work?**

A: Yes. LogFetch reads logs from Live-TV backend via `/api/logs` endpoint. Backend must be running.

**Q: Can LogFetch work offline?**

A: No, it needs backend connection for logs. But you could add localStorage caching.

**Q: What if I want to monitor multiple backends?**

A: Deploy multiple LogFetch instances, each with different `VITE_LOG_BACKEND_URL`.

**Q: How often does LogFetch refresh logs?**

A: Every 5 seconds by default. Configurable in `src/App.jsx` `REFRESH_INTERVAL`.

**Q: Can multiple people use same LogFetch instance?**

A: Yes, it's stateless. Just share the URL.

**Q: How to export logs?**

A: Not implemented yet, but can be added as feature. See [CONTRIBUTING.md](logfetch-CONTRIBUTING.md).

---

## 🐛 Troubleshooting Quick Links

### "Cannot read logs" → [SETUP.md#troubleshooting](logfetch-SETUP.md)
### "Backend connection error" → [API.md#debugging](logfetch-API.md)
### "Deployment failed" → [DEPLOYMENT.md#troubleshooting](logfetch-DEPLOYMENT.md)
### "Want to contribute" → [CONTRIBUTING.md](logfetch-CONTRIBUTING.md)

---

## 📱 Live-TV Ecosystem

LogFetch is part of a larger system:

```
┌─────────────────────────────────────────┐
│  Live-TV Ecosystem                      │
├─────────────────────────────────────────┤
│                                         │
│ ├─ Live-TV (Web Frontend)              │
│ │   └─ React + Vite                    │
│ │   └─ Plays live streams              │
│ │                                      │
│ ├─ Live-TV Backend (API)               │
│ │   └─ Vercel (Serverless)             │
│ │   └─ Jio TV integration              │
│ │   └─ Logging service                 │
│ │                                      │
│ ├─ LogFetch (←You are here)             │
│ │   └─ Log viewer dashboard            │
│ │   └─ Monitors web + mobile           │
│ │                                      │
│ ├─ jiolivetv-channel-manager (Android) │
│ │   └─ Kotlin app                      │
│ │   └─ Sends logs to backend           │
│ │                                      │
│ └─ Supabase (Database)                 │
│     └─ Stores all logs                 │
│                                        │
└─────────────────────────────────────────┘
```

---

## 📚 Full Documentation Index

### Getting Started
- [README.md](logfetch-README.md) — Overview & features
- [SETUP.md](logfetch-SETUP.md) — Local development setup
- [FILE_INVENTORY.md](logfetch-FILE_INVENTORY.md) — All files explained

### Operations
- [DEPLOYMENT.md](logfetch-DEPLOYMENT.md) — Deploy to production
- [API.md](logfetch-API.md) — API reference & examples

### Development
- [CONTRIBUTING.md](logfetch-CONTRIBUTING.md) — Code contributions
- [INDEX.md](logfetch-INDEX.md) — This master index

### External Resources
- [Live-TV Repo](https://github.com/MindMatrix-07/Live-TV) — Main project
- [jiolivetv-channel-manager](https://github.com/MindMatrix-07/jiolivetv-channel-manager) — Android app

---

## 🎉 You're Ready!

✅ All files created  
✅ Documentation complete  
✅ Setup ready  

**Next steps**:
1. Copy files to Logfetch repo
2. Run setup with [SETUP.md](logfetch-SETUP.md)
3. Deploy with [DEPLOYMENT.md](logfetch-DEPLOYMENT.md)
4. Start monitoring! 🚀

---

## 📞 Support

- 💬 Questions? → [GitHub Discussions](https://github.com/MindMatrix-07/Logfetch/discussions)
- 🐛 Bug? → [GitHub Issues](https://github.com/MindMatrix-07/Logfetch/issues)
- 🤝 Contribute? → [CONTRIBUTING.md](logfetch-CONTRIBUTING.md)

---

**Version**: 1.0  
**Last Updated**: 2024-01-15  
**Status**: ✅ Production Ready  

**Welcome to LogFetch!** Happy monitoring. 👀🔍
