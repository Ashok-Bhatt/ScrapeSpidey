#!/usr/bin/env bash
set -o errexit

# Install dependencies
npm install

# Set cache directory for puppeteer within project
export PUPPETEER_CACHE_DIR="$PWD/.cache/puppeteer"

# Install Chrome browser for Puppeteer
npx puppeteer browsers install chrome

# Verify Chrome was installed
echo "Chrome installed at: $PUPPETEER_CACHE_DIR"
ls -la .cache/puppeteer/ || echo "Cache directory listing failed"