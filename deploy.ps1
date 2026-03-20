#!/usr/bin/env pwsh

<#
.SYNOPSIS
One-command deployment script for LogFetch to Vercel

.DESCRIPTION
Handles all deployment steps:
1. Verify dependencies
2. Build production bundle
3. Deploy to Vercel
4. Show live deployment URL

.EXAMPLE
.\deploy.ps1

.NOTES
Requires: Node.js 18+, Vercel CLI
#>

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "🚀 LogFetch Deployment Script" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking prerequisites..."
$nodeVersion = node --version
if (-not $nodeVersion) {
  Write-Host "❌ Node.js not found. Install from https://nodejs.org/" -ForegroundColor Red
  exit 1
}
Write-Host "✅ Node.js $nodeVersion"

# Check Vercel CLI
$vercelVersion = vercel --version 2>$null
if (-not $vercelVersion) {
  Write-Host "⚠️  Vercel CLI not found. Installing globally..." -ForegroundColor Yellow
  npm install -g vercel
}
Write-Host "✅ Vercel CLI ready"
Write-Host ""

# Install dependencies
Write-Host "Step 1: Installing dependencies..."
if ((Test-Path "node_modules") -eq $false) {
  npm install
  Write-Host "✅ Dependencies installed"
} else {
  Write-Host "✅ Dependencies already installed"
}
Write-Host ""

# Build production
Write-Host "Step 2: Building production bundle..."
npm run build
Write-Host "✅ Production build complete (dist/)"
Write-Host ""

# Deploy to Vercel
Write-Host "Step 3: Deploying to Vercel..."
Write-Host "📝 You'll be prompted to authenticate with GitHub" -ForegroundColor Green
Write-Host ""

vercel deploy --prod

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Your LogFetch instance is LIVE"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Set environment variable in Vercel dashboard:"
Write-Host "   VITE_LOG_BACKEND_URL=https://your-live-tv-backend.com"
Write-Host "2. Redeploy:"
Write-Host "   vercel deploy --prod"
Write-Host ""
