import { useState } from 'react'
import { itpProgress } from '../data/itpTemplate.js'
import { labelById } from '../data/labels.js'
import { SearchIcon } from './Icons.jsx'

export default function SearchView({ board, onOpenCard }) {
  const [q, setQ] = useState('')

  const colOf = {}
  board.columns.forEach((c) => c.cardIds.forEach((id) => (colOf[id] = c.title)))

  const all = Object.values(board.cards)
  const query = q.trim().toLowerCase()
  const results = !query
    ? []
    : all.filter((c) => {
        const labelNames = (c.labels || []).map((id) => (labelById(id)?.name || '')).join(' ')
        const hay = [c.title, c.client, c.area, c.assignee, labelNames].join(' ').toLowerCase()
        return hay.includes(query)
      })

  return (
    <div className="view">
      <div className="searchbar">
        <SearchIcon />
        <input
          autoFocus
          className="searchbar__input"
          placeholder="Search jobs, builders, addresses, workers…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {!query && <div className="view__hint">Start typing to find a job.</div>}
      {query && results.length === 0 && <div className="view__hint">No jobs match “{q}”.</div>}

      <div className="joblist">
        {results.map((c) => {
          const { signed, total } = itpProgress(c.itp)
          return (
            <button key={c.id} className="jobrow" onClick={() => onOpenCard(c.id)}>
              <div className="jobrow__main">
                <div className="jobrow__title">{c.title || 'Untitled job'}</div>
                <div className="jobrow__meta">{[c.client, c.area].filter(Boolean).join(' · ')}</div>
              </div>
              <div className="jobrow__side">
                <span className="badge">{colOf[c.id] || ''}</span>
                <span className="jobrow__itp">ITP {signed}/{total}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
