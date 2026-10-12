import type { Bi } from './types'

// UI strings. Content strings live in /content JSON; these are only chrome.
export const UI = {
  appName: { hi: 'महाभारत कथा', en: 'Mahabharat Katha' },
  tagline: { hi: 'कथा • गीता • पात्र — पूरी तरह offline', en: 'Katha • Gita • Characters — fully offline' },
  home: { hi: 'होम', en: 'Home' },
  gita: { hi: 'गीता', en: 'Gita' },
  katha: { hi: 'कथा', en: 'Katha' },
  characters: { hi: 'पात्र', en: 'Characters' },
  more: { hi: 'और', en: 'More' },
  search: { hi: 'खोजें', en: 'Search' },
  searchHint: { hi: 'श्लोक, कथा या पात्र खोजें…', en: 'Search shlokas, stories, characters…' },
  todaysShloka: { hi: 'आज का श्लोक', en: "Today's Shloka" },
  todaysLesson: { hi: 'आज की सीख', en: "Today's Lesson" },
  continueReading: { hi: 'पढ़ना जारी रखें', en: 'Continue reading' },
  startReading: { hi: 'पढ़ना शुरू करें', en: 'Start reading' },
  bhagavadGita: { hi: 'श्रीमद्भगवद्गीता', en: 'Shrimad Bhagavad Gita' },
  gitaSub: { hi: '18 अध्याय • 700 श्लोक • हिंदी अर्थ सहित', en: '18 chapters • 700 verses • with meanings' },
  mahabharat: { hi: 'महाभारत कथा', en: 'Mahabharat Katha' },
  mahabharatSub: { hi: '18 पर्व • प्रमुख कथाएँ • सरल हिंदी में', en: '18 parvas • key stories • simply told' },
  charactersSub: { hi: 'पांडव, कौरव, गुरु और देवता', en: 'Pandavas, Kauravas, gurus and the divine' },
  chapter: { hi: 'अध्याय', en: 'Chapter' },
  parva: { hi: 'पर्व', en: 'Parva' },
  verses: { hi: 'श्लोक', en: 'verses' },
  stories: { hi: 'कथाएँ', en: 'stories' },
  summary: { hi: 'सार', en: 'Summary' },
  keyShlokas: { hi: 'प्रमुख श्लोक', en: 'Key Shlokas' },
  meaning: { hi: 'अर्थ', en: 'Meaning' },
  lesson: { hi: 'सीख', en: 'Lesson' },
  listen: { hi: 'सुनें', en: 'Listen' },
  stopListening: { hi: 'रोकें', en: 'Stop' },
  bookmark: { hi: 'सहेजें', en: 'Save' },
  bookmarked: { hi: 'सहेजा गया', en: 'Saved' },
  bookmarks: { hi: 'सहेजे गए', en: 'Saved items' },
  noBookmarks: { hi: 'अभी कुछ सहेजा नहीं गया। किसी श्लोक या कथा पर ♡ दबाएँ।', en: 'Nothing saved yet. Tap ♡ on any shloka or story.' },
  inThisStory: { hi: 'इस कथा के पात्र', en: 'Characters in this story' },
  appearsIn: { hi: 'इन कथाओं में', en: 'Appears in' },
  relations: { hi: 'संबंध', en: 'Relations' },
  all: { hi: 'सभी', en: 'All' },
  pandava: { hi: 'पांडव पक्ष', en: 'Pandava side' },
  kaurava: { hi: 'कौरव पक्ष', en: 'Kaurava side' },
  neutral: { hi: 'अन्य', en: 'Others' },
  divine: { hi: 'दिव्य', en: 'Divine' },
  settings: { hi: 'सेटिंग', en: 'Settings' },
  language: { hi: 'भाषा', en: 'Language' },
  fontSize: { hi: 'अक्षर आकार', en: 'Text size' },
  theme: { hi: 'रूप', en: 'Theme' },
  light: { hi: 'उजला', en: 'Light' },
  dark: { hi: 'गहरा', en: 'Dark' },
  system: { hi: 'सिस्टम', en: 'System' },
  about: { hi: 'ऐप के बारे में', en: 'About' },
  aboutText: {
    hi: 'महाभारत की कथाएँ और श्रीमद्भगवद्गीता के श्लोक, सरल हिंदी और English में। सारी सामग्री ऐप के भीतर है, इंटरनेट की ज़रूरत नहीं। संस्कृत पाठ पारंपरिक मान्य संस्करण से लिया गया है।',
    en: 'Stories of the Mahabharat and shlokas of the Bhagavad Gita in simple Hindi and English. Everything is inside the app, no internet needed. Sanskrit text follows the traditional accepted edition.'
  },
  previous: { hi: 'पिछला', en: 'Previous' },
  next: { hi: 'अगला', en: 'Next' },
  noResults: { hi: 'कुछ नहीं मिला', en: 'No results' },
  progress: { hi: 'प्रगति', en: 'Progress' },
  chaptersRead: { hi: 'अध्याय पढ़े', en: 'chapters read' },
  storiesRead: { hi: 'कथाएँ पढ़ीं', en: 'stories read' },
  share: { hi: 'साझा करें', en: 'Share' },
  comingSoon: { hi: 'सामग्री जल्द आ रही है', en: 'Content coming soon' },
  rateApp: { hi: 'ऐप को रेट करें', en: 'Rate the app' },
  version: { hi: 'संस्करण', en: 'Version' }
} satisfies Record<string, Bi>

export type UIKey = keyof typeof UI

export const SIDE_LABEL: Record<string, Bi> = {
  pandava: UI.pandava,
  kaurava: UI.kaurava,
  neutral: UI.neutral,
  divine: UI.divine
}

export function toDevanagariDigits(n: number | string): string {
  return String(n).replace(/\d/g, (d) => '०१२३४५६७८९'[Number(d)])
}
