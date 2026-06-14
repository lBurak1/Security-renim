import { Link } from 'react-router-dom'
import { getDomains, getAllQuestions, getAllGlossary } from '../lib/loadContent.js'
import { useProgress } from '../store/useProgress.js'

const COLORS = ['bg-blue-500', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-violet-500']

export default function Dashboard() {
  const domains = getDomains()
  const stats = useProgress((s) => s.stats)()
  const completed = useProgress((s) => s.completedModules)
  const resetAll = useProgress((s) => s.resetAll)
  const totalQ = getAllQuestions().length
  const totalG = getAllGlossary().length

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Genel Bakış</h1>
        <p className="text-slate-400 text-sm">SY0-701 hazırlık ilerlemen</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Çözülen Soru" value={stats.total} />
        <Stat label="Doğruluk" value={`%${stats.accuracy}`} />
        <Stat label="Toplam Soru" value={totalQ} />
        <Stat label="Sözlük Kaydı" value={totalG} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Domainler</h2>
        <div className="space-y-3">
          {domains.map((d, i) => {
            const done = d.modules.filter((m) => completed.includes(m.id)).length
            const pct = d.modules.length ? Math.round((done / d.modules.length) * 100) : 0
            return (
              <div key={d.id} className="card p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${COLORS[i]}`} />
                    <span className="font-semibold text-white">Domain {d.id}: {d.title}</span>
                    <span className="text-xs text-slate-500">(Sınav ağırlığı %{d.weight})</span>
                  </div>
                  <span className="text-sm text-slate-400">{done}/{d.modules.length} modül</span>
                </div>
                <div className="h-2 bg-panel2 rounded-full overflow-hidden">
                  <div className={`h-full ${COLORS[i]}`} style={{ width: `${pct}%` }} />
                </div>
                {d.modules.length === 0 && <p className="text-xs text-slate-600 italic mt-2">İçerik yakında eklenecek</p>}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link to="/exam" className="btn-primary">Deneme Sınavı</Link>
        <Link to="/flashcards" className="btn">Akıllı Kartlar</Link>
        <Link to="/review" className="btn">Yanlışlarımı Tekrar Et</Link>
        <Link to="/acronyms" className="btn">Akronim Defteri</Link>
        <button onClick={() => { if (confirm('Tüm ilerleme silinsin mi?')) resetAll() }} className="btn">İlerlemeyi Sıfırla</button>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="card p-4">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  )
}
