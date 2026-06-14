export default function SolutionPanel({ question }) {
  const s = question.solution || {}
  const qType = question.type || 'standard'

  return (
    <div className="mt-4 space-y-4 border-t border-line pt-4">

      {/* Pattern Hint — always first, most critical */}
      {s.patternHint && (
        <div className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 p-3">
          <div className="font-semibold text-emerald-300 mb-1">Cımbız Taktiği (Pattern Matching)</div>
          <p className="text-sm text-slate-100">{s.patternHint}</p>
        </div>
      )}

      {/* PBQ: Step-by-step solving logic */}
      {qType === 'pbq' && s.solvingLogicTr && (
        <div className="rounded-lg border border-purple-500/40 bg-purple-500/5 p-3">
          <div className="font-semibold text-purple-300 mb-2 text-sm">PBQ Çözüm Mantığı — Adım Adım</div>
          <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{s.solvingLogicTr}</p>
        </div>
      )}

      {/* Log Analysis: Decision chain from log to answer */}
      {qType === 'log-analysis' && s.logAnalysisTr && (
        <div className="rounded-lg border border-sky-500/40 bg-sky-500/5 p-3">
          <div className="font-semibold text-sky-300 mb-2 text-sm">Logdan Cevaba: Analiz Zinciri</div>
          <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{s.logAnalysisTr}</p>
        </div>
      )}

      {/* Why correct — detailed Turkish explanation */}
      {s.whyCorrectTr && (
        <div>
          <div className="font-semibold text-emerald-400 mb-1 text-sm">Doğru Cevap Neden Doğru?</div>
          <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{s.whyCorrectTr}</p>
        </div>
      )}

      {/* Legacy: Turkish question translation (only if new questionTr field absent) */}
      {s.translation && !question.questionTr && (
        <div>
          <div className="font-semibold text-accent mb-1 text-sm">Sorunun Türkçesi</div>
          <p className="text-sm text-slate-300">{s.translation}</p>
        </div>
      )}

      {/* Options in Turkish */}
      {s.optionsTr && (
        <div>
          <div className="font-semibold text-accent mb-1 text-sm">Şıkların Türkçesi</div>
          <ul className="text-sm text-slate-300 space-y-0.5">
            {Object.entries(s.optionsTr).map(([k, v]) => (
              <li key={k}>
                <b className={k === question.correct ? 'text-emerald-400' : ''}>{k})</b> {v}
                {k === question.correct && <span className="text-emerald-400"> ← Doğru</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Enhanced wrong-answer analysis with "when would it be correct" */}
      {s.whyWrongTr ? (
        <div>
          <div className="font-semibold text-rose-300 mb-2 text-sm">Çeldirici Analizi — Neden Yanlış / Ne Zaman Doğru Olurdu?</div>
          <div className="space-y-2">
            {Object.entries(s.whyWrongTr).map(([k, v]) => {
              if (k === question.correct) return null
              if (!v || typeof v !== 'object') return null
              return (
                <div key={k} className="rounded-lg border border-line p-3">
                  <div className="text-sm font-semibold text-slate-200 mb-1">{k}) Neden bu senaryoda yanlış?</div>
                  <p className="text-sm text-slate-300 mb-2 leading-relaxed">{v.explanationTr}</p>
                  {v.whenCorrectTr && v.whenCorrectTr !== 'N/A' && (
                    <div className="border-t border-line/50 pt-2 flex gap-1">
                      <span className="text-xs text-amber-400 font-semibold flex-shrink-0">Hangi senaryoda doğru?</span>
                      <span className="text-xs text-slate-400 leading-relaxed">{v.whenCorrectTr}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : s.whyWrong ? (
        /* Legacy simple whyWrong */
        <div>
          <div className="font-semibold text-rose-300 mb-1 text-sm">Çeldiriciler Neden Yanlış?</div>
          <ul className="text-sm text-slate-300 space-y-1">
            {Object.entries(s.whyWrong).map(([k, v]) => (
              <li key={k}><b>{k})</b> {v}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Concept link */}
      {s.conceptLinkTr && (
        <div className="rounded-lg border border-slate-600 bg-slate-800/50 p-3">
          <div className="text-xs font-semibold text-slate-400 mb-1">Kavram Bağlantısı</div>
          <p className="text-xs text-slate-400 whitespace-pre-line leading-relaxed">{s.conceptLinkTr}</p>
        </div>
      )}
    </div>
  )
}
