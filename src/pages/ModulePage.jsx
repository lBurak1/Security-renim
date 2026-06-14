import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { getModuleById } from '../lib/loadContent.js'
import DocBlock from '../components/content/DocBlock.jsx'
import GlossaryCard from '../components/glossary/GlossaryCard.jsx'
import QuestionCard from '../components/quiz/QuestionCard.jsx'
import { useProgress } from '../store/useProgress.js'

function UseCaseCard({ uc }) {
  const [trOpen, setTrOpen] = useState(false)
  return (
    <div className="card overflow-hidden">
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3">
        <div className="text-xs text-amber-400 font-semibold mb-0.5">Kurumsal Vaka</div>
        <h3 className="text-white font-semibold text-sm">{uc.titleEn}</h3>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{uc.scenarioEn}</p>
        <button
          onClick={() => setTrOpen(v => !v)}
          className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 transition"
        >
          <span>{trOpen ? '▼' : '▶'}</span>
          <span>Türkçe Analiz {trOpen ? 'gizle' : 'göster'}</span>
        </button>
        {trOpen && (
          <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 space-y-2">
            <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{uc.analysisTr}</p>
            {uc.takeawayTr && (
              <div className="border-t border-amber-500/20 pt-2">
                <span className="text-xs font-semibold text-amber-400">Çıkarım: </span>
                <span className="text-xs text-slate-400">{uc.takeawayTr}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const BASE_TABS = [
  { id: 'doc',      label: 'Dökümantasyon' },
  { id: 'glossary', label: 'Kritik Kelimeler' },
  { id: 'quiz',     label: 'Sorular' },
]

export default function ModulePage() {
  const { moduleId } = useParams()
  const [tab, setTab] = useState('doc')
  const result = getModuleById(moduleId)
  const completed = useProgress((s) => s.completedModules.includes(moduleId))
  const toggleComplete = useProgress((s) => s.toggleModuleComplete)

  if (!result || !result.data) {
    return <div className="text-slate-400">Bu modülün içeriği henüz eklenmedi: <b>{moduleId}</b></div>
  }
  const { data, domain } = result

  const hasUseCases = Array.isArray(data.useCases) && data.useCases.length > 0

  const TABS = hasUseCases
    ? [...BASE_TABS, { id: 'usecases', label: 'Vakalar' }]
    : BASE_TABS

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-slate-500">Domain {domain.id} · {domain.title}</p>
          <h1 className="text-2xl font-bold text-white">{data.moduleId} {data.title}</h1>
        </div>
        <button onClick={() => toggleComplete(moduleId)} className={completed ? 'btn-primary' : 'btn'}>
          {completed ? '✓ Tamamlandı' : 'Tamamlandı işaretle'}
        </button>
      </div>

      <div className="flex gap-2 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm -mb-px border-b-2 ${tab === t.id ? 'border-brand text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'doc' && <DocBlock sections={data.documentation || []} />}

      {tab === 'glossary' && (
        <div className="space-y-3">
          {(data.glossary || []).length === 0 && <p className="text-slate-500">Bu modüle özel kelime eklenmedi.</p>}
          {(data.glossary || []).map((g, i) => <GlossaryCard key={i} entry={g} />)}
        </div>
      )}

      {tab === 'quiz' && (
        <div className="space-y-4">
          {(data.questions || []).length === 0 && <p className="text-slate-500">Bu modüle soru eklenmedi.</p>}
          {(data.questions || []).map((q, i) => <QuestionCard key={q.id} question={q} index={i} />)}
        </div>
      )}

      {tab === 'usecases' && hasUseCases && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">Kavramların gerçek kurumsal ortamlarda nasıl göründüğünü gösteren vakalar. Türkçe analizi açmak için her vakadaki butona tıkla.</p>
          {data.useCases.map((uc) => <UseCaseCard key={uc.id} uc={uc} />)}
        </div>
      )}
    </div>
  )
}
