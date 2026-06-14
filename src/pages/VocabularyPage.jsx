import { useMemo, useState } from 'react'
import baseWords from '../data/vocabulary.json'

const DOMAINS = ['Tümü', '1', '2', '3', '4', '5']
const LS_KEY = 'secplus-my-words'

function loadMyWords() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] }
}
function saveMyWords(arr) {
  localStorage.setItem(LS_KEY, JSON.stringify(arr))
}

function WordCard({ w, onDelete }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`card p-4 transition ${w.mine ? 'border-violet-500/40' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg font-bold text-white">{w.word}</span>
          {w.domain && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-brand/20 text-brand font-mono">D{w.domain}</span>
          )}
          {w.mine && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono">Benim</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-slate-500">{w.date}</span>
          {w.mine && onDelete && (
            <button
              onClick={() => onDelete(w.id)}
              className="text-xs text-rose-400 hover:text-rose-300 transition"
            >sil</button>
          )}
        </div>
      </div>

      {w.phrase && <p className="text-xs text-slate-500 italic mb-1">"{w.phrase}"</p>}
      <p className="text-sm text-emerald-300 font-medium">{w.turkishMeaning}</p>

      {(w.exampleSentence || w.examNote) && (
        <button
          onClick={() => setOpen(v => !v)}
          className="text-xs text-slate-600 hover:text-slate-400 mt-2 transition"
        >
          {open ? 'Kapat ▲' : 'Detay ▼'}
        </button>
      )}

      {open && (
        <div className="mt-3 space-y-2 border-t border-line pt-3">
          {w.exampleSentence && (
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-0.5">Orjinal Cumle</p>
              <p className="text-xs text-slate-200 leading-relaxed italic">"{w.exampleSentence}"</p>
            </div>
          )}
          {w.examNote && (
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2">
              <p className="text-xs text-amber-300 leading-relaxed">{w.examNote}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const emptyForm = { word: '', phrase: '', turkishMeaning: '', exampleSentence: '', examNote: '', domain: '' }

export default function VocabularyPage() {
  const [search, setSearch] = useState('')
  const [domain, setDomain] = useState('Tümü')
  const [myWords, setMyWords] = useState(loadMyWords)
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('all') // 'all' | 'mine' | 'base'

  const allWords = useMemo(() => [
    ...baseWords.map(w => ({ ...w, mine: false })),
    ...myWords.map(w => ({ ...w, mine: true })),
  ], [myWords])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return allWords.filter((w) => {
      const matchDomain = domain === 'Tümü' || w.domain === domain
      const matchTab = tab === 'all' || (tab === 'mine' ? w.mine : !w.mine)
      const matchSearch = !q || [w.word, w.phrase, w.turkishMeaning, w.examNote]
        .some((f) => f?.toLowerCase().includes(q))
      return matchDomain && matchTab && matchSearch
    })
  }, [allWords, search, domain, tab])

  const addWord = () => {
    if (!form.word.trim() || !form.turkishMeaning.trim()) return
    const newWord = {
      ...form,
      id: 'my-' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      mine: true,
    }
    const updated = [newWord, ...myWords]
    setMyWords(updated)
    saveMyWords(updated)
    setForm(emptyForm)
    setShowForm(false)
  }

  const deleteWord = (id) => {
    const updated = myWords.filter(w => w.id !== id)
    setMyWords(updated)
    saveMyWords(updated)
  }

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Kelime Defteri</h1>
          <p className="text-slate-400 text-sm mt-1">
            Sınav sorularında karşına cikan kelimeler. Mor = senin eklediklerin.
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="btn-primary text-sm"
        >
          {showForm ? 'Iptal' : '+ Kelime Ekle'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card p-4 border-violet-500/40 space-y-3">
          <p className="text-xs font-semibold text-violet-300">Yeni Kelime</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              placeholder="Kelime (ornk: prior) *"
              value={form.word}
              onChange={e => setForm(p => ({ ...p, word: e.target.value }))}
              className="input-field"
            />
            <input
              placeholder="Turkce anlami *"
              value={form.turkishMeaning}
              onChange={e => setForm(p => ({ ...p, turkishMeaning: e.target.value }))}
              className="input-field"
            />
            <input
              placeholder="Goruldugu cumle / ifade"
              value={form.phrase}
              onChange={e => setForm(p => ({ ...p, phrase: e.target.value }))}
              className="input-field"
            />
            <input
              placeholder="Domain (1-5, bos birakabilirsin)"
              value={form.domain}
              onChange={e => setForm(p => ({ ...p, domain: e.target.value }))}
              className="input-field"
            />
            <input
              placeholder="Ornek cumle (isteğe bağlı)"
              value={form.exampleSentence}
              onChange={e => setForm(p => ({ ...p, exampleSentence: e.target.value }))}
              className="input-field md:col-span-2"
            />
            <input
              placeholder="Sinav notu (ornk: Bu kelimeyi gordunde... )"
              value={form.examNote}
              onChange={e => setForm(p => ({ ...p, examNote: e.target.value }))}
              className="input-field md:col-span-2"
            />
          </div>
          <button
            onClick={addWord}
            disabled={!form.word.trim() || !form.turkishMeaning.trim()}
            className="btn-primary disabled:opacity-40"
          >
            Kaydet
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[180px] px-3 py-2 rounded-lg bg-panel border border-line text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand"
        />
        <div className="flex gap-1.5">
          {DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                domain === d ? 'bg-brand text-white' : 'bg-panel border border-line text-slate-400 hover:text-white'
              }`}
            >
              {d === 'Tümü' ? 'Tümü' : `D${d}`}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-line">
        {[
          { id: 'all',  label: `Tümü (${allWords.length})` },
          { id: 'mine', label: `Benim (${myWords.length})` },
          { id: 'base', label: `Eklenen (${baseWords.length})` },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm -mb-px border-b-2 transition ${
              tab === t.id ? 'border-brand text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-500">{filtered.length} kelime gösteriliyor</p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((w) => (
          <WordCard key={w.id} w={w} onDelete={w.mine ? deleteWord : null} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-slate-500 text-center py-12">Kelime bulunamadi.</p>
      )}
    </div>
  )
}
