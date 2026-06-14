import { useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import acronyms from '../data/acronyms.json'

export default function AcronymsPage() {
  const [q, setQ] = useState('')
  const flat = useMemo(
    () => acronyms.groups.flatMap((g) => g.items.map((it) => ({ ...it, category: g.category }))),
    []
  )
  const fuse = useMemo(() => new Fuse(flat, { keys: ['acr', 'en', 'tr'], threshold: 0.4 }), [flat])
  const filtered = q ? fuse.search(q).map((r) => r.item) : null

  const groups = filtered
    ? Object.values(
        filtered.reduce((acc, it) => {
          ;(acc[it.category] ||= { category: it.category, items: [] }).items.push(it)
          return acc
        }, {})
      )
    : acronyms.groups

  return (
    <div className="max-w-5xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Akronim Cep Defteri</h1>
        <p className="text-slate-400 text-sm">Sınavda en çok karışan kısaltmalar. Türkçe karşılık ve tuzak notuyla.</p>
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Ara: SLE, DMARC, RTO, IPS..."
        className="w-full px-3 py-2 rounded-lg bg-panel border border-line focus:border-brand outline-none text-sm"
      />
      <div className="space-y-5">
        {groups.map((g) => (
          <div key={g.category}>
            <h2 className="text-sm font-semibold text-accent mb-2 uppercase tracking-wide">{g.category}</h2>
            <div className="grid md:grid-cols-2 gap-2">
              {g.items.map((it) => (
                <div key={it.acr} className="card p-3 flex gap-3 items-start">
                  <span className="font-mono font-bold text-brand shrink-0 w-16">{it.acr}</span>
                  <div className="min-w-0">
                    <div className="text-sm text-slate-200">{it.en}</div>
                    <div className="text-xs text-slate-400">{it.tr}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
