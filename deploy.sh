#!/bin/bash

# LogFetch One-Command Deployment Script
# Deploy to Vercel with a single command

set -e

echo ""
echo "🚀 LogFetch Deployment Script"
echo ""

# Check Node.js
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install from https://nodejs.org/"
  exit 1
fi
NODE_VERSION=$(node --version)
echo "✅ Node.js $NODE_VERSION"

# Check Vercel CLI
if ! command -v vercel &> /dev/null; then
  echo "⚠️  Vercel CLI not found. Installing globally..."
  npm install -g vercel
fi
echo "✅ Vercel CLI ready"
echo ""

# Install dependencies
echo "Step 1: Installing dependencies..."
if [ ! -d "node_modules" ]; then
  npm install
  echo "✅ Dependencies installed"
else
  echo "✅ Dependencies already installed"
fi
echo ""

# Build production
echo "Step 2: Building production bundle..."
npm run build
echo "✅ Production build complete (dist/)"
echo ""

# Deploy to Vercel
echo "Step 3: Deploying to Vercel..."
echo "📝 You'll be prompted to authenticate with GitHub"
echo ""

vercel deploy --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🎉 Your LogFetch instance is LIVE"
echo ""
echo "Next steps:"
echo "1. Set environment variable in Vercel dashboard:"
echo "   VITE_LOG_BACKEND_URL=https://your-live-tv-backend.com"
echo "2. Redeploy:"
echo "   vercel deploy --prod"
echo ""
