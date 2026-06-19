import { useState } from 'react'
import PhotoStrip from './PhotoStrip.jsx'
import ItpPanel from './ItpPanel.jsx'
import VariationsPanel from './VariationsPanel.jsx'
import TimePanel from './TimePanel.jsx'
import { itpProgress } from '../data/itpTemplate.js'
import { CloseIcon } from './Icons.jsx'

export default function JobModal({ card, columns, columnId, onChange, onMove, onClose, onDelete }) {
  const [tab, setTab] = useState('job')
  const itp = Array.isArray(card.itp) ? card.itp : []
  const photos = Array.isArray(card.photos) ? card.photos : []
  const variations = Array.isArray(card.variations) ? card.variations : []
  const timeLog = Array.isArray(card.timeLog) ? card.timeLog : []
  const { signed, total, complete } = itpProgress(itp)
  const onSite = timeLog.find((e) => e && !e.checkOutAt)

  function field(key, value) {
    onChange({ ...card, [key]: value })
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__sheet" onClick={(e) => e.stopPropagation()}>
        <header className="modal__head">
          <input
            className="modal__title"
            value={card.title || ''}
            placeholder="Job name"
            onChange={(e) => field('title', e.target.value)}
          />
          <button className="iconbtn" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </header>

        <div className="modal__stage">
          <label className="field__label">Stage</label>
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
            Job
          </button>
          <button className={`tabs__btn ${tab === 'time' ? 'is-active' : ''}`} onClick={() => setTab('time')}>
            Time {onSite && <span className="tabs__dot" />}
          </button>
          <button className={`tabs__btn ${tab === 'itp' ? 'is-active' : ''}`} onClick={() => setTab('itp')}>
            ITP <span className="tabs__badge">{signed}/{total}</span>
            {complete && <span className="tabs__ready">PDF</span>}
          </button>
          <button className={`tabs__btn ${tab === 'var' ? 'is-active' : ''}`} onClick={() => setTab('var')}>
            Variations <span className="tabs__badge">{variations.length}</span>
          </button>
        </nav>

        <div className="modal__body">
          {tab === 'job' && (
            <div className="jobfields">
              <label className="field__label">Builder / client</label>
              <input className="field" value={card.client || ''} placeholder="Who you're working for"
                onChange={(e) => field('client', e.target.value)} />

              <label className="field__label">Client email for issuing report</label>
              <input className="field" type="email" value={card.clientEmail || ''} placeholder="client@example.com"
                onChange={(e) => field('clientEmail', e.target.value)} />

              <label className="field__label">Site address / area</label>
              <input className="field" value={card.area || ''} placeholder="Where the job is"
                onChange={(e) => field('area', e.target.value)} />

              <div className="jobfields__row">
                <div>
                  <label className="field__label">Assigned to</label>
                  <input className="field" value={card.assignee || ''} placeholder="Worker"
                    onChange={(e) => field('assignee', e.target.value)} />
                </div>
                <div>
                  <label className="field__label">Date</label>
                  <input className="field" type="date" value={card.scheduledDate || ''}
                    onChange={(e) => field('scheduledDate', e.target.value)} />
                </div>
              </div>

              <label className="field__label">Notes</label>
              <textarea className="field" rows={3} value={card.description || ''}
                placeholder="System, coats, anything the crew needs to know"
                onChange={(e) => field('description', e.target.value)} />

              <label className="field__label">Site photos</label>
              <PhotoStrip photos={photos} onChange={(nextPhotos) => field('photos', nextPhotos)} />

              <button className="btn btn--danger modal__delete" onClick={onDelete}>
                Delete job
              </button>
            </div>
          )}

          {tab === 'time' && (
            <TimePanel timeLog={timeLog} onChange={(nextTimeLog) => field('timeLog', nextTimeLog)} />
          )}

          {tab === 'itp' && (
            <ItpPanel card={card} itp={itp} onChange={(nextItp) => field('itp', nextItp)} />
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
