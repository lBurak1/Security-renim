export default function SpecTable({ title, columns = [], rows = [] }) {
  return (
    <div className="my-4">
      {title && <div className="text-sm font-semibold text-accent mb-1">{title}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-panel2">
              {columns.map((c, i) => <th key={i} className="border border-line px-2 py-1 text-left text-slate-300">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-panel2/50">
                {r.map((cell, j) => <td key={j} className="border border-line px-2 py-1">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
