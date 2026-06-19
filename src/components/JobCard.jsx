import { itpProgress } from '../data/itpTemplate.js'
import { PhotoIcon, DocIcon } from './Icons.jsx'

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
}

export default function JobCard({ card, onOpen, onDragStart }) {
  const itp = Array.isArray(card.itp) ? card.itp : []
  const photos = Array.isArray(card.photos) ? card.photos : []
  const variations = Array.isArray(card.variations) ? card.variations : []
  const timeLog = Array.isArray(card.timeLog) ? card.timeLog : []
  const { signed, total, complete } = itpProgress(itp)
  const variationTotal = variations.reduce((s, v) => s + (Number(v.cost) || 0), 0)
  const scheduledDate = formatDate(card.scheduledDate)
  const onSite = timeLog.find((e) => e && !e.checkOutAt)

  return (
    <article
      className={`jobcard ${complete ? 'jobcard--primed' : ''}`}
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
    >
      <div className="jobcard__titlerow">
        <div className="jobcard__title">{card.title || 'Untitled job'}</div>
        {onSite && (
          <span className="jobcard__onsite">
            <span className="jobcard__onsitedot" /> {onSite.worker}
          </span>
        )}
      </div>

      {(card.client || card.area) && (
        <div className="jobcard__meta">
          {card.client}
          {card.client && card.area ? ' · ' : ''}
          {card.area}
        </div>
      )}

      {/* ITP "primer coat" — fills as hold points are signed */}
      <div className="jobcard__pips" title={`ITP ${signed}/${total} signed`}>
        {itp.map((hp) => (
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
        {scheduledDate && (
          <span className="jobcard__date">
            {scheduledDate}
          </span>
        )}
        <span className="jobcard__spacer" />
        {photos.length > 0 && (
          <span className="jobcard__stat"><PhotoIcon /> {photos.length}</span>
        )}
        {variations.length > 0 && (
          <span className="jobcard__stat"><DocIcon /> {variations.length}</span>
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
