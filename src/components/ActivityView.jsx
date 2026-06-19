// One feed of everything happening across every job — the "what's the crew up
// to, where and when" view. Tap an item to jump to that job.

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.round(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.round(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(ts).toLocaleDateString()
}

function initials(name) {
  if (!name) return '·'
  return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

export default function ActivityView({ board, onOpenCard }) {
  const items = []
  Object.values(board.cards).forEach((card) => {
    ;(card.activity || []).forEach((a) => {
      items.push({ ...a, cardId: card.id, cardTitle: card.title || 'Untitled job' })
    })
  })
  items.sort((a, b) => new Date(b.ts) - new Date(a.ts))

  return (
    <div className="view">
      <h2 className="view__title">Activity</h2>
      {items.length === 0 && <div className="view__hint">Nothing yet. As the crew works, updates land here.</div>}
      <div className="feed">
        {items.map((a) => (
          <button key={a.id} className="actrow" onClick={() => onOpenCard(a.cardId)}>
            <div className={`avatar ${a.type === 'event' ? 'avatar--event' : ''}`}>{initials(a.author)}</div>
            <div className="actrow__body">
              <div className="actrow__text">
                {a.author && a.author !== 'System' && <strong>{a.author} </strong>}
                {a.type === 'comment' ? <>commented: “{a.text}”</> : a.text}
              </div>
              <div className="actrow__meta">
                {a.cardTitle} · {timeAgo(a.ts)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
