import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../../store/useProgress.js'

const LS_KEY = 'secplus-exam-date'

function getDaysLeft(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr) - new Date(new Date().toDateString())
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function TopBar({ onMenuClick }) {
  const stats = useProgress((s) => s.stats)()
  const [examDate, setExamDate] = useState(() => localStorage.getItem(LS_KEY) || '')
  const [picking, setPicking] = useState(false)

  const daysLeft = getDaysLeft(examDate)

  const handleDateChange = (e) => {
    const val = e.target.value
    setExamDate(val)
    localStorage.setItem(LS_KEY, val)
    setPicking(false)
  }

  return (
    <header className="h-14 shrink-0 border-b border-line bg-panel/60 backdrop-blur flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden flex flex-col gap-1.5 p-1"
          aria-label="Menu"
        >
          <span className="w-5 h-0.5 bg-slate-300 block" />
          <span className="w-5 h-0.5 bg-slate-300 block" />
          <span className="w-5 h-0.5 bg-slate-300 block" />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <p className="text-xs md:text-sm text-slate-400">CompTIA Security+ · Türkçe / İngilizce</p>
          <Link to="/exam-info" className="text-xs text-slate-500 hover:text-slate-300 border border-line rounded px-2 py-0.5 transition">Sınav Yapısı</Link>
        </div>
        <p className="text-xs text-slate-400 sm:hidden">Security+ SY0-701</p>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {/* Stats */}
        <span className="text-slate-400 text-xs md:text-sm">
          Çözülen: <b className="text-white">{stats.total}</b>
        </span>
        <span className="text-slate-400 text-xs md:text-sm">
          Doğruluk: <b className="text-emerald-400">%{stats.accuracy}</b>
        </span>

        {/* Exam date */}
        <div className="relative">
          {picking ? (
            <input
              type="date"
              autoFocus
              value={examDate}
              onChange={handleDateChange}
              onBlur={() => setPicking(false)}
              className="bg-panel2 border border-brand text-white text-xs rounded-lg px-2 py-1 focus:outline-none"
            />
          ) : (
            <button
              onClick={() => setPicking(true)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border transition ${
                daysLeft === null
                  ? 'border-line text-slate-500 hover:border-brand hover:text-slate-300'
                  : daysLeft <= 7
                  ? 'border-rose-500/60 bg-rose-500/10 text-rose-300'
                  : daysLeft <= 14
                  ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                  : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              }`}
            >
              {daysLeft === null
                ? 'Sınav tarihi seç'
                : daysLeft < 0
                ? 'Sınav geçti'
                : daysLeft === 0
                ? 'Sınav bugün!'
                : `Sınava ${daysLeft} gün`}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
