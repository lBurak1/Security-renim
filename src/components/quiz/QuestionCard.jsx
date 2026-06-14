import { useState } from 'react'
import SolutionPanel from './SolutionPanel.jsx'
import { useProgress } from '../../store/useProgress.js'

/* ─── Log Snippet Block ─────────────────────────────────────────────── */
function LogSnippetBlock({ logSnippet }) {
  const [guideOpen, setGuideOpen] = useState(false)
  return (
    <div className="mb-4 rounded-lg border border-sky-500/40 bg-sky-500/5 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-sky-500/10 border-b border-sky-500/30">
        <span className="text-xs font-mono font-semibold text-sky-300">LOG</span>
        <span className="text-xs text-sky-400">{logSnippet.source}</span>
      </div>
      <pre className="px-4 py-3 text-xs text-emerald-200 font-mono overflow-x-auto whitespace-pre leading-relaxed">
        {logSnippet.content}
      </pre>
      {logSnippet.readingGuideTr && (
        <div className="border-t border-sky-500/30">
          <button
            onClick={() => setGuideOpen(v => !v)}
            className="w-full text-left px-3 py-2 text-xs text-sky-300 hover:text-sky-200 flex items-center gap-1 transition"
          >
            <span>{guideOpen ? '▼' : '▶'}</span>
            <span>Bu logu nasıl okuruz? (Türkçe rehber)</span>
          </button>
          {guideOpen && (
            <div className="px-4 pb-3 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
              {logSnippet.readingGuideTr}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Scenario Context Block ────────────────────────────────────────── */
function ScenarioBlock({ scenario }) {
  const [trOpen, setTrOpen] = useState(false)
  return (
    <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/5 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border-b border-amber-500/30">
        <span className="text-xs font-semibold text-amber-300">Kurumsal Senaryo</span>
      </div>
      <div className="px-4 py-3">
        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{scenario.contextEn}</p>
      </div>
      {scenario.contextTr && (
        <div className="border-t border-amber-500/30">
          <button
            onClick={() => setTrOpen(v => !v)}
            className="w-full text-left px-3 py-2 text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 transition"
          >
            <span>{trOpen ? '▼' : '▶'}</span>
            <span>Türkçe Analiz</span>
          </button>
          {trOpen && (
            <div className="px-4 pb-3 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
              {scenario.contextTr}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── PBQ Matching Card ─────────────────────────────────────────────── */
function PBQMatchingCard({ question }) {
  const { pbqData } = question
  const [matches, setMatches] = useState({})
  const [selectedItem, setSelectedItem] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const recordAnswer = useProgress((s) => s.recordAnswer)

  const handleItemClick = (itemId) => {
    if (revealed) return
    if (matches[itemId]) {
      setMatches(prev => { const n = { ...prev }; delete n[itemId]; return n })
      setSelectedItem(null)
    } else {
      setSelectedItem(prev => prev === itemId ? null : itemId)
    }
  }

  const handleTargetClick = (targetId) => {
    if (revealed || !selectedItem) return
    setMatches(prev => {
      const n = { ...prev }
      Object.keys(n).forEach(k => { if (n[k] === targetId) delete n[k] })
      n[selectedItem] = targetId
      return n
    })
    setSelectedItem(null)
  }

  const allMatched = pbqData.items.every(item => matches[item.id])

  const submit = () => {
    if (!allMatched) return
    const isFullyCorrect = pbqData.items.every(
      item => matches[item.id] === pbqData.correctMatches[item.id]
    )
    recordAnswer(question.id, matches, isFullyCorrect)
    setRevealed(true)
  }

  const getStatus = (itemId) => {
    if (!revealed) return null
    return matches[itemId] === pbqData.correctMatches[itemId] ? 'correct' : 'wrong'
  }

  const getMatchedTarget = (itemId) =>
    matches[itemId] ? pbqData.targets.find(t => t.id === matches[itemId]) : null

  const correctCount = revealed
    ? pbqData.items.filter(item => matches[item.id] === pbqData.correctMatches[item.id]).length
    : null

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-purple-500/40 bg-purple-500/5 p-3">
        <div className="text-xs font-semibold text-purple-300 mb-1">Performance-Based Question (PBQ)</div>
        <p className="text-sm text-slate-200">{pbqData.instructionEn}</p>
        {pbqData.instructionTr && (
          <p className="text-xs text-slate-400 mt-1 italic">{pbqData.instructionTr}</p>
        )}
      </div>

      {!revealed && (
        <p className="text-xs text-slate-400">
          {selectedItem
            ? `Seçildi: "${pbqData.items.find(i => i.id === selectedItem)?.textTr}" → Sağdan sınıf seç`
            : 'Sol taraftan bir davranışa tıkla, ardından sağdan sınıfıyla eşleştir. Eşleşeni tekrar tıklarsan iptal edilir.'}
        </p>
      )}

      {revealed && (
        <div className={`text-sm font-semibold text-center py-2 rounded-lg ${
          correctCount === pbqData.items.length
            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
            : 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
        }`}>
          {correctCount}/{pbqData.items.length} doğru eşleşme
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* LEFT — Items */}
        <div className="space-y-2">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Davranış / Log Kanıtı</div>
          {pbqData.items.map(item => {
            const matched = getMatchedTarget(item.id)
            const status = getStatus(item.id)
            const isSelected = selectedItem === item.id
            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`rounded-lg border p-3 cursor-pointer transition text-sm select-none
                  ${isSelected ? 'border-purple-400 bg-purple-400/15 ring-1 ring-purple-400/40' : ''}
                  ${status === 'correct' ? 'border-emerald-500 bg-emerald-500/10' : ''}
                  ${status === 'wrong' ? 'border-rose-500 bg-rose-500/10' : ''}
                  ${!status && !isSelected ? 'border-line hover:border-slate-500' : ''}
                `}
              >
                <p className="text-slate-100 leading-snug text-xs">{item.textEn}</p>
                {item.textTr && <p className="text-xs text-slate-500 mt-0.5 italic">{item.textTr}</p>}
                {matched && (
                  <div className={`mt-2 text-xs font-semibold flex flex-wrap items-center gap-1
                    ${status === 'correct' ? 'text-emerald-400' : status === 'wrong' ? 'text-rose-400' : 'text-purple-300'}`}
                  >
                    {status === 'correct' && '✓ '}
                    {status === 'wrong' && '✗ '}
                    → {matched.labelEn}
                    {!revealed && <span className="ml-1 text-slate-500 font-normal">(tıkla: iptal)</span>}
                    {revealed && status === 'wrong' && (
                      <span className="text-emerald-400 font-normal ml-1">
                        (Doğrusu: {pbqData.targets.find(t => t.id === pbqData.correctMatches[item.id])?.labelEn})
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* RIGHT — Targets */}
        <div className="space-y-2">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Sınıf / Tür</div>
          {pbqData.targets.map(target => {
            const isUsed = Object.values(matches).includes(target.id)
            const canSelect = !revealed && !!selectedItem
            return (
              <button
                key={target.id}
                disabled={revealed || !selectedItem}
                onClick={() => handleTargetClick(target.id)}
                className={`w-full text-left rounded-lg border px-3 py-3 text-sm transition
                  ${revealed ? 'border-line text-slate-500 cursor-default' : ''}
                  ${!revealed && isUsed ? 'border-purple-500/50 bg-purple-500/10 text-purple-200' : ''}
                  ${!revealed && canSelect && !isUsed ? 'border-sky-400 bg-sky-400/10 hover:bg-sky-400/20 text-white' : ''}
                  ${!revealed && !canSelect ? 'border-line text-slate-400 cursor-default' : ''}
                `}
              >
                {!revealed && isUsed && <span className="text-purple-400 mr-1 text-xs">✓</span>}
                {target.labelEn}
              </button>
            )
          })}
        </div>
      </div>

      {!revealed ? (
        <button
          onClick={submit}
          disabled={!allMatched}
          className="btn-primary mt-2 disabled:opacity-40"
        >
          Eşleştirmeleri Kontrol Et ({Object.keys(matches).length}/{pbqData.items.length} eşleşti)
        </button>
      ) : (
        <SolutionPanel question={question} />
      )}
    </div>
  )
}

/* ─── Main QuestionCard ─────────────────────────────────────────────── */
export default function QuestionCard({ question, index }) {
  const [chosen, setChosen] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const recordAnswer = useProgress((s) => s.recordAnswer)
  const toggleFlag = useProgress((s) => s.toggleFlag)
  const flagged = useProgress((s) => s.flagged.includes(question.id))

  const submit = () => {
    if (chosen == null) return
    setRevealed(true)
    recordAnswer(question.id, chosen, chosen === question.correct)
  }

  const qType = question.type || 'standard'

  const typeBadge = {
    'log-analysis': { label: 'Log Analizi', cls: 'bg-sky-500/20 text-sky-300' },
    'scenario':     { label: 'Senaryo',     cls: 'bg-amber-500/20 text-amber-300' },
    'pbq':          { label: 'PBQ',         cls: 'bg-purple-500/20 text-purple-300' },
  }[qType]

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-white flex items-center gap-2">
          Soru {index + 1}
          {typeBadge && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${typeBadge.cls}`}>
              {typeBadge.label}
            </span>
          )}
        </h3>
        <button onClick={() => toggleFlag(question.id)} className="text-sm flex-shrink-0">
          {flagged ? '[x] İşaretli' : 'İşaretle'}
        </button>
      </div>

      {/* PBQ — dedicated matching component */}
      {qType === 'pbq' && question.pbqData ? (
        <PBQMatchingCard question={question} />
      ) : (
        <>
          {qType === 'scenario' && question.scenario && (
            <ScenarioBlock scenario={question.scenario} />
          )}

          {qType === 'log-analysis' && question.logSnippet && (
            <LogSnippetBlock logSnippet={question.logSnippet} />
          )}

          {/* English question */}
          <p className="text-slate-100 leading-relaxed mb-2">{question.questionEn}</p>

          {/* Turkish summary */}
          {question.questionTr && (
            <p className="text-xs text-slate-400 leading-relaxed mb-3 border-l-2 border-slate-600 pl-2 whitespace-pre-line">
              {question.questionTr}
            </p>
          )}

          {/* Options */}
          {question.options && (
            <div className="space-y-2">
              {Object.entries(question.options).map(([k, v]) => {
                const isCorrect = revealed && k === question.correct
                const isWrongChosen = revealed && k === chosen && k !== question.correct
                return (
                  <button
                    key={k}
                    disabled={revealed}
                    onClick={() => setChosen(k)}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition text-sm
                      ${chosen === k && !revealed ? 'border-brand bg-brand/10' : 'border-line'}
                      ${isCorrect ? 'border-emerald-500 bg-emerald-500/15' : ''}
                      ${isWrongChosen ? 'border-rose-500 bg-rose-500/15' : ''}
                      ${!revealed ? 'hover:border-brand' : ''}`}
                  >
                    <b>{k})</b> {v}
                    {isCorrect && <span className="float-right text-emerald-400">✓</span>}
                    {isWrongChosen && <span className="float-right text-rose-400">✗</span>}
                  </button>
                )
              })}
            </div>
          )}

          {!revealed ? (
            <button
              onClick={submit}
              disabled={chosen == null}
              className="btn-primary mt-4 disabled:opacity-40"
            >
              Cevabı Kontrol Et
            </button>
          ) : (
            <SolutionPanel question={question} />
          )}
        </>
      )}
    </div>
  )
}
