import { itpProgress } from '../data/itpTemplate.js'
import { PhotoIcon, DocIcon } from './Icons.jsx'

export default function JobCard({ card, onOpen, onDragStart }) {
  const { signed, total, complete } = itpProgress(card.itp)
  const variationTotal = card.variations.reduce((s, v) => s + (Number(v.cost) || 0), 0)

  return (
    <article
      className={`jobcard ${complete ? 'jobcard--primed' : ''}`}
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
    >
      <div className="jobcard__title">{card.title || 'Untitled job'}</div>

      {(card.client || card.area) && (
        <div className="jobcard__meta">
          {card.client}
          {card.client && card.area ? ' · ' : ''}
          {card.area}
        </div>
      )}

      {/* ITP "primer coat" — fills as hold points are signed */}
      <div className="jobcard__pips" title={`ITP ${signed}/${total} signed`}>
        {card.itp.map((hp) => (
          <span
            key={hp.key}
            className={`pip ${hp.signedAt && hp.result !== 'pending' ? `pip--${hp.result}` : ''}`}
          />
        ))}
        <span className="jobcard__pipslabel">
          {complete ? 'Primed' : `ITP ${signed}/${total}`}
        </span>
      </div>

      <div className="jobcard__foot">
        {card.assignee && <span className="tag">{card.assignee}</span>}
        {card.scheduledDate && (
          <span className="jobcard__date">
            {new Date(card.scheduledDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
          </span>
        )}
        <span className="jobcard__spacer" />
        {card.photos.length > 0 && (
          <span className="jobcard__stat"><PhotoIcon /> {card.photos.length}</span>
        )}
        {card.variations.length > 0 && (
          <span className="jobcard__stat"><DocIcon /> {card.variations.length}</span>
        )}
      </div>

      {variationTotal > 0 && (
        <div className="jobcard__var">
          +{variationTotal.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })} variations
        </div>
      )}
    </article>
  )
}
