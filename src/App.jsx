import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar.jsx'
import TopBar from './components/layout/TopBar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ModulePage from './pages/ModulePage.jsx'
import GlossaryPage from './pages/GlossaryPage.jsx'
import ExamSimPage from './pages/ExamSimPage.jsx'
import AcronymsPage from './pages/AcronymsPage.jsx'
import ReviewPage from './pages/ReviewPage.jsx'
import FlashcardsPage from './pages/FlashcardsPage.jsx'
import VocabularyPage from './pages/VocabularyPage.jsx'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-full">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen(v => !v)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/module/:moduleId" element={<ModulePage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/acronyms" element={<AcronymsPage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/exam" element={<ExamSimPage />} />
            <Route path="/vocabulary" element={<VocabularyPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
