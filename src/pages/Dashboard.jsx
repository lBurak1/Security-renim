import { Link } from 'react-router-dom'
import { getDomains, getAllQuestions, getAllGlossary } from '../lib/loadContent.js'
import { useProgress } from '../store/useProgress.js'

const COLORS = ['bg-blue-500', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-violet-500']

const PASS_THRESHOLD = 83

function getAccuracyStatus(accuracy, total) {
  if (total === 0) return {
    label: 'Henüz soru çözülmedi',
    sub: 'Soru çözdükçe performansın burada yorumlanır.',
    color: 'border-slate-600 bg-slate-800/40',
    text: 'text-slate-400',
    bar: 'bg-slate-600',
  }
  if (accuracy >= PASS_THRESHOLD) return {
    label: 'Geçme eşiğindesin',
    sub: `%${accuracy} doğruluk — hedef %83. Sınav olsan geçerdin. Tutarlılığı koru.`,
    color: 'border-emerald-500/40 bg-emerald-500/8',
    text: 'text-emerald-300',
    bar: 'bg-emerald-500',
  }
  if (accuracy >= 70) return {
    label: 'Yaklaşıyorsun',
    sub: `%${accuracy} doğruluk — hedefe %${PASS_THRESHOLD - accuracy} puan kaldı. Yanlışlarını tekrar et.`,
    color: 'border-amber-500/40 bg-amber-500/8',
    text: 'text-amber-300',
    bar: 'bg-amber-500',
  }
  if (accuracy >= 50) return {
    label: 'Temel kavramları pekiştir',
    sub: `%${accuracy} doğruluk — trigger word mantığına ve "neden doğru/yanlış" analizine odaklan.`,
    color: 'border-orange-500/40 bg-orange-500/8',
    text: 'text-orange-300',
    bar: 'bg-orange-500',
  }
  return {
    label: 'Kavramsal boşluk var',
    sub: `%${accuracy} doğruluk — önce teorik kısmı oku, sonra soruya dön.`,
    color: 'border-rose-500/40 bg-rose-500/8',
    text: 'text-rose-300',
    bar: 'bg-rose-500',
  }
}

export default function Dashboard() {
  const domains = getDomains()
  const stats = useProgress((s) => s.stats)()
  const completed = useProgress((s) => s.completedModules)
  const resetAll = useProgress((s) => s.resetAll)
  const totalQ = getAllQuestions().length
  const totalG = getAllGlossary().length

  const status = getAccuracyStatus(stats.accuracy, stats.total)
  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Genel Bakış</h1>
        <p className="text-slate-400 text-sm">SY0-701 hazırlık ilerlemen</p>
      </div>

      {/* Performance interpretation */}
      <div className={`rounded-xl border p-4 ${status.color}`}>
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <span className={`font-semibold text-sm ${status.text}`}>{status.label}</span>
          <span className={`text-xs font-mono font-bold ${status.text}`}>%{stats.accuracy} doğruluk</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-2">{status.sub}</p>
        <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${status.bar}`}
            style={{ width: `${Math.min(stats.accuracy, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-slate-600">%0</span>
          <span className="text-xs text-slate-500">Hedef: %{PASS_THRESHOLD}</span>
          <span className="text-xs text-slate-600">%100</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Çözülen Soru" value={stats.total} />
        <Stat label="Doğru" value={stats.correct} />
        <Stat label="Platform Sorusu" value={totalQ} />
        <Stat label="Sözlük Kaydı" value={totalG} />
      </div>

      {/* Domains */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Domainler</h2>
        <div className="space-y-3">
          {domains.map((d, i) => {
            const done = d.modules.filter((m) => completed.includes(m.id)).length
            const pct = d.modules.length ? Math.round((done / d.modules.length) * 100) : 0
            return (
              <div key={d.id} className="card p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${COLORS[i]}`} />
                    <span className="font-semibold text-white text-sm">Domain {d.id}: {d.title}</span>
                    <span className="text-xs text-slate-500">(Sınav ağırlığı %{d.weight})</span>
                  </div>
                  <span className="text-sm text-slate-400 flex-shrink-0">{done}/{d.modules.length} modül</span>
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
