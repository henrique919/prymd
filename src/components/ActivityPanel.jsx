import { useState } from 'react'
import { SendIcon } from './Icons.jsx'

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
  if (!name) return '?'
  return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

export default function ActivityPanel({ activity = [], onComment }) {
  const [text, setText] = useState('')

  function send() {
    const t = text.trim()
    if (!t) return
    onComment(t)
    setText('')
  }

  const feed = [...activity].sort((a, b) => new Date(b.ts) - new Date(a.ts))

  return (
    <div className="activity">
      <div className="composer">
        <textarea
          className="field"
          rows={2}
          placeholder="Add a comment — what's happening on site?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              send()
            }
          }}
        />
        <button className="composer__send" onClick={send} aria-label="Post comment" disabled={!text.trim()}>
          <SendIcon />
        </button>
      </div>

      <div className="feed">
        {feed.length === 0 && <div className="feed__empty">No activity yet. Comments and updates show up here.</div>}
        {feed.map((a) =>
          a.type === 'comment' ? (
            <div key={a.id} className="feeditem feeditem--comment">
              <div className="avatar">{initials(a.author)}</div>
              <div className="bubble">
                <div className="bubble__head">
                  <strong>{a.author || 'Someone'}</strong>
                  <span className="bubble__time">{timeAgo(a.ts)}</span>
                </div>
                <div className="bubble__text">{a.text}</div>
              </div>
            </div>
          ) : (
            <div key={a.id} className="feeditem feeditem--event">
              <span className="feeditem__dot" />
              <span className="feeditem__text">
                <strong>{a.author && a.author !== 'System' ? a.author : ''}</strong> {a.text}
                <span className="feeditem__time"> · {timeAgo(a.ts)}</span>
              </span>
            </div>
          )
        )}
      </div>
    </div>
  )
}
