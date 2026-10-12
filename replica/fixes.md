# What users of Mahabharat and Gita apps hate, and what we do about it

Sample: 155 reviews, 3 Google Play listings (Banaka Mahabharat 139, Banaka Bhagavad-Gita 20 incl. all low-star + request-bearing ones, Apps Useful Mahabharat 4), read in the browser on 12 Oct 2026. Verbatim rows in `reviews.csv`, ranking in `feedback.md`. Single-store sample: Play Store only, no Reddit/HN threads found worth adding for Hindi devotional apps.

## 1. What they hate

| # | problem | reviews | sources | quotes |
|---|---|---|---|---|
| 1 | It is a summary, not the Mahabharat. Chapters missing, stories cut short, out of sequence | 20 | 1 | "title is misleading. It should be Mahabharat Summary." (2★) · "This is just a short part of Mahabharata... if you are using it and think this is original version of Mahabharata, It's NOT. Buy a book." (2★) https://play.google.com/store/apps/details?id=in.banaka.mahabharat.hindi |
| 2 | Not faithful to the scripture: TV-serial version, bias, wrong shlokas, spelling mistakes | 16 | 3 | "This is what star plus mahabharat is showing to us. This is not genuine" (1★) · "Many shlokas are incorrect. All text should be 100% correct as Geeta Press" (1★) https://play.google.com/store/apps/details?id=in.banaka.mohit.bhagwadgita |
| 3 | Ads, specifically obscene ones in a devotional app | 10 | 2 | "the ads are like its a xxx app" (1★) · "adds given are very obscene and vulgar. There I don't see the option to delete the add" (1★) |
| 4 | Paid feature (tap-a-word dictionary) broken after purchase | 5 | 2 | "It's not showing meaning of any word I tap after the purchase instead shows error message" (1★) |

## 2. What is missing (asked for by name)

| # | request | reviews | sources |
|---|---|---|---|
| 1 | Word-by-word meaning / notes on a shloka | 5 | 2 |
| 2 | Daily shloka notification, in chapter order not random; favourites in order | 6 | 1 |
| 3 | Dark background, distinct Sanskrit vs Hindi styling, nothing covering the text | 6 | 2 |
| 4 | More scriptures (Bhagavatam, Ramayan), more languages (Kannada) | 4 | 1 |
| 5 | English translation alongside Hindi | 3 | 2 |
| 6 | Audio so you can listen while working | 2 | 2 |

## 3. What is unsolved

- Readers who want to know **which part of the real text** a story comes from. Every "fake / not genuine" review is really "I cannot tell if this is Vyasa or the TV serial".
- Devotional readers who will **pay once to never see an ad**, but got a broken dictionary instead of a clean experience.

## Fix plan (evidence × cost)

| # | fix | size | status |
|---|---|---|---|
| 1 | Honest scope everywhere: listing and About say "66 प्रमुख कथाएँ, 18 पर्व, व्यास महाभारत पर आधारित; यह पूर्ण ग्रंथ नहीं है". Never use "सम्पूर्ण" in the name | S | done |
| 2 | Source line on every story: "आधार: व्यास महाभारत, <पर्व>" so readers see it is not the serial | S | done |
| 3 | "गलती बताएँ / Report a mistake" link on every shloka and story (mailto with the ref prefilled). Fixes ship as content updates | S | done |
| 4 | Ads policy: no ads in v1. When AdMob is added: max ad content rating G, banner only, never over text, one-time Pro removes them. Stated in listing | S | done (policy), M (AdMob later) |
| 5 | Daily shloka as a local notification at 7:00, chronological not random, toggle in settings | M | done |
| 6 | Bookmarks listed in chapter/verse order, stories in parva order | S | done |
| 7 | Sanskrit in serif maroon, Hindi in sans ink; dark mode; no floating buttons over text | S | already true |
| 8 | English + Hindi toggle, read-aloud | – | already true |
| 9 | Word-by-word meaning for the 79 key shlokas | L | roadmap v1.1 |
| 10 | Personal notes on a shloka | M | roadmap v1.1 |
| 11 | Ramayan module, Kannada | L | roadmap v2 |

## The angle

For Hindi readers who are tired of "Mahabharat" apps that turn out to be a thin summary with vulgar ads,
**Mahabharat Katha & Gita** tells all 18 parvas story by story, straight from Vyasa's text, with the full Gita, no login, no internet, and no ads over the text.
Evidence: "incomplete / summary" 20 reviews; "not faithful" 16 reviews across 3 sources; "ads" 10 reviews across 2 sources.

Alternatives considered:
- "The Gita app that never shows a wrong shloka" (accuracy angle, 16 reviews). Narrower; folded into the main angle via source lines and report-a-mistake.
- "Listen while you work" (audio, 2 reviews). Too thin to lead with.
