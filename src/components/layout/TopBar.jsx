import { useProgress } from '../../store/useProgress.js'

export default function TopBar() {
  const stats = useProgress((s) => s.stats)()
  return (
    <header className="h-14 shrink-0 border-b border-line bg-panel/60 backdrop-blur flex items-center justify-between px-6">
      <p className="text-sm text-slate-400">CompTIA Security+ · Türkçe Dökümantasyon / İngilizce Soru Motoru</p>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-slate-400">Çözülen: <b className="text-white">{stats.total}</b></span>
        <span className="text-slate-400">Doğruluk: <b className="text-emerald-400">%{stats.accuracy}</b></span>
      </div>
    </header>
  )
}
