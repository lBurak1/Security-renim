import { useMemo, useState, useEffect } from 'react'
import { getAllQuestions, getDomains } from '../lib/loadContent.js'
import QuestionCard from '../components/quiz/QuestionCard.jsx'
import { useProgress } from '../store/useProgress.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const formatTime = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// Domain weights as per CompTIA SY0-701 official objectives
const DOMAIN_WEIGHTS = { '1': 0.12, '2': 0.22, '3': 0.18, '4': 0.28, '5': 0.20 }
const EXAM_MINUTES = 90

/* ─── Score Summary ─────────────────────────────────────────────────── */
function ScoreSummary({ questions, domains, onRestart }) {
  const answers = useProgress((s) => s.answers)

  const total = questions.length
  const answered = questions.filter((q) => answers[q.id]).length
  const correct = questions.filter((q) => answers[q.id]?.correct).length
  const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0
  const passed = pct >= 83   // ~750/900 CompTIA passing threshold

  const domainScores = domains
    .map((d) => {
      const dQs = questions.filter((q) => String(q.domainId) === String(d.id))
      const dCorrect = dQs.filter((q) => answers[q.id]?.correct).length
      const dAnswered = dQs.filter((q) => answers[q.id]).length
      return { id: d.id, title: d.title, total: dQs.length, answered: dAnswered, correct: dCorrect }
    })
    .filter((d) => d.total > 0)

  return (
    <div className="max-w-2xl space-y-5">
      <h2 className="text-xl font-bold text-white">Sınav Sonucu</h2>

      {/* Overall score */}
      <div className={`rounded-xl p-6 text-center border ${
        passed
          ? 'bg-emerald-500/10 border-emerald-500/40'
          : 'bg-rose-500/10 border-rose-500/40'
      }`}>
        <div className={`text-5xl font-bold mb-1 ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>
          {pct}%
        </div>
        <div className="text-slate-300 text-sm mb-2">
          {correct} doğru / {answered} yanıtlandı / {total} toplam soru
        </div>
        <div className={`font-semibold text-sm ${passed ? 'text-emerald-300' : 'text-rose-300'}`}>
          {passed ? '✓ Geçme eşiği karşılandı (hedef ≥83%)' : '✗ Geçme eşiğinin altında — hedef: %83 (~750/900)'}
        </div>
        {answered < total && (
          <div className="mt-2 text-xs text-amber-400">
            {total - answered} soru yanıtsız kaldı (süre doldu veya atlandı)
          </div>
        )}
      </div>

      {/* Domain breakdown */}
      <div className="card p-4 space-y-3">
        <div className="text-sm font-semibold text-slate-300">Domain Bazında Performans</div>
        {domainScores.map((d) => {
          const pctD = d.answered > 0 ? Math.round((d.correct / d.answered) * 100) : 0
          const barPct = d.total > 0 ? (d.correct / d.total) * 100 : 0
          return (
            <div key={d.id} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">D{d.id} · {d.title.substring(0, 35)}</span>
                <span className={`text-xs font-semibold ${pctD >= 83 ? 'text-emerald-400' : pctD >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {d.correct}/{d.total} ({pctD}%)
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${pctD >= 83 ? 'bg-emerald-500' : pctD >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${barPct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Actionable advice */}
      {!passed && (
        <div className="card p-4 border-amber-500/30">
          <div className="text-sm font-semibold text-amber-300 mb-2">Odaklanılacak Alanlar</div>
          <ul className="text-xs text-slate-300 space-y-1">
            {domainScores.filter(d => d.answered > 0 && (d.correct / d.answered) < 0.83).map(d => (
              <li key={d.id}>• D{d.id}: %{Math.round((d.correct/d.answered)*100)} — ilgili modülleri tekrarla</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={onRestart} className="btn-primary w-full">
        Yeni Sınav Başlat
      </button>
    </div>
  )
}

/* ─── Timer Bar ─────────────────────────────────────────────────────── */
function TimerBar({ timeLeft, total }) {
  const pct = (timeLeft / (EXAM_MINUTES * 60)) * 100
  const isWarning = timeLeft < 600   // <10 min
  const isDanger  = timeLeft < 120   // <2 min
  return (
    <div className="card p-3 flex items-center gap-4">
      <div className={`text-2xl font-mono font-bold tabular-nums ${isDanger ? 'text-rose-400 animate-pulse' : isWarning ? 'text-amber-400' : 'text-white'}`}>
        {formatTime(timeLeft)}
      </div>
      <div className="flex-1">
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${isDanger ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="text-xs text-slate-400 flex-shrink-0">
        ~{Math.floor(timeLeft / Math.max(total, 1))} sn/soru
      </div>
    </div>
  )
}

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function ExamSimPage() {
  const all = useMemo(() => getAllQuestions(), [])
  const domains = getDomains()

  const [started, setStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [domainFilter, setDomainFilter] = useState('all')
  const [timeLeft, setTimeLeft] = useState(EXAM_MINUTES * 60)
  const [examEnded, setExamEnded] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (!started || examEnded) return
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id)
          setExamEnded(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [started, examEnded])

  const pool = domainFilter === 'all'
    ? all
    : all.filter((q) => String(q.domainId) === String(domainFilter))

  const startExam = (count) => {
    setQuestions(shuffle(pool).slice(0, count))
    setTimeLeft(EXAM_MINUTES * 60)
    setExamEnded(false)
    setStarted(true)
  }

  const startWeighted = () => {
    const total = 90
    const result = []
    domains.forEach((d) => {
      const dPool = shuffle(all.filter((q) => String(q.domainId) === String(d.id)))
      const count = Math.round(total * (DOMAIN_WEIGHTS[String(d.id)] || 0))
      result.push(...dPool.slice(0, count))
    })
    setQuestions(shuffle(result))
    setTimeLeft(EXAM_MINUTES * 60)
    setExamEnded(false)
    setStarted(true)
  }

  const endExam = () => setExamEnded(true)

  const restart = () => {
    setStarted(false)
    setExamEnded(false)
    setTimeLeft(EXAM_MINUTES * 60)
    setQuestions([])
  }

  if (!all.length) return <div className="text-slate-400">Henüz soru havuzu boş.</div>

  /* Setup screen */
  if (!started) {
    return (
      <div className="max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Deneme Sınavı</h1>
          <p className="text-slate-400 text-sm mt-1">90 dakika · Geçme eşiği: %83 (~750/900 puan)</p>
        </div>

        {/* Weighted mode — most realistic */}
        <div className="card p-4 border-brand/40 bg-brand/5 space-y-2">
          <div className="text-sm font-semibold text-white">Gerçek Sınav Ağırlıkları (Önerilen)</div>
          <p className="text-xs text-slate-400">
            CompTIA SY0-701 domain ağırlıklarına göre 90 soru:
            D1 %12 · D2 %22 · D3 %18 · D4 %28 · D5 %20
          </p>
          <button onClick={startWeighted} className="btn-primary w-full">
            Gerçek Sınav Simülasyonu Başlat (90 soru · 90 dk)
          </button>
        </div>

        {/* Custom mode */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-300 mb-2">Domain filtresi (özel mod):</p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setDomainFilter('all')}
                className={domainFilter === 'all' ? 'btn-primary' : 'btn'}
              >
                Tümü ({all.length})
              </button>
              {domains.map((d) => {
                const c = all.filter((q) => String(q.domainId) === String(d.id)).length
                return (
                  <button
                    key={d.id}
                    onClick={() => setDomainFilter(String(d.id))}
                    className={domainFilter === String(d.id) ? 'btn-primary' : 'btn'}
                  >
                    D{d.id} ({c})
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-300 mb-2">Soru sayısı (havuzda {pool.length}):</p>
            <div className="flex gap-2 flex-wrap">
              {[10, 25, 50, 90].map((n) => (
                <button
                  key={n}
                  onClick={() => startExam(Math.min(n, pool.length))}
                  disabled={pool.length === 0}
                  className="btn-primary disabled:opacity-40"
                >
                  {Math.min(n, pool.length)} Soru
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Exam tips */}
        <div className="card p-4 space-y-1.5">
          <div className="text-xs font-semibold text-slate-400 mb-2">Sınav Stratejisi</div>
          {[
            'Her soru için ortalama 1 dakika. Takılırsan işaretle, devam et.',
            '"Always", "never", "only" gibi mutlak ifadeler genellikle yanlış şıktır.',
            'PBQ soruları en başta görünebilir — 5–8 dk üstüne harca, geçilirse dönersin.',
            'İki şık bariz yanlışsa önce onları ele, kalan ikisinden analiz et.',
            'Güvensizken ilk sezgini değiştirme — ikinci değiştirme çoğunlukla yanlış sonuç verir.',
            'Tüm sorular eşit puan. Boş bırakmak sıfır puan; tahmin et.',
          ].map((tip, i) => (
            <p key={i} className="text-xs text-slate-400">• {tip}</p>
          ))}
        </div>
      </div>
    )
  }

  /* Score summary (exam ended) */
  if (examEnded) {
    return (
      <div className="max-w-4xl space-y-4">
        {timeLeft === 0 && (
          <div className="card p-3 border-rose-500/40 bg-rose-500/10 text-center text-rose-300 text-sm font-semibold">
            Süre Doldu!
          </div>
        )}
        <ScoreSummary questions={questions} domains={domains} onRestart={restart} />
      </div>
    )
  }

  /* Active exam */
  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">
          Deneme Sınavı
          <span className="ml-2 text-sm text-slate-400 font-normal">({questions.length} soru)</span>
        </h1>
        <button onClick={endExam} className="btn text-sm">Sınavı Bitir →</button>
      </div>

      <TimerBar timeLeft={timeLeft} total={questions.length} />

      {questions.map((q, i) => (
        <QuestionCard key={q.id} question={q} index={i} />
      ))}

      <button onClick={endExam} className="btn-primary w-full">
        Sınavı Bitir ve Sonucu Gör
      </button>
    </div>
  )
}
