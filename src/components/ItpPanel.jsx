import HoldPoint from './HoldPoint.jsx'
import { STANDARDS, itpProgress } from '../data/itpTemplate.js'

export default function ItpPanel({ itp, onChange }) {
  const { signed, total, complete } = itpProgress(itp)

  function updateHoldPoint(i, next) {
    const copy = itp.slice()
    copy[i] = next
    onChange(copy)
  }

  return (
    <div className="itp">
      <div className={`itp__status ${complete ? 'itp__status--done' : ''}`}>
        <div>
          <div className="itp__statusline">
            {complete ? 'Primed — ready to hand over' : `${signed} of ${total} hold points signed`}
          </div>
          <div className="itp__bar">
            <span style={{ width: `${total ? (signed / total) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      <div className="itp__list">
        {itp.map((hp, i) => (
          <HoldPoint
            key={hp.key}
            holdPoint={hp}
            index={i}
            onChange={(next) => updateHoldPoint(i, next)}
          />
        ))}
      </div>

      <div className="itp__standards">
        <div className="itp__standards-title">Referenced standards</div>
        <ul>
          {STANDARDS.map((s) => (
            <li key={s.code}>
              <strong>{s.code}</strong> — {s.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
