import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import InfoBox from './InfoBox.jsx'
import SpecTable from './SpecTable.jsx'

export default function DocBlock({ sections = [] }) {
  return (
    <div className="space-y-6">
      {sections.map((sec, i) => (
        <section key={i} className="card p-5">
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-brand rounded" />{sec.heading}
          </h2>
          {sec.body && (
            <div className="prose-doc text-slate-200">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{sec.body}</ReactMarkdown>
            </div>
          )}
          {(sec.infoBoxes || []).map((b, j) => (
            <InfoBox key={j} kind={b.kind} title={b.title} items={b.items} />
          ))}
          {sec.specTable && (
            <SpecTable title={sec.specTable.title} columns={sec.specTable.columns} rows={sec.specTable.rows} />
          )}
        </section>
      ))}
    </div>
  )
}
