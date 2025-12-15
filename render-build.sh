#!/usr/bin/env bash
set -o errexit

npm install

# Install Chrome browser for Puppeteer
npx puppeteer browsers install chrome