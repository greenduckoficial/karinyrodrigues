import React from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Hoje', end: true },
  { to: '/metas', label: 'Metas' },
  { to: '/evolucao', label: 'Evolução' },
  { to: '/perfil', label: 'Perfil' },
]

export function Nav() {
  return (
    <header className="border-b border-line">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
        <NavLink to="/" className="font-editorial text-lg text-ink">
          Cadence
        </NavLink>
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-1.5 text-sm transition-soft ${
                  isActive ? 'bg-line/70 text-ink' : 'text-muted hover:text-ink'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
