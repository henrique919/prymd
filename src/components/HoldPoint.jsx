import { useState } from 'react'
import PhotoStrip from './PhotoStrip.jsx'
import { CheckIcon } from './Icons.jsx'
import { BAYSET_PRODUCTS, isItpItemAnswered } from '../data/itpTemplate.js'

// One hold point. Collapsed by default; tap the header to open. Signing it
// stamps a name + time and locks the visual into a "done" state.
export default function HoldPoint({ holdPoint, index, onChange }) {
  const [open, setOpen] = useState(false)
  const [productOpenId, setProductOpenId] = useState('')
  const hp = holdPoint

  const answered = hp.items.filter(isItpItemAnswered).length
  const allAnswered = hp.items.every(isItpItemAnswered)
  const signed = !!hp.signedAt && hp.result !== 'pending'

  function patch(next) {
    onChange({ ...hp, ...next })
  }

  function updateItem(id, updater) {
    patch({
      items: hp.items.map((it) => (it.id === id ? updater(it) : it)),
    })
  }

  function setItemStatus(id, status) {
    updateItem(id, (it) => {
      if (status === 'checked') return { ...it, checked: !it.checked, na: false }
      if (status === 'na') return { ...it, checked: false, na: !it.na }
      return it
    })
  }

  function toggleProduct(itemId, product) {
    updateItem(itemId, (it) => {
      const selected = Array.isArray(it.selectedProducts) ? it.selectedProducts : []
      const next = selected.includes(product)
        ? selected.filter((name) => name !== product)
        : [...selected, product]
      return { ...it, selectedProducts: next, checked: false, na: false }
    })
  }

  function setResult(result) {
    if (result === 'na') {
      patch({
        result,
        items: hp.items.map((it) =>
          it.type === 'product-select'
            ? { ...it, selectedProducts: [] }
            : { ...it, checked: false, na: true }
        ),
      })
      return
    }
    patch({ result })
  }

  function sign() {
    if (hp.result !== 'na' && !allAnswered) {
      alert('Before signing off, tick, mark N/A, or complete the product selection for each checklist item.')
      return
    }
    const name = window.prompt('Sign off as (your name):', hp.signedBy || '')
    if (name === null) return
    if (!name.trim()) {
      alert('A name is needed to sign off a hold point.')
      return
    }
    // Default to pass once every checklist item has either been ticked,
    // marked N/A, or completed by product selection.
    const result = hp.result === 'pending' ? 'pass' : hp.result
    patch({ signedBy: name.trim(), signedAt: new Date().toISOString(), result })
  }

  function unsign() {
    patch({ signedBy: '', signedAt: '' })
  }

  function renderProductSelect(it) {
    const selected = Array.isArray(it.selectedProducts) ? it.selectedProducts : []
    const openProducts = productOpenId === it.id
    return (
      <div className="material-select">
        <button
          type="button"
          className="material-select__button"
          onClick={() => !signed && setProductOpenId(openProducts ? '' : it.id)}
          disabled={signed}
        >
          <span>
            <strong>{it.text}</strong>
            <small>{it.help || 'Select one or more products used.'}</small>
          </span>
          <em>{selected.length ? `${selected.length} selected` : 'Select products'}</em>
        </button>

        {selected.length > 0 && (
          <div className="product-chips">
            {selected.map((name) => <span key={name}>{name}</span>)}
          </div>
        )}

        {openProducts && !signed && (
          <div className="material-select__menu">
            {BAYSET_PRODUCTS.map((product) => (
              <label key={product} className="product-option">
                <input
                  type="checkbox"
                  checked={selected.includes(product)}
                  onChange={() => toggleProduct(it.id, product)}
                />
                <span>{product}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    )
  }

  function renderChecklistItem(it) {
    if (it.type === 'product-select') {
      return renderProductSelect(it)
    }

    return (
      <div className={`check check--row ${it.checked ? 'check--on' : ''} ${it.na ? 'check--na' : ''}`}>
        <span className="check__box">{it.checked && <CheckIcon />}{it.na && 'N/A'}</span>
        <span className="check__text">{it.text}</span>
        <span className="check__choices">
          <button
            type="button"
            className={`check__choice ${it.checked ? 'is-on' : ''}`}
            onClick={() => setItemStatus(it.id, 'checked')}
            disabled={signed}
          >
            Tick
          </button>
          <button
            type="button"
            className={`check__choice check__choice--na ${it.na ? 'is-on' : ''}`}
            onClick={() => setItemStatus(it.id, 'na')}
            disabled={signed}
          >
            N/A
          </button>
        </span>
      </div>
    )
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
          <div className="holdpoint__hint">
            {answered}/{hp.items.length} items answered. Use N/A where a requirement does not apply to this location.
          </div>
          <ul className="checklist">
            {hp.items.map((it) => (
              <li key={it.id}>{renderChecklistItem(it)}</li>
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
                  Whole HP N/A
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
