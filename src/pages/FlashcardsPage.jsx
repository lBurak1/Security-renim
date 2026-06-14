import { useMemo, useState } from 'react'
import { getAllGlossary, getDomains } from '../lib/loadContent.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function FlashcardsPage() {
  const domains = getDomains()
  const all = useMemo(() => getAllGlossary(), [])
  const [domainFilter, setDomainFilter] = useState('all')
  const [deck, setDeck] = useState(() => shuffle(all))
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const rebuild = (df) => {
    setDomainFilter(df)
    const filtered = df === 'all' ? all : all.filter((g) => String(g.domainId) === String(df))
    setDeck(shuffle(filtered))
    setIdx(0)
    setFlipped(false)
  }

  const next = () => { setFlipped(false); setIdx((i) => (i + 1) % deck.length) }
  const prev = () => { setFlipped(false); setIdx((i) => (i - 1 + deck.length) % deck.length) }

  const card = deck[idx]

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Akıllı Kartlar (Flashcards)</h1>
        <p className="text-slate-400 text-sm">İngilizce trigger kelimeyi gör → karşılığını tahmin et → çevir.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => rebuild('all')} className={domainFilter === 'all' ? 'btn-primary' : 'btn'}>Tümü</button>
        {domains.map((d) => (
          <button key={d.id} onClick={() => rebuild(String(d.id))} className={domainFilter === String(d.id) ? 'btn-primary' : 'btn'}>
            D{d.id}
          </button>
        ))}
      </div>

      {!card ? (
        <p className="text-slate-500 py-8 text-center">Bu domain için kart yok.</p>
      ) : (
        <>
          <div
            onClick={() => setFlipped((f) => !f)}
            className="card p-8 min-h-[220px] flex flex-col items-center justify-center text-center cursor-pointer select-none hover:border-brand transition"
          >
            {!flipped ? (
              <>
                <div className="text-xs text-slate-500 mb-2">TRIGGER (İngilizce) — çevirmek için tıkla</div>
                <div className="text-xl font-mono text-rose-300">{card.trigger}</div>
              </>
            ) : (
              <>
                <div className="text-xs text-slate-500 mb-2">SECURITY+ KARŞILIĞI</div>
                <div className="text-2xl font-bold text-emerald-300 mb-3">{card.maps_to}</div>
                <div className="text-sm text-slate-400">{card.explanation}</div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button onClick={prev} className="btn">← Önceki</button>
            <span className="text-sm text-slate-400">{idx + 1} / {deck.length}</span>
            <button onClick={next} className="btn-primary">Sonraki →</button>
          </div>
        </>
      )}
    </div>
  )
}
