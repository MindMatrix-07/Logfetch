# 🛠️ LogFetch Setup Guide

Complete guide to set up and run LogFetch locally for development.

---

## System Requirements

- **Node.js**: 18+ LTS
- **npm**: 9+ or yarn/pnpm
- **Git**: Latest version
- **RAM**: 2GB minimum
- **Disk Space**: 500MB
- **OS**: Windows, macOS, or Linux

---

## Installation Steps

### 1. Check Prerequisites

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version (should be 9+)
npm --version

# Check Git
git --version
```

If versions are old, install latest from:
- Node.js: https://nodejs.org/
- Git: https://git-scm.com/

### 2. Clone Repository

```bash
# Clone Logfetch
git clone https://github.com/MindMatrix-07/Logfetch.git

# Navigate to project
cd Logfetch

# Verify you're in the right directory
pwd  # Should end with /Logfetch
ls   # Should show package.json, src/, index.html, etc.
```

### 3. Install Dependencies

```bash
# Install all npm packages
npm install

# Verify installation
npm list | head -20
# Should show react, vite, axios, etc.
```

**What was installed?**
- `react` & `react-dom` — UI framework
- `vite` — Build tool & dev server
- `axios` — HTTP client
- `tailwindcss` — Styling
- `lucide-react` — Icons
- `date-fns` — Date formatting

### 4. Create Environment File

```bash
# Copy template
cp .env.example .env

# Edit with your backend URL
nano .env
```

For development, use your Live-TV backend:

```env
# .env file
VITE_LOG_BACKEND_URL=https://your-live-tv-backend.com

# Or for local live-tv development:
VITE_LOG_BACKEND_URL=http://localhost:5000
```

### 5. Verify Configuration

```bash
# Check .env was created
cat .env
# Should show VITE_LOG_BACKEND_URL=...

# Check it's in .gitignore (don't commit secrets)
cat .gitignore | grep .env
# Should include .env
```

---

## Running Development Server

### Start the App

```bash
npm run dev
```

**Expected output**:
```
  VITE v5.0.0  ready in 342 ms

  ➜  Local:   http://localhost:3000/
  ➜  Press h to show help
```

### Open in Browser

The app should automatically open. If not:
```bash
# Manually open
open http://localhost:3000
# Or on Windows:
start http://localhost:3000
```

### See the UI

You should see:
- LogFetch header
- Settings button (⚙️) in top-right
- Backend URL displays below header
- Filters panel on left
- Main log area (empty initially if no backend activity)
- Summary stats bar

### Test Backend Connection

1. Click ⚙️ Settings button
2. Enter your Live-TV backend URL
3. Click Save
4. Logs should start loading in 5 seconds

---

## Project Structure

```
Logfetch/
│
├── src/
│   ├── App.jsx ...................... Main component (280 lines)
│   │   ├── State: logs, filters, backend config
│   │   ├── fetchLogs() .............. Axios GET to backend
│   │   ├── handleFilter() ........... Update filter state
│   │   └── Renders UI
│   │
│   ├── main.jsx ..................... Entry point (10 lines)
│   │   └── ReactDOM.render(App)
│   │
│   └── index.css .................... Tailwind styles (100 lines)
│       ├── @tailwind directives
│       ├── Custom scrollbar
│       └── Dark theme colors
│
├── index.html ....................... HTML template (20 lines)
│   ├── Meta tags
│   ├── <div id="root">
│   └── Script src: /src/main.jsx
│
├── vite.config.js ................... Build config (15 lines)
│   ├── React plugin
│   ├── Dev server: port 3000
│   └── Auto-open: true
│
├── tailwind.config.js ............... Tailwind config (25 lines)
│   ├── Content paths
│   ├── Custom colors
│   └── Theme extensions
│
├── postcss.config.js ................ CSS processing (5 lines)
│   ├── Tailwind plugin
│   └── Autoprefixer
│
├── eslint.config.js ................. Linting config (35 lines)
│   ├── React plugin
│   └── React Hooks plugin
│
├── .env.example ..................... Environment template (1 line)
│   └── VITE_LOG_BACKEND_URL=...
│
├── .env (created locally) ........... Environment variables (1 line)
│   └── VITE_LOG_BACKEND_URL=your-url
│
├── .gitignore ....................... Git exclude rules (20 lines)
│   ├── node_modules/
│   ├── dist/
│   └── .env (never commit!)
│
├── package.json ..................... Dependencies & scripts (60 lines)
│   ├── react, vite, axios, etc.
│   └── Scripts: dev, build, preview, lint
│
├── package-lock.json ................ Dependency lock file
│   └── (auto-generated, don't edit)
│
├── README.md ........................ Feature overview
├── DEPLOYMENT.md .................... Deployment guide
└── SETUP.md ......................... This file
```

---

## Common Tasks

### Hot Module Replacement (HMR)

When you edit files, changes appear instantly without refresh:

```bash
# While npm run dev is running:

# Edit src/App.jsx
# → Browser automatically updates
# → State preserved (fast feedback)
```

### Build for Production

```bash
# Create optimized dist/ folder
npm run build

# Output shows:
# dist/index.html
# dist/assets/index-xxxxx.js
# dist/assets/index-xxxxx.css
```

### Preview Production Build

```bash
# Build first
npm run build

# Then preview
npm run preview

# Opens http://localhost:4173
# Tests production behavior locally
```

### Run Linter

```bash
# Check for code issues
npm run lint

# Should show no errors for LogFetch files
```

### Clean Install

If you encounter package conflicts:

```bash
# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Fresh install
npm install

# Start dev server
npm run dev
```

---

## Debugging

### Browser DevTools

1. Open DevTools: `F12` or `Ctrl+Shift+I` or `⌘+Option+I`
2. Console tab: See logs, errors, API responses
3. Network tab: Monitor API calls to backend
4. Sources tab: Breakpoints in src/App.jsx

### Common Errors

**Module not found**
```
Error: Cannot find module 'axios'
```

Fix:
```bash
npm install
npm run dev
```

**Backend connection failed**
```
Error: Network Error
```

Fix:
1. Check backend URL in .env
2. Verify backend is running
3. Check CORS headers from backend
4. Try: `curl <backend-url>/api/logs?action=summary`

**Port 3000 already in use**
```
EADDRINUSE: address already in use :::3000
```

Fix:
```bash
# Kill process on port 3000
lsof -i :3000  # Find process ID
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Debug Logs

Add console.log in React components:

```jsx
// In App.jsx
const fetchLogs = async () => {
  console.log('Fetching logs...', { backendUrl, filter });
  try {
    const response = await axios.get(`${backendUrl}/api/logs?action=${filter.action}`);
    console.log('Logs received:', response.data);
    setLogs(response.data.logs || []);
  } catch (error) {
    console.error('Fetch error:', error.message, error.response?.data);
  }
};
```

View in: DevTools → Console tab

---

## Configuration

### Change Development Port

```bash
# Method 1: Environment variable
PORT=3001 npm run dev

# Method 2: Edit vite.config.js
export default {
  plugins: [react()],
  server: {
    port: 3001,
    open: true
  }
}
```

### Change Backend URL at Runtime

In browser:
1. Click ⚙️ Settings button (top-right)
2. Change "Backend URL" field
3. Click Save
4. Logs refresh within 5 seconds

---

## Git Workflow

### Commit Changes

```bash
# Check what changed
git status

# Stage changes
git add .

# Commit with message
git commit -m "feat: add new filter type"

# Push to GitHub
git push origin main
```

### Pull Latest Updates

```bash
# Fetch latest code
git pull origin main

# Reinstall dependencies (if package.json changed)
npm install

# Restart dev server
npm run dev
```

---

## Dependency Management

### Add New Package

```bash
# Install package
npm install package-name

# Or with specific version
npm install package-name@1.2.3

# Git will track package-lock.json change
git add package.json package-lock.json
git commit -m "chore: add package-name"
```

### Remove Package

```bash
npm uninstall package-name
```

### Update Packages

```bash
# Check for updates
npm outdated

# Update all
npm update

# Or specific package
npm install package-name@latest
```

---

## Coding Standards

### Component Structure

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function LogFetch() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch data
  }, []);

  const handleClick = () => {
    // Handle action
  };

  return (
    <div className="container">
      {/* UI */}
    </div>
  );
}
```

### Tailwind CSS

Always use Tailwind classes:
```jsx
// ✅ Good
<div className="bg-dark-800 text-white rounded-lg p-4">

// ❌ Avoid
<div style={{ backgroundColor: '#202020', color: 'white', borderRadius: '8px', padding: '16px' }}>
```

### Comments

```jsx
// ✅ Good - explains WHY
// Fetch logs every 5s to detect new events in real-time
useEffect(() => { ... }, []);

// ❌ Avoid - states the obvious
// Set logs to array
setLogs([...logs]);
```

---

## Performance Tips

### Code Splitting

Vite automatically chunks code for production.

### Image Optimization

Keep images small, use SVG icons (lucide-react provides these).

### Lazy Loading

For large lists:
```jsx
import { lazy, Suspense } from 'react';

const LogItem = lazy(() => import('./LogItem'));

<Suspense fallback={<div>Loading...</div>}>
  <LogItem log={log} />
</Suspense>
```

---

## Troubleshooting Setup

**npm install hangs**
```bash
# Try with verbose output
npm install -verbose

# Or clear npm cache
npm cache clean --force
npm install
```

**Module errors after install**
```bash
# Reinstall dependencies completely
rm -rf node_modules package-lock.json
npm install
```

**Git conflicts**
```bash
# If .env conflicts (shouldn't happen, it's in .gitignore)
git checkout --theirs .env
# Or don't commit it, keep local only
```

---

## Next Steps

After setup:
1. ✅ Start dev server: `npm run dev`
2. ✅ Visit http://localhost:3000
3. ✅ Enter your Live-TV backend URL in Settings
4. ✅ Watch logs stream in real-time
5. ✅ Try filters & view full log details
6. ✅ (Optional) Make code changes, see hot reload

Ready to deploy? See [DEPLOYMENT.md](logfetch-DEPLOYMENT.md)

---

## Support

Got stuck?
- Check [README.md](logfetch-README.md) for features overview
- Browse [Live-TV docs](https://github.com/MindMatrix-07/Live-TV)
- Open [GitHub issue](https://github.com/MindMatrix-07/Logfetch/issues)

**Happy debugging!** 🔍
