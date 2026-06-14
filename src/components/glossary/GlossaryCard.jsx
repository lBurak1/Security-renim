export default function GlossaryCard({ entry }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 text-sm font-mono">{entry.trigger}</span>
        <span className="text-slate-500">→</span>
        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-sm font-semibold">{entry.maps_to}</span>
      </div>
      {entry.explanation && <p className="text-sm text-slate-400 mt-2">{entry.explanation}</p>}
    </div>
  )
}
