# Publishing "Mahabharat Katha & Gita" on Google Play

Everything technical is done. This file is the copy-paste guide for Play Console.

## What is ready

| Item | Where |
|---|---|
| Signed app bundle (AAB) to upload | https://github.com/monish-ui/mahabharat-katha/releases/latest/download/mahabharat-katha.aab |
| Signed APK for testing on a phone | https://github.com/monish-ui/mahabharat-katha/releases/latest/download/mahabharat-katha.apk |
| Privacy policy URL | https://mahabharat-katha.vercel.app/privacy.html |
| App icon 512×512 | `store/icon-512.png` |
| Feature graphic 1024×500 | `store/feature-graphic-1024x500.png` |
| Phone screenshots 1080×2160 (6) | `store/screenshot-1.png` … `screenshot-6.png` |
| Listing text (lint-checked) | `replica/launch/listing.json` |
| Upload key (keep private, back up) | `D:\mahabharat-secrets\` (never commit) |

Package name: `tech.illuminatiai.mahabharatkatha` (permanent, cannot change later)
Target SDK 36 (Android 16), min SDK 24 (Android 7). Version code goes up automatically with every build.

## Step 1. Create the developer account (you)

1. Go to https://play.google.com/console/signup and sign in with the Google account that should own the app.
2. Choose the account type:
   - **Personal**: fastest. New personal accounts must run a **closed test with at least 12 testers for 14 days in a row** before Google allows production release.
   - **Organization** (Illuminati AI): needs a free D-U-N-S number for the company, takes about 1 to 4 weeks to get, but skips the 12-tester rule.
3. Pay the one-time US$25 fee and complete identity verification (government ID).

## Step 2. Create the app

Play Console → Create app

| Field | Value |
|---|---|
| App name | Mahabharat Katha & Gita |
| Default language | Hindi – hi-IN |
| App or game | App |
| Free or paid | Free |

Tick the declarations and create.

## Step 3. App content (left menu → Policy → App content)

**Privacy policy**: `https://mahabharat-katha.vercel.app/privacy.html`

**Ads**: No, my app does not contain ads.

**App access**: All functionality is available without special access.

**Content rating** (IARC questionnaire): category *Reference, News, or Educational*. Answer **No** to violence, sexual content, profanity, drugs, gambling, user interaction, sharing location, digital purchases. Note: the stories describe the Kurukshetra war in literary terms with no graphic depiction; if asked about violence, the honest answer is "fantasy/mythological violence, not graphic", which still rates for everyone. Expected result: rated for all ages (IARC 3+/7+).

**Target audience**: choose **13–15, 16–17, 18+**. Do not pick under-13 ages unless you want the extra Families policy review. The app has no ads or data collection, so it would pass, but it adds work.

**News app**: No.

**Data safety**:
- Does your app collect or share any of the required user data types? **No**.
- Is all user data encrypted in transit? Yes (HTTPS only).
- Do you provide a way for users to request data deletion? Not applicable, no data collected.

**Government app**: No. **Financial features**: None. **Health**: None.

## Step 4. Store listing (Grow → Store presence → Main store listing)

Copy from `replica/launch/listing.json` → `google_play`:

| Field | Value |
|---|---|
| App name | Mahabharat Katha & Gita |
| Short description | महाभारत की कथाएँ, पूरी गीता, पात्र और रोज़ का श्लोक — ऑफलाइन, हिंदी + English |
| Full description | the `full_description` text |
| App icon | `store/icon-512.png` |
| Feature graphic | `store/feature-graphic-1024x500.png` |
| Phone screenshots | `store/screenshot-1.png` to `screenshot-6.png` |
| App category | Books & Reference |
| Tags | Religion, Books, Education (pick up to 5 offered) |
| Contact email | udit.punjabi@illuminatiai.tech |
| Website (optional) | https://mahabharat-katha.vercel.app |

Optional: add an English (en-IN) translation of the listing using the English half of the description.

## Step 5. Release

### If personal account: closed test first

1. Testing → Closed testing → Create track (e.g. "Friends").
2. Testers: add an email list with **12 or more** Gmail addresses of family/friends (more is safer; someone always forgets).
3. Create release → upload `mahabharat-katha.aab` → release name `1.0.0` → notes: "पहला संस्करण / First release".
4. Let **Play App Signing** stay on (default). Google keeps the final signing key; our file is only the upload key.
5. Send review. After approval, share the opt-in link with testers. Each must tap "Become a tester" and install from Play.
6. Keep at least 12 testers opted in for 14 days. Then Dashboard → "Apply for production" and answer the short questionnaire about the test.

### Production

Production → Create release → upload the newest `mahabharat-katha.aab` → countries: India (add more if you want) → Send for review. First review usually takes 1 to 7 days.

## Updating the app later

1. Change content or code, push to `main`.
2. GitHub Actions builds a new signed AAB with a higher version code automatically (about 5 minutes).
3. Download https://github.com/monish-ui/mahabharat-katha/releases/latest/download/mahabharat-katha.aab and upload it as a new release in Play Console.

Bump `version` in `package.json` (1.0.0 → 1.0.1) for user-visible version names.

## Things to keep safe

- `D:\mahabharat-secrets\upload-keystore.p12` and `KEYSTORE-README.txt`: copy both to a password manager or private drive. If lost, Play Console support can reset the upload key, but it takes days.
- The same key is stored as GitHub encrypted secrets; nobody can read them back, not even you.
