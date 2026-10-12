import { readFileSync, writeFileSync } from 'node:fs'
// Builds replica/themes.json = the replica-skill default themes + Mahabharat/Gita category themes.
const t = JSON.parse(readFileSync('.claude/skills/replica-entrepreneur/themes.json', 'utf8'))
const B = String.fromCharCode(92) + 'b' // literal backslash-b for a regex word boundary
const w = (...xs) => xs.map((x) => B + x + B)
t.themes.push(
  { id: 'incomplete', label: 'Incomplete, summary only, not the whole text', kind: 'complaint',
    patterns: w('not complete', 'incomplete', 'in short', 'short (type|part|story|stories)', 'summary', 'summury', 'missing', 'few stories', 'not (the )?(real|whole|entire)', 'entire mahabharat', 'more detail', 'never their', 'just a short', 'not in proper sequence', 'serial wise', 'end a story fastly', 'short method', 'presented in short') },
  { id: 'accuracy', label: 'Not faithful to the scripture, errors, TV-serial version', kind: 'complaint',
    patterns: [...w('not (accurate|correct|genuine|based on)', 'incorrect', 'fake', 'false', 'galat', 'star plus', 'serial basis', 'favou?red to', 'propog?[ae]nda', 'misleading', 'shlokas? (are|is) incorrect', 'errors? in (the )?sanskrit', '(spelling|speling) mistakes?', 'correct them', 'need corrections'), 'अशुद्ध'] },
  { id: 'audio', label: 'Want audio narration', kind: 'request', patterns: w('audio', 'should be audio', 'hear', 'listen') },
  { id: 'english', label: 'Want English translation', kind: 'request', patterns: w('english (translation|also)', 'in english', 'engligh') },
  { id: 'display', label: 'Reading display: background colour, dark mode, Sanskrit vs Hindi styling', kind: 'request', patterns: w('background colou?r', 'dark mode', 'font', 'distinguishable', 'different colou?r', 'covers the content', 'background photo') },
  { id: 'daily', label: 'Daily shloka notification and its order', kind: 'request', patterns: w('daily (shloka|notification|quote)', 'aaj ka shlok', 'everyday shloka', 'chronologically', 'random basis', 'increasing order', 'one shlok(a)? (per|every)') },
  { id: 'wordmeaning', label: 'Word by word meaning, dictionary, notes', kind: 'request', patterns: w('every word', 'dictionary', 'meaning of any word', 'make notes', 'literal meaning', 'words show error', 'broken down') },
  { id: 'morecontent', label: 'More scriptures and languages in the same app', kind: 'request', patterns: w('bhagavatha', 'bhagavatam', 'kannada', 'other historical stories', 'more topics', 'make more like') }
)
t.themes.find((x) => x.id === 'ads').patterns.push(...w('adds?', 'advertising', 'obscene', 'vulgar'))
writeFileSync('replica/themes.json', JSON.stringify(t, null, 1))
console.log('themes', t.themes.length, 'sample', t.themes.find((x) => x.id === 'incomplete').patterns[0])
