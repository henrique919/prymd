import { useState } from 'react'
import { STANDARDS } from '../data/itpTemplate.js'

export default function MenuView({ me, onSetMe, onReset }) {
  const [name, setName] = useState(me || '')

  return (
    <div className="view">
      <h2 className="view__title">Menu</h2>

      <div className="panel">
        <label className="field__label">Your name</label>
        <p className="panel__hint">Used to sign your comments and ITP sign-offs so the crew knows who did what.</p>
        <input
          className="field"
          value={name}
          placeholder="e.g. Dave"
          onChange={(e) => setName(e.target.value)}
          onBlur={() => onSetMe(name.trim())}
        />
      </div>

      <div className="panel">
        <div className="panel__title">ITP standards</div>
        <ul className="panel__list">
          {STANDARDS.map((s) => (
            <li key={s.code}>
              <strong>{s.code}</strong> — {s.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="panel">
        <div className="panel__title">About</div>
        <p className="panel__hint">
          <strong>Tanqo</strong> — Rev 5. From <em>tanking</em>, the trade's word for waterproofing a
          wet area. Tank it, log it, prove it: a Trello-style job board with built-in ITPs, variations,
          photos and an activity feed, built for waterproofing crews. Prototype data is stored on this
          device only.
        </p>
        <button className="btn btn--danger" onClick={onReset}>Reset demo data</button>
      </div>
    </div>
  )
}
