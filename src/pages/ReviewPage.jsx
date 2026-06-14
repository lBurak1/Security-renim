import { useMemo, useState } from 'react'
import { getAllQuestions } from '../lib/loadContent.js'
import { useProgress } from '../store/useProgress.js'
import QuestionCard from '../components/quiz/QuestionCard.jsx'

export default function ReviewPage() {
  const [mode, setMode] = useState('wrong')
  const all = useMemo(() => getAllQuestions(), [])
  const wrongIds = useProgress((s) => s.wrongIds)()
  const flagged = useProgress((s) => s.flagged)

  const byId = useMemo(() => Object.fromEntries(all.map((q) => [q.id, q])), [all])
  const ids = mode === 'wrong' ? wrongIds : flagged
  const list = ids.map((id) => byId[id]).filter(Boolean)

  return (
    <div className="max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Tekrar Çalışma</h1>
        <p className="text-slate-400 text-sm">Yanlış yaptığın ve işaretlediğin soruları yeniden çöz.</p>
      </div>

      <div className="flex gap-2 border-b border-line">
        <button
          onClick={() => setMode('wrong')}
          className={`px-4 py-2 text-sm -mb-px border-b-2 ${mode === 'wrong' ? 'border-rose-500 text-white' : 'border-transparent text-slate-400'}`}
        >
          Yanlışlarım ({wrongIds.length})
        </button>
        <button
          onClick={() => setMode('flagged')}
          className={`px-4 py-2 text-sm -mb-px border-b-2 ${mode === 'flagged' ? 'border-amber-500 text-white' : 'border-transparent text-slate-400'}`}
        >
          İşaretlilerim ({flagged.length})
        </button>
      </div>

      {list.length === 0 ? (
        <p className="text-slate-500 py-8 text-center">
          {mode === 'wrong' ? 'Henüz yanlış cevaplanmış soru yok.' : 'Henüz işaretlenmiş soru yok.'}
        </p>
      ) : (
        <div className="space-y-4">
          {list.map((q, i) => <QuestionCard key={q.id} question={q} index={i} />)}
        </div>
      )}
    </div>
  )
}
