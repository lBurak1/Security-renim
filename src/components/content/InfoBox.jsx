const STYLES = {
  'onemli-not': { border: 'border-amber-500/60', bg: 'bg-amber-500/10', label: 'Önemli Not' },
  'teknik-spesifikasyon': { border: 'border-cyan-500/60', bg: 'bg-cyan-500/10', label: 'Teknik Spesifikasyon' },
  'tuzak': { border: 'border-rose-500/60', bg: 'bg-rose-500/10', label: 'Sınav Tuzağı' },
  'ipucu': { border: 'border-emerald-500/60', bg: 'bg-emerald-500/10', label: 'İpucu' },
}

export default function InfoBox({ kind = 'onemli-not', title, items = [] }) {
  const s = STYLES[kind] || STYLES['onemli-not']
  return (
    <div className={`my-4 rounded-lg border ${s.border} ${s.bg} p-3`}>
      <div className="font-semibold mb-2 flex items-center gap-2 text-white">
        {title || s.label}
      </div>
      <ul className="list-disc pl-5 space-y-1 text-sm text-slate-200">
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </div>
  )
}
