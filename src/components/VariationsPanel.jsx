import { useState } from 'react'
import PhotoStrip from './PhotoStrip.jsx'
import { uid } from '../lib/id.js'
import { PlusIcon, TrashIcon } from './Icons.jsx'

function money(n) {
  const v = Number(n) || 0
  return v.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })
}

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-AU')
}

export default function VariationsPanel({ variations = [], onChange }) {
  const [adding, setAdding] = useState(false)
  const [desc, setDesc] = useState('')
  const [cost, setCost] = useState('')
  const [photos, setPhotos] = useState([])
  const safeVariations = Array.isArray(variations) ? variations : []

  const total = safeVariations.reduce((sum, v) => sum + (Number(v.cost) || 0), 0)

  function add() {
    if (!desc.trim()) {
      alert('Add a short description of the extra work.')
      return
    }
    const variation = {
      id: uid('var'),
      description: desc.trim(),
      cost: Number(cost) || 0,
      photos,
      date: new Date().toISOString(),
      status: 'pending', // pending | approved
    }
    onChange([...safeVariations, variation])
    setDesc('')
    setCost('')
    setPhotos([])
    setAdding(false)
  }

  function remove(id) {
    if (!window.confirm('Delete this variation?')) return
    onChange(safeVariations.filter((v) => v.id !== id))
  }

  function toggleStatus(id) {
    onChange(
      safeVariations.map((v) =>
        v.id === id ? { ...v, status: v.status === 'approved' ? 'pending' : 'approved' } : v
      )
    )
  }

  function updatePhotos(id, next) {
    onChange(safeVariations.map((v) => (v.id === id ? { ...v, photos: next } : v)))
  }

  return (
    <div className="variations">
      <div className="variations__head">
        <div>
          <div className="variations__count">
            {safeVariations.length} variation{safeVariations.length === 1 ? '' : 's'}
          </div>
          <div className="variations__total">{money(total)} extra work logged</div>
        </div>
        {!adding && (
          <button className="btn btn--primary" onClick={() => setAdding(true)}>
            <PlusIcon /> Add variation
          </button>
        )}
      </div>

      {adding && (
        <div className="card-form">
          <label className="field__label">What was the extra work?</label>
          <textarea
            className="field"
            rows={2}
            placeholder="e.g. Client asked us to also seal the balcony — not in original quote"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <label className="field__label">Cost (AUD)</label>
          <input
            className="field"
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
          <label className="field__label">Photos</label>
          <PhotoStrip photos={photos} onChange={setPhotos} label="Photo" />
          <div className="card-form__actions">
            <button className="btn btn--ghost" onClick={() => setAdding(false)}>
              Cancel
            </button>
            <button className="btn btn--primary" onClick={add}>
              Save variation
            </button>
          </div>
        </div>
      )}

      <div className="variations__list">
        {safeVariations.map((v) => (
          <div key={v.id} className="variation">
            <div className="variation__top">
              <span className="variation__cost">{money(v.cost)}</span>
              <button
                className={`chip chip--${v.status === 'approved' ? 'pass' : 'pending'} chip--btn`}
                onClick={() => toggleStatus(v.id)}
              >
                {v.status === 'approved' ? 'Approved' : 'Pending'}
              </button>
              <button className="iconbtn" onClick={() => remove(v.id)} aria-label="Delete variation">
                <TrashIcon />
              </button>
            </div>
            <div className="variation__desc">{v.description}</div>
            {v.photos?.length > 0 && (
              <PhotoStrip
                photos={v.photos}
                onChange={(next) => updatePhotos(v.id, next)}
                label="Photo"
              />
            )}
            {formatDate(v.date) && <div className="variation__date">{formatDate(v.date)}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
