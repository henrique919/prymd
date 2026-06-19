import HoldPoint from './HoldPoint.jsx'
import { STANDARDS, itpProgress } from '../data/itpTemplate.js'
import { issueItpToClient, openItpPdf } from '../lib/itpReport.js'

export default function ItpPanel({ card, itp, onChange }) {
  const { signed, total, complete } = itpProgress(itp)
  const reportCard = { ...card, itp }

  function updateHoldPoint(i, next) {
    const copy = itp.slice()
    copy[i] = next
    onChange(copy)
  }

  function savePdf() {
    if (!complete) return
    openItpPdf(reportCard, { autoPrint: true })
  }

  function issueReport() {
    if (!complete) return
    issueItpToClient(reportCard)
  }

  return (
    <div className="itp">
      <div className={`itp__status ${complete ? 'itp__status--done' : ''}`}>
        <div>
          <div className="itp__statusline">
            {complete ? 'ITP complete — report ready to issue' : `${signed} of ${total} hold points signed`}
          </div>
          <div className="itp__bar">
            <span style={{ width: `${total ? (signed / total) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      <div className="itp__export">
        <div>
          <div className="itp__export-title">Professional ITP PDF</div>
          <div className="itp__export-note">
            {complete
              ? 'Create a clean branded report for saving, printing or issuing to the client.'
              : 'Finish and sign every hold point before exporting the handover PDF.'}
          </div>
        </div>
        <div className="itp__export-actions">
          <button className="btn btn--primary" disabled={!complete} onClick={savePdf}>
            Export / save PDF
          </button>
          <button className="btn btn--ghost" disabled={!complete} onClick={issueReport}>
            Issue to client
          </button>
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
