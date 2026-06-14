import { useProgress } from '../../store/useProgress.js'

export default function TopBar({ onMenuClick }) {
  const stats = useProgress((s) => s.stats)()
  return (
    <header className="h-14 shrink-0 border-b border-line bg-panel/60 backdrop-blur flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger — only on mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden flex flex-col gap-1.5 p-1"
          aria-label="Menu"
        >
          <span className="w-5 h-0.5 bg-slate-300 block" />
          <span className="w-5 h-0.5 bg-slate-300 block" />
          <span className="w-5 h-0.5 bg-slate-300 block" />
        </button>
        <p className="text-xs md:text-sm text-slate-400 hidden sm:block">
          CompTIA Security+ · Türkçe / İngilizce
        </p>
        <p className="text-xs text-slate-400 sm:hidden">Security+ SY0-701</p>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-slate-400 text-xs md:text-sm">Çözülen: <b className="text-white">{stats.total}</b></span>
        <span className="text-slate-400 text-xs md:text-sm">Doğruluk: <b className="text-emerald-400">%{stats.accuracy}</b></span>
      </div>
    </header>
  )
}
