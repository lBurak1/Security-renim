import { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { getDomains } from '../../lib/loadContent.js'
import { useProgress } from '../../store/useProgress.js'

const DOMAIN_COLORS = ['bg-blue-500', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-violet-500']

export default function Sidebar({ open: mobileOpen, onClose }) {
  const domains = getDomains()
  const completed = useProgress((s) => s.completedModules)
  const { moduleId } = useParams()
  const activeDomain = moduleId ? Number(String(moduleId).split('.')[0]) : null
  const [open, setOpen] = useState(() => (activeDomain ? { [activeDomain]: true } : { 1: true }))
  const toggle = (id) => setOpen((o) => ({ ...o, [id]: !o[id] }))

  const handleNavClick = () => {
    if (onClose) onClose()
  }

  return (
    <aside className={`
      w-72 shrink-0 bg-panel border-r border-line flex flex-col
      fixed md:relative inset-y-0 left-0 z-50
      transition-transform duration-300
      ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="p-4 border-b border-line flex items-center justify-between">
        <div>
          <h1 className="font-bold text-white text-lg">Security+ <span className="text-accent">SY0-701</span></h1>
          <p className="text-xs text-slate-400">Kişisel Hazırlık Paneli</p>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden text-slate-400 hover:text-white p-1 text-xl leading-none"
          aria-label="Kapat"
        >
          ✕
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 text-sm">
        <NavLink
          to="/"
          onClick={handleNavClick}
          className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-brand text-white' : 'hover:bg-panel2'}`}
        >
          Genel Bakış
        </NavLink>

        {domains.map((d, i) => {
          const isOpen = !!open[d.id]
          const done = d.modules.filter((m) => completed.includes(m.id)).length
          return (
            <div key={d.id}>
              <button
                onClick={() => toggle(d.id)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-panel2 transition text-left"
              >
                <span className={`w-2 h-2 rounded-full ${DOMAIN_COLORS[i]}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-200">Domain {d.id} · %{d.weight}</div>
                  <div className="text-[11px] text-slate-500 truncate">{d.title}</div>
                </div>
                <span className="text-[10px] text-slate-500">{done}/{d.modules.length}</span>
                <span className={`text-slate-500 transition-transform ${isOpen ? 'rotate-90' : ''}`}>▸</span>
              </button>

              {isOpen && (
                <div className="mt-1 ml-3 pl-2 border-l border-line space-y-0.5">
                  {d.modules.length === 0 && <p className="px-3 text-[11px] text-slate-600 italic">içerik yakında</p>}
                  {d.modules.map((m) => (
                    <NavLink
                      key={m.id}
                      to={`/module/${m.id}`}
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-1.5 rounded-lg ${isActive ? 'bg-panel2 text-accent' : 'hover:bg-panel2 text-slate-400'}`
                      }
                    >
                      <span>{m.id} {m.title}</span>
                      {completed.includes(m.id) && <span className="text-emerald-400">✓</span>}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="p-3 border-t border-line space-y-1">
        {[
          { to: '/vocabulary', label: 'Kelime Defteri' },
          { to: '/glossary', label: 'Terim Sozlugu' },
          { to: '/acronyms', label: 'Akronim Cep Defteri' },
          { to: '/flashcards', label: 'Akilli Kartlar' },
          { to: '/review', label: 'Tekrar (Yanlis/Isaretli)' },
          { to: '/exam', label: 'Deneme Sinavi' },
        ].map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={handleNavClick}
            className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-brand text-white' : 'hover:bg-panel2'}`}
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </aside>
  )
}
