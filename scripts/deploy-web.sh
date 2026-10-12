#!/usr/bin/env bash
# Build and publish the web app to https://mahabharat-katha.vercel.app
#   bash scripts/deploy-web.sh
set -euo pipefail
cd "$(dirname "$0")/.."
export npm_config_cache=/d/npm-cache
./node_modules/.bin/vite build
cd dist
url=$(vercel deploy --prod --yes --scope uditpunjabi-3878s-projects < /dev/null 2>&1 | grep -oE 'https://dist-[a-z0-9]+-uditpunjabi-3878s-projects\.vercel\.app' | head -1)
echo "deployed $url"
vercel alias set "$url" mahabharat-katha.vercel.app --scope uditpunjabi-3878s-projects < /dev/null
curl -s -o /dev/null -w "https://mahabharat-katha.vercel.app -> %{http_code}\n" https://mahabharat-katha.vercel.app/
