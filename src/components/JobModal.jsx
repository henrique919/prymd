import { useState } from 'react'
import PhotoStrip from './PhotoStrip.jsx'
import ItpPanel from './ItpPanel.jsx'
import VariationsPanel from './VariationsPanel.jsx'
import TimePanel from './TimePanel.jsx'
import LocationPanel from './LocationPanel.jsx'
import { itpProgress } from '../data/itpTemplate.js'
import { CloseIcon } from './Icons.jsx'
import { createLocation, locationLabel } from '../lib/location.js'
import { issueItpToClient, openItpPdf } from '../lib/itpReport.js'

export default function JobModal({ card, columns, columnId, onChange, onMove, onClose, onDelete }) {
  const [tab, setTab] = useState('job')
  const legacyItp = Array.isArray(card.itp) ? card.itp : []
  const photos = Array.isArray(card.photos) ? card.photos : []
  const variations = Array.isArray(card.variations) ? card.variations : []
  const timeLog = Array.isArray(card.timeLog) ? card.timeLog : []
  const locations = Array.isArray(card.locations) && card.locations.length
    ? card.locations
    : [createLocation({ name: card.title || 'Main wet area', itp: legacyItp })]
  const activeLocation = locations.find((l) => l.id === card.activeLocationId) || locations[0]
  const activeItp = Array.isArray(activeLocation?.itp) ? activeLocation.itp : legacyItp
  const { signed, total } = itpProgress(activeItp)
  const onSite = timeLog.find((e) => e && !e.checkOutAt)

  function patch(next) {
    onChange({ ...card, ...next })
  }

  function field(key, value) {
    patch({ [key]: value })
  }

  function syncLocations(nextLocations, preferredId) {
    const safe = nextLocations.length ? nextLocations : [createLocation({ name: card.title || 'Main wet area' })]
    patch({
      locations: safe,
      activeLocationId: preferredId || card.activeLocationId || safe[0]?.id || '',
    })
  }

  function addLocation(location) {
    syncLocations([...locations, location], location.id)
  }

  function updateLocation(location) {
    syncLocations(locations.map((item) => (item.id === location.id ? location : item)), location.id)
  }

  function deleteLocation(id) {
    if (locations.length <= 1) {
      alert('Keep at least one location so this project has an ITP set.')
      return
    }
    if (!window.confirm('Delete this location and its ITP record?')) return
    const next = locations.filter((item) => item.id !== id)
    syncLocations(next, next[0]?.id)
  }

  function selectLocation(id) {
    patch({ activeLocationId: id })
    setTab('itp')
  }

  function updateActiveItp(nextItp) {
    if (!activeLocation) return
    updateLocation({ ...activeLocation, itp: nextItp })
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__sheet" onClick={(e) => e.stopPropagation()}>
        <header className="modal__head">
          <input
            className="modal__title"
            value={card.title || ''}
            placeholder="Project / site name"
            onChange={(e) => field('title', e.target.value)}
          />
          <button className="iconbtn" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </header>

        <div className="modal__stage">
          <label className="field__label">Board stage</label>
          <select value={columnId || ''} onChange={(e) => onMove(e.target.value)} className="field">
            {columns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <nav className="tabs">
          <button className={`tabs__btn ${tab === 'job' ? 'is-active' : ''}`} onClick={() => setTab('job')}>
            Project
          </button>
          <button className={`tabs__btn ${tab === 'locations' ? 'is-active' : ''}`} onClick={() => setTab('locations')}>
            Locations <span className="tabs__badge">{locations.length}</span>
          </button>
          <button className={`tabs__btn ${tab === 'time' ? 'is-active' : ''}`} onClick={() => setTab('time')}>
            Time {onSite && <span className="tabs__dot" />}
          </button>
          <button className={`tabs__btn ${tab === 'itp' ? 'is-active' : ''}`} onClick={() => setTab('itp')}>
            ITP <span className="tabs__badge">{signed}/{total}</span>
          </button>
          <button className={`tabs__btn ${tab === 'var' ? 'is-active' : ''}`} onClick={() => setTab('var')}>
            Variations <span className="tabs__badge">{variations.length}</span>
          </button>
        </nav>

        <div className="modal__body">
          {tab === 'job' && (
            <div className="jobfields">
              <div className="helper-card">
                <strong>Project file</strong>
                <span>
                  Use this card as the overall job/site file. Add locations inside it — each location then gets its own ITP.
                </span>
              </div>

              <label className="field__label">Builder / client</label>
              <input className="field" value={card.client || ''} placeholder="Who you're working for"
                onChange={(e) => field('client', e.target.value)} />

              <label className="field__label">Client email</label>
              <input className="field" type="email" value={card.clientEmail || ''} placeholder="reports@example.com"
                onChange={(e) => field('clientEmail', e.target.value)} />

              <label className="field__label">Site address / project area</label>
              <input className="field" value={card.area || ''} placeholder="Where the job is"
                onChange={(e) => field('area', e.target.value)} />

              <div className="jobfields__row">
                <div>
                  <label className="field__label">Assigned crew / lead</label>
                  <input className="field" value={card.assignee || ''} placeholder="Worker / crew"
                    onChange={(e) => field('assignee', e.target.value)} />
                </div>
                <div>
                  <label className="field__label">Planned date</label>
                  <input className="field" type="date" value={card.scheduledDate || ''}
                    onChange={(e) => field('scheduledDate', e.target.value)} />
                </div>
                <div>
                  <label className="field__label">Time</label>
                  <input className="field" type="time" value={card.scheduledTime || ''}
                    onChange={(e) => field('scheduledTime', e.target.value)} />
                </div>
              </div>

              <label className="field__label">Project comments</label>
              <textarea className="field" rows={3} value={card.description || ''}
                placeholder="System, access, programme notes, crew comments…"
                onChange={(e) => field('description', e.target.value)} />

              <label className="field__label">Project / site photos</label>
              <PhotoStrip photos={photos} onChange={(nextPhotos) => field('photos', nextPhotos)} />

              <button className="btn btn--danger modal__delete" onClick={onDelete}>
                Delete project / site
              </button>
            </div>
          )}

          {tab === 'locations' && (
            <LocationPanel
              locations={locations}
              activeLocationId={activeLocation?.id}
              onAdd={addLocation}
              onUpdate={updateLocation}
              onDelete={deleteLocation}
              onSelect={selectLocation}
            />
          )}

          {tab === 'time' && (
            <TimePanel timeLog={timeLog} onChange={(nextTimeLog) => field('timeLog', nextTimeLog)} />
          )}

          {tab === 'itp' && activeLocation && (
            <ItpPanel
              itp={activeItp}
              location={activeLocation}
              locations={locations}
              activeLocationId={activeLocation.id}
              onSelectLocation={(id) => patch({ activeLocationId: id })}
              onChange={updateActiveItp}
              onExport={() => openItpPdf(card, { location: activeLocation, autoPrint: true })}
              onIssue={() => issueItpToClient(card, { location: activeLocation })}
            />
          )}

          {tab === 'var' && (
            <VariationsPanel
              variations={variations}
              onChange={(nextVariations) => field('variations', nextVariations)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
