import { useState } from 'react'
import PhotoStrip from './PhotoStrip.jsx'
import ItpPanel from './ItpPanel.jsx'
import VariationsPanel from './VariationsPanel.jsx'
import ActivityPanel from './ActivityPanel.jsx'
import LabelPicker from './LabelPicker.jsx'
import { itpProgress } from '../data/itpTemplate.js'
import { CloseIcon } from './Icons.jsx'

export default function JobModal({ card, columns, columnId, onChange, onMove, onClose, onDelete, onLog, me }) {
  const [tab, setTab] = useState('job')
  const { signed, total } = itpProgress(card.itp)
  const commentCount = (card.activity || []).filter((a) => a.type === 'comment').length

  function field(key, value) {
    onChange({ ...card, [key]: value })
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__sheet" onClick={(e) => e.stopPropagation()}>
        <header className="modal__head">
          <input
            className="modal__title"
            value={card.title}
            placeholder="Job name"
            onChange={(e) => field('title', e.target.value)}
          />
          <button className="iconbtn" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </header>

        <div className="modal__stage">
          <label className="field__label">Stage</label>
          <select value={columnId} onChange={(e) => onMove(e.target.value)} className="field">
            {columns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <nav className="tabs">
          <button className={`tabs__btn ${tab === 'job' ? 'is-active' : ''}`} onClick={() => setTab('job')}>
            Details
          </button>
          <button className={`tabs__btn ${tab === 'itp' ? 'is-active' : ''}`} onClick={() => setTab('itp')}>
            ITP <span className="tabs__badge">{signed}/{total}</span>
          </button>
          <button className={`tabs__btn ${tab === 'var' ? 'is-active' : ''}`} onClick={() => setTab('var')}>
            Variations <span className="tabs__badge">{card.variations.length}</span>
          </button>
          <button className={`tabs__btn ${tab === 'act' ? 'is-active' : ''}`} onClick={() => setTab('act')}>
            Activity <span className="tabs__badge">{commentCount}</span>
          </button>
        </nav>

        <div className="modal__body">
          {tab === 'job' && (
            <div className="jobfields">
              <label className="field__label">Labels</label>
              <LabelPicker selected={card.labels || []} onChange={(labels) => field('labels', labels)} />

              <label className="field__label">Builder / client</label>
              <input className="field" value={card.client} placeholder="Who you're working for"
                onChange={(e) => field('client', e.target.value)} />

              <label className="field__label">Site address / area</label>
              <input className="field" value={card.area} placeholder="Where the job is"
                onChange={(e) => field('area', e.target.value)} />

              <div className="jobfields__row">
                <div>
                  <label className="field__label">Assigned to</label>
                  <input className="field" value={card.assignee} placeholder="Worker"
                    onChange={(e) => field('assignee', e.target.value)} />
                </div>
                <div>
                  <label className="field__label">Date</label>
                  <input className="field" type="date" value={card.scheduledDate}
                    onChange={(e) => field('scheduledDate', e.target.value)} />
                </div>
              </div>

              <label className="field__label">Notes</label>
              <textarea className="field" rows={3} value={card.description}
                placeholder="System, coats, anything the crew needs to know"
                onChange={(e) => field('description', e.target.value)} />

              <label className="field__label">Site photos</label>
              <PhotoStrip photos={card.photos} onChange={(photos) => field('photos', photos)} />

              <button className="btn btn--danger modal__delete" onClick={onDelete}>
                Delete job
              </button>
            </div>
          )}

          {tab === 'itp' && (
            <ItpPanel itp={card.itp} onChange={(itp) => field('itp', itp)} onLog={onLog} me={me} />
          )}

          {tab === 'var' && (
            <VariationsPanel
              variations={card.variations}
              onChange={(variations) => field('variations', variations)}
              onLog={onLog}
              me={me}
            />
          )}

          {tab === 'act' && (
            <ActivityPanel
              activity={card.activity || []}
              onComment={(text) => onLog && onLog({ type: 'comment', author: me, text })}
            />
          )}
        </div>
      </div>
    </div>
  )
}
