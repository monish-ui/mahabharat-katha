# Mahabharat Katha & Gita

Offline-first Android app (Play Store) with Mahabharat stories, all 18 Bhagavad Gita chapters with key shlokas, character profiles, daily shloka, bookmarks and read-aloud audio. Hindi + English. No backend, no database bill: all content is bundled JSON.

## Stack
- React 18 + TypeScript + Vite + Tailwind v4
- Capacitor 6 wraps it as a native Android app (`android/`)
- Content: `content/*.json` (schema in `content/SCHEMA.md`), validated by `npm run content:check`
- Audio: device text-to-speech (free, offline). Drop real MP3 narrations later and pass `audioUrl` to `AudioButton`.
- Progress, bookmarks and settings persist in localStorage on the device.

## Run locally
```bash
npm install
npm run dev        # http://127.0.0.1:5173
npm run build      # production web build into dist/
npm run cap:sync   # copy dist/ into the Android project
```

## Android build without installing Android Studio
Push to GitHub. `.github/workflows/android.yml` builds a debug APK on every push to `main` (download it from the Actions run, install on any phone).

For a signed Play Store bundle (AAB), add these repository secrets once:
`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.
Create the keystore with `keytool -genkeypair -v -keystore release.keystore -alias mahabharat -keyalg RSA -keysize 2048 -validity 10000` and base64-encode it. Never commit the keystore.

## Monetisation plan (no backend)
- AdMob banner on list pages + interstitial every N stories (`@capacitor-community/admob`)
- One-time "Pro" unlock via Google Play Billing to remove ads

## Content rules
Sanskrit follows the traditional accepted text. Hindi/English retellings are original. No copyrighted translations, serial audio or artwork are used.
