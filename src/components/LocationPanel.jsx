import { useState } from 'react'
import PhotoStrip from './PhotoStrip.jsx'
import { PlusIcon, TrashIcon } from './Icons.jsx'
import { itpProgress } from '../data/itpTemplate.js'
import { createLocation, locationLabel } from '../lib/location.js'

const emptyForm = {
  building: '',
  level: '',
  unit: '',
  areaName: '',
  scheduledDate: '',
  scheduledTime: '',
  assignee: '',
  comments: '',
}

function compactDate(date, time) {
  if (!date && !time) return ''
  return [date, time].filter(Boolean).join(' · ')
}

export default function LocationPanel({ locations = [], activeLocationId, onAdd, onUpdate, onDelete, onSelect }) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(emptyForm)

  function field(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function addLocation() {
    const hasLocation = [form.building, form.level, form.unit, form.areaName].some((v) => v.trim())
    if (!hasLocation) {
      alert('Add at least one location detail, like Building 1, Level 1, Unit 105 or Bathroom.')
      return
    }
    const next = createLocation(form)
    onAdd(next)
    setForm(emptyForm)
    setAdding(false)
  }

  return (
    <div className="locations">
      <div className="locations__intro">
        <div>
          <div className="locations__title">Project locations</div>
          <p>
            Add the actual work areas inside this job/site. Each location gets its own ITP set,
            photos, comments and planned resource details.
          </p>
        </div>
        {!adding && (
          <button className="btn btn--primary" onClick={() => setAdding(true)}>
            <PlusIcon /> Add location
          </button>
        )}
      </div>

      {adding && (
        <div className="location-form">
          <div className="location-form__grid">
            <div>
              <label className="field__label">Building</label>
              <input className="field" placeholder="Building 1" value={form.building} onChange={(e) => field('building', e.target.value)} />
            </div>
            <div>
              <label className="field__label">Level</label>
              <input className="field" placeholder="Level 1" value={form.level} onChange={(e) => field('level', e.target.value)} />
            </div>
            <div>
              <label className="field__label">Unit / lot</label>
              <input className="field" placeholder="Unit 105" value={form.unit} onChange={(e) => field('unit', e.target.value)} />
            </div>
            <div>
              <label className="field__label">Room / area</label>
              <input className="field" placeholder="Bathroom" value={form.areaName} onChange={(e) => field('areaName', e.target.value)} />
            </div>
            <div>
              <label className="field__label">Planned date</label>
              <input className="field" type="date" value={form.scheduledDate} onChange={(e) => field('scheduledDate', e.target.value)} />
            </div>
            <div>
              <label className="field__label">Planned time</label>
              <input className="field" type="time" value={form.scheduledTime} onChange={(e) => field('scheduledTime', e.target.value)} />
            </div>
          </div>
          <label className="field__label">Assigned crew / worker</label>
          <input className="field" placeholder="Dave / waterproofing crew" value={form.assignee} onChange={(e) => field('assignee', e.target.value)} />
          <label className="field__label">Comments</label>
          <textarea className="field" rows={2} placeholder="Access, sequence, prep notes…" value={form.comments} onChange={(e) => field('comments', e.target.value)} />
          <div className="card-form__actions">
            <button className="btn btn--ghost" onClick={() => setAdding(false)}>Cancel</button>
            <button className="btn btn--primary" onClick={addLocation}>Create location + ITP</button>
          </div>
        </div>
      )}

      <div className="locations__list">
        {locations.map((location) => {
          const { signed, total, complete } = itpProgress(location.itp)
          const active = location.id === activeLocationId
          return (
            <article key={location.id} className={`location-card ${active ? 'location-card--active' : ''}`}>
              <header className="location-card__head">
                <button className="location-card__select" onClick={() => onSelect(location.id)}>
                  <span>{locationLabel(location)}</span>
                  <small>{compactDate(location.scheduledDate, location.scheduledTime) || 'No date/time set'}</small>
                </button>
                <span className={`chip chip--${complete ? 'pass' : 'pending'}`}>ITP {signed}/{total}</span>
              </header>

              <div className="location-card__grid">
                <div>
                  <label className="field__label">Building</label>
                  <input className="field" value={location.building || ''} onChange={(e) => onUpdate({ ...location, building: e.target.value })} />
                </div>
                <div>
                  <label className="field__label">Level</label>
                  <input className="field" value={location.level || ''} onChange={(e) => onUpdate({ ...location, level: e.target.value })} />
                </div>
                <div>
                  <label className="field__label">Unit / lot</label>
                  <input className="field" value={location.unit || ''} onChange={(e) => onUpdate({ ...location, unit: e.target.value })} />
                </div>
                <div>
                  <label className="field__label">Room / area</label>
                  <input className="field" value={location.areaName || ''} onChange={(e) => onUpdate({ ...location, areaName: e.target.value })} />
                </div>
                <div>
                  <label className="field__label">Date</label>
                  <input className="field" type="date" value={location.scheduledDate || ''} onChange={(e) => onUpdate({ ...location, scheduledDate: e.target.value })} />
                </div>
                <div>
                  <label className="field__label">Time</label>
                  <input className="field" type="time" value={location.scheduledTime || ''} onChange={(e) => onUpdate({ ...location, scheduledTime: e.target.value })} />
                </div>
              </div>

              <label className="field__label">Assigned crew / worker</label>
              <input className="field" value={location.assignee || ''} onChange={(e) => onUpdate({ ...location, assignee: e.target.value })} />

              <label className="field__label">Comments</label>
              <textarea className="field" rows={2} value={location.comments || ''} onChange={(e) => onUpdate({ ...location, comments: e.target.value })} />

              <label className="field__label">Location photos</label>
              <PhotoStrip photos={location.photos || []} onChange={(photos) => onUpdate({ ...location, photos })} />

              <div className="location-card__actions">
                <button className="btn btn--primary" onClick={() => onSelect(location.id)}>Use this ITP</button>
                <button className="btn btn--ghost" onClick={() => onDelete(location.id)}><TrashIcon /> Delete</button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
