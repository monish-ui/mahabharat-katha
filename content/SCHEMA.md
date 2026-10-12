# Content schema (all files UTF-8 JSON, Hindi in Devanagari + English)

Every text field that users read exists in two languages: `hi` (Hindi, Devanagari) and `en` (English).
Shape for bilingual text:  { "hi": "...", "en": "..." }

## content/gita.json
{
  "chapters": [
    {
      "number": 1,
      "slug": "arjuna-vishada-yoga",
      "title": { "hi": "अर्जुन विषाद योग", "en": "Arjuna Vishada Yoga" },
      "subtitle": { "hi": "...one line...", "en": "...one line..." },
      "verseCount": 47,
      "summary": { "hi": "150-250 words", "en": "150-250 words" },
      "lesson": { "hi": "1-2 sentence takeaway", "en": "1-2 sentence takeaway" },
      "shlokas": [
        {
          "verse": "1.1",
          "sanskrit": "धृतराष्ट्र उवाच ...\n...",   (Devanagari, use \n for line breaks)
          "transliteration": "dhṛtarāṣṭra uvāca ...",
          "meaning": { "hi": "...", "en": "..." }
        }
      ]   (3 to 5 of the most important/famous shlokas per chapter; 2.47, 4.7-4.8, 2.20, 9.22, 18.66 etc. must appear in their chapters)
    }
  ]
}

## content/mahabharat.json
{
  "parvas": [
    {
      "number": 1,
      "slug": "adi-parva",
      "title": { "hi": "आदि पर्व", "en": "Adi Parva" },
      "subtitle": { "hi": "...", "en": "..." },
      "summary": { "hi": "100-200 words", "en": "100-200 words" },
      "stories": [
        {
          "slug": "birth-of-pandavas",
          "title": { "hi": "...", "en": "..." },
          "body": { "hi": "250-400 words narrative, 3-6 paragraphs separated by \n\n", "en": "same in English" },
          "lesson": { "hi": "1-2 sentences", "en": "1-2 sentences" },
          "characters": ["bhishma", "kunti"]   (slugs from characters.json)
        }
      ]   (3 to 5 stories per parva covering the most important episodes)
    }
  ]
}

## content/characters.json
{
  "characters": [
    {
      "slug": "arjuna",
      "name": { "hi": "अर्जुन", "en": "Arjuna" },
      "role": { "hi": "तीसरा पांडव, महान धनुर्धर", "en": "Third Pandava, greatest archer" },
      "side": "pandava" | "kaurava" | "neutral" | "divine",
      "bio": { "hi": "80-150 words", "en": "80-150 words" },
      "relations": [ { "slug": "kunti", "relation": { "hi": "माता", "en": "Mother" } } ]
    }
  ]
}

## content/daily.json
{
  "items": [
    { "type": "shloka", "ref": "2.47" }        (points into gita.json)
    { "type": "lesson", "text": { "hi": "...", "en": "..." }, "source": { "hi": "...", "en": "..." } }
  ]
}

Rules:
- Faithful to the traditional Vyasa Mahabharata / Bhagavad Gita. Do NOT invent episodes, numbers or quotes.
- Sanskrit shlokas must be the standard accepted text (as in Gita Press / critical edition). Double-check each.
- Hindi should be natural, simple, respectful (devotional register, e.g. "श्रीकृष्ण", "अर्जुन"), not machine-translated.
- Output must be valid JSON. Verify with: node -e "JSON.parse(require('fs').readFileSync('FILE','utf8'))"
