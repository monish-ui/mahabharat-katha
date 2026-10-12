import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import GitaList from './pages/GitaList'
import GitaChapter from './pages/GitaChapter'
import ParvaList from './pages/ParvaList'
import ParvaPage from './pages/ParvaPage'
import StoryPage from './pages/StoryPage'
import CharacterList from './pages/CharacterList'
import CharacterPage from './pages/CharacterPage'
import SearchPage from './pages/SearchPage'
import MorePage from './pages/MorePage'
import BookmarksPage from './pages/BookmarksPage'
import { stop } from './lib/tts'

export default function App() {
  const loc = useLocation()
  useEffect(() => { window.scrollTo(0, 0); stop() }, [loc.pathname])
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/gita" element={<GitaList />} />
        <Route path="/gita/:number" element={<GitaChapter />} />
        <Route path="/katha" element={<ParvaList />} />
        <Route path="/katha/:parva" element={<ParvaPage />} />
        <Route path="/katha/:parva/:story" element={<StoryPage />} />
        <Route path="/characters" element={<CharacterList />} />
        <Route path="/characters/:slug" element={<CharacterPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/more" element={<MorePage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
