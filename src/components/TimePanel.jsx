import { useEffect, useState } from 'react'
import { uid } from '../lib/id.js'
import { getLocation, mapsUrl } from '../lib/geo.js'
import { getWorkerName, setWorkerName } from '../lib/worker.js'
import { ClockIcon, PinIcon } from './Icons.jsx'

function durationMs(entry, now) {
  const start = new Date(entry.checkInAt).getTime()
  const end = entry.checkOutAt ? new Date(entry.checkOutAt).getTime() : now
  return Math.max(0, end - start)
}

function formatDuration(ms) {
  const totalMin = Math.round(ms / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })
}

// Dead simple: one big button. Tap to check in on arrival (stamps time +
// best-effort location), tap again to check out. That's the whole feature —
// the log and the running total are just a read-out of what already happened.
export default function TimePanel({ timeLog = [], onChange }) {
  const [name, setName] = useState(getWorkerName())
  const [busy, setBusy] = useState(false)
  const [now, setNow] = useState(Date.now())

  const open = timeLog.find((e) => !e.checkOutAt)

  useEffect(() => {
    if (!open) return
    const t = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(t)
  }, [open])

  const totalMs = timeLog.reduce((sum, e) => sum + durationMs(e, now), 0)

  async function checkIn() {
    const who = (name || '').trim()
    if (!who) {
      alert('Add your name first so the log knows who was on site.')
      return
    }
    setWorkerName(who)
    setBusy(true)
    const loc = await getLocation()
    setBusy(false)
    const entry = {
      id: uid('time'),
      worker: who,
      checkInAt: new Date().toISOString(),
      checkInLoc: loc,
      checkOutAt: '',
      checkOutLoc: null,
    }
    onChange([entry, ...timeLog])
  }

  async function checkOut() {
    if (!open) return
    setBusy(true)
    const loc = await getLocation()
    setBusy(false)
    onChange(
      timeLog.map((e) =>
        e.id === open.id ? { ...e, checkOutAt: new Date().toISOString(), checkOutLoc: loc } : e
      )
    )
  }

  function remove(id) {
    if (!window.confirm('Delete this time entry?')) return
    onChange(timeLog.filter((e) => e.id !== id))
  }

  return (
    <div className="timepanel">
      <div className="timepanel__head">
        <div>
          <div className="timepanel__total">{formatDuration(totalMs)}</div>
          <div className="timepanel__totallabel">logged on this job</div>
        </div>
      </div>

      {!open && (
        <input
          className="field timepanel__name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      {!open ? (
        <button className="checkbtn checkbtn--in" onClick={checkIn} disabled={busy}>
          <ClockIcon />
          {busy ? 'Checking in…' : 'Check in — arriving on site'}
        </button>
      ) : (
        <button className="checkbtn checkbtn--out" onClick={checkOut} disabled={busy}>
          <ClockIcon />
          {busy
            ? 'Checking out…'
            : `On site as ${open.worker} — ${formatDuration(durationMs(open, now))} · tap to check out`}
        </button>
      )}

      <div className="timelog">
        {timeLog.length === 0 && !open && (
          <div className="timelog__empty">No check-ins yet on this job.</div>
        )}
        {timeLog.map((e) => {
          const inUrl = mapsUrl(e.checkInLoc)
          const outUrl = mapsUrl(e.checkOutLoc)
          return (
            <div key={e.id} className="timelog__row">
              <div className="timelog__main">
                <div className="timelog__worker">{e.worker}</div>
                <div className="timelog__when">
                  {fmtDate(e.checkInAt)} · {fmtTime(e.checkInAt)}
                  {' – '}
                  {e.checkOutAt ? fmtTime(e.checkOutAt) : 'on site now'}
                </div>
                <div className="timelog__links">
                  {inUrl && (
                    <a href={inUrl} target="_blank" rel="noreferrer" className="timelog__pin">
                      <PinIcon /> in
                    </a>
                  )}
                  {outUrl && (
                    <a href={outUrl} target="_blank" rel="noreferrer" className="timelog__pin">
                      <PinIcon /> out
                    </a>
                  )}
                </div>
              </div>
              <div className="timelog__dur">{formatDuration(durationMs(e, now))}</div>
              <button className="iconbtn" onClick={() => remove(e.id)} aria-label="Delete entry">
                ×
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
