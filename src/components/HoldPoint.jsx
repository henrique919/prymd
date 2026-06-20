import { useState } from 'react'
import PhotoStrip from './PhotoStrip.jsx'
import { CheckIcon } from './Icons.jsx'

// One hold point. Collapsed by default; tap the header to open. Signing it
// stamps a name + time and locks the visual into a "done" state.
export default function HoldPoint({ holdPoint, index, onChange, onLog, me }) {
  const [open, setOpen] = useState(false)
  const hp = holdPoint

  const allTicked = hp.items.every((it) => it.checked)
  const signed = !!hp.signedAt && hp.result !== 'pending'

  function patch(next) {
    onChange({ ...hp, ...next })
  }

  function toggleItem(id) {
    patch({ items: hp.items.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)) })
  }

  function setResult(result) {
    patch({ result })
  }

  function sign() {
    const name = window.prompt('Sign off as (your name):', hp.signedBy || me || '')
    if (name === null) return
    if (!name.trim()) {
      alert('A name is needed to sign off a hold point.')
      return
    }
    // Default the result to pass if the inspector ticked everything and
    // hasn't explicitly failed it.
    const result = hp.result === 'pending' ? (allTicked ? 'pass' : 'fail') : hp.result
    patch({ signedBy: name.trim(), signedAt: new Date().toISOString(), result })
    const label = result === 'pass' ? 'Pass' : result === 'fail' ? 'Fail' : 'N/A'
    if (onLog) onLog({ type: 'event', author: name.trim(), text: `signed off "${hp.title}" — ${label}` })
  }

  function unsign() {
    patch({ signedBy: '', signedAt: '' })
  }

  const statusLabel = signed
    ? hp.result === 'pass'
      ? 'Passed'
      : hp.result === 'fail'
      ? 'Failed'
      : 'N/A'
    : 'Pending'

  return (
    <div className={`holdpoint holdpoint--${signed ? hp.result : 'pending'}`}>
      <button className="holdpoint__head" onClick={() => setOpen((o) => !o)}>
        <span className="holdpoint__num">{index + 1}</span>
        <span className="holdpoint__titles">
          <span className="holdpoint__title">{hp.title}</span>
          <span className="holdpoint__blurb">{hp.blurb}</span>
        </span>
        <span className={`chip chip--${signed ? hp.result : 'pending'}`}>{statusLabel}</span>
      </button>

      {open && (
        <div className="holdpoint__body">
          <ul className="checklist">
            {hp.items.map((it) => (
              <li key={it.id}>
                <button
                  className={`check ${it.checked ? 'check--on' : ''}`}
                  onClick={() => toggleItem(it.id)}
                  disabled={signed}
                >
                  <span className="check__box">{it.checked && <CheckIcon />}</span>
                  <span className="check__text">{it.text}</span>
                </button>
              </li>
            ))}
          </ul>

          <label className="field__label">Notes</label>
          <textarea
            className="field"
            rows={2}
            placeholder="Anything worth recording…"
            value={hp.notes}
            onChange={(e) => patch({ notes: e.target.value })}
            disabled={signed}
          />

          <label className="field__label">Photos</label>
          <PhotoStrip
            photos={hp.photos}
            onChange={(photos) => patch({ photos })}
            label="Photo"
          />

          {!signed ? (
            <div className="holdpoint__actions">
              <div className="seg">
                <button
                  className={`seg__btn ${hp.result === 'pass' ? 'seg__btn--pass' : ''}`}
                  onClick={() => setResult('pass')}
                >
                  Pass
                </button>
                <button
                  className={`seg__btn ${hp.result === 'fail' ? 'seg__btn--fail' : ''}`}
                  onClick={() => setResult('fail')}
                >
                  Fail
                </button>
                <button
                  className={`seg__btn ${hp.result === 'na' ? 'seg__btn--na' : ''}`}
                  onClick={() => setResult('na')}
                >
                  N/A
                </button>
              </div>
              <button className="btn btn--primary" onClick={sign}>
                Sign off
              </button>
            </div>
          ) : (
            <div className="holdpoint__signed">
              <div>
                Signed by <strong>{hp.signedBy}</strong>
                <br />
                {new Date(hp.signedAt).toLocaleString()}
              </div>
              <button className="btn btn--ghost" onClick={unsign}>
                Reopen
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
