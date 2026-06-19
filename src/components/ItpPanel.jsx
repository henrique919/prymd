import HoldPoint from './HoldPoint.jsx'
import { STANDARDS, itpProgress } from '../data/itpTemplate.js'
import { locationLabel } from '../lib/location.js'

export default function ItpPanel({
  itp,
  onChange,
  location,
  locations = [],
  activeLocationId,
  onSelectLocation,
  onExport,
  onIssue,
}) {
  const { signed, total, complete } = itpProgress(itp)

  function updateHoldPoint(i, next) {
    const copy = itp.slice()
    copy[i] = next
    onChange(copy)
  }

  return (
    <div className="itp">
      <div className="itp__toolbar">
        <div className="itp__locationpicker">
          <label className="field__label">Location / ITP set</label>
          <select className="field" value={activeLocationId || ''} onChange={(e) => onSelectLocation?.(e.target.value)}>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>{locationLabel(loc)}</option>
            ))}
          </select>
        </div>
        <div className="itp__actions">
          <button className="btn btn--ghost" onClick={onExport} disabled={!complete} title={!complete ? 'Sign every hold point before exporting' : ''}>
            Export / save PDF
          </button>
          <button className="btn btn--primary" onClick={onIssue} disabled={!complete} title={!complete ? 'Sign every hold point before issuing' : ''}>
            Issue to client
          </button>
        </div>
      </div>

      <div className="itp__locationnote">
        <strong>{locationLabel(location)}</strong>
        <span>
          This ITP belongs to the selected location only. Add another bathroom, balcony or zone in the Locations tab to create another ITP set.
        </span>
      </div>

      <div className={`itp__status ${complete ? 'itp__status--done' : ''}`}>
        <div>
          <div className="itp__statusline">
            {complete ? 'Primed — ready to export / issue' : `${signed} of ${total} hold points signed`}
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
