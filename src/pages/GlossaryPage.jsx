import { useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { getAllGlossary } from '../lib/loadContent.js'
import GlossaryCard from '../components/glossary/GlossaryCard.jsx'

export default function GlossaryPage() {
  const all = useMemo(() => getAllGlossary(), [])
  const [q, setQ] = useState('')
  const fuse = useMemo(() => new Fuse(all, { keys: ['trigger', 'maps_to', 'explanation'], threshold: 0.4 }), [all])
  const list = q ? fuse.search(q).map((r) => r.item) : all

  return (
    <div className="max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Kritik Kelimeler Sözlüğü</h1>
        <p className="text-slate-400 text-sm">CompTIA'nın kafa karıştırmak için kullandığı tetikleyici (trigger) kelimeler ve Security+ karşılıkları.</p>
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Ara: terminated, insurance, air-gapped..."
        className="w-full px-3 py-2 rounded-lg bg-panel border border-line focus:border-brand outline-none text-sm"
      />
      <p className="text-xs text-slate-500">{list.length} kayıt</p>
      <div className="grid md:grid-cols-2 gap-3">
        {list.map((e, i) => <GlossaryCard key={i} entry={e} />)}
      </div>
    </div>
  )
}
