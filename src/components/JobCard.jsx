import { itpProgress } from '../data/itpTemplate.js'
import { labelById } from '../data/labels.js'
import { PhotoIcon, DocIcon, CommentIcon } from './Icons.jsx'

export default function JobCard({ card, onOpen, onDragStart }) {
  const { signed, total, complete } = itpProgress(card.itp)
  const variationTotal = card.variations.reduce((s, v) => s + (Number(v.cost) || 0), 0)
  const labels = (card.labels || []).map(labelById).filter(Boolean)
  const commentCount = (card.activity || []).filter((a) => a.type === 'comment').length

  return (
    <article
      className={`jobcard ${complete ? 'jobcard--primed' : ''}`}
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
    >
      {labels.length > 0 && (
        <div className="jobcard__labels">
          {labels.map((l) => (
            <span key={l.id} className="labelbar" style={{ background: l.color }} title={l.name} />
          ))}
        </div>
      )}

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
        {card.scheduledDate && (
          <span className="badge">
            {new Date(card.scheduledDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
          </span>
        )}
        {commentCount > 0 && (
          <span className="badge"><CommentIcon /> {commentCount}</span>
        )}
        {card.photos.length > 0 && (
          <span className="badge"><PhotoIcon /> {card.photos.length}</span>
        )}
        {card.variations.length > 0 && (
          <span className="badge"><DocIcon /> {card.variations.length}</span>
        )}
        <span className="jobcard__spacer" />
        {card.assignee && <span className="avatar avatar--sm" title={card.assignee}>{card.assignee.trim().slice(0, 2).toUpperCase()}</span>}
      </div>

      {variationTotal > 0 && (
        <div className="jobcard__var">
          +{variationTotal.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })} variations
        </div>
      )}
    </article>
  )
}
