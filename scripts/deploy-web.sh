#!/usr/bin/env bash
# Publish the web app to https://mahabharat-katha.vercel.app
# The repo root is linked to Vercel project "mahabharat-katha" (.vercel/, gitignored). Vercel builds from source.
#   bash scripts/deploy-web.sh
set -euo pipefail
cd "$(dirname "$0")/.."
[ -f .vercel/project.json ] || vercel link --yes --project mahabharat-katha --scope uditpunjabi-3878s-projects < /dev/null
url=$(vercel deploy --prod --yes < /dev/null 2>&1 | grep -oE 'https://mahabharat-katha-[a-z0-9]+-uditpunjabi-3878s-projects\.vercel\.app' | head -1)
echo "deployed $url"
vercel alias set "$url" mahabharat-katha.vercel.app < /dev/null
sleep 5
curl -s -o /dev/null -w "https://mahabharat-katha.vercel.app -> %{http_code}\n" "https://mahabharat-katha.vercel.app/?v=$RANDOM"
