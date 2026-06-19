import { useState } from 'react'
import Column from './Column.jsx'
import PlannerView from './PlannerView.jsx'

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000

function isArchivedCompleted(card) {
  if (!card?.completedAt) return false
  const completed = new Date(card.completedAt).getTime()
  return Number.isFinite(completed) && Date.now() - completed > TWO_WEEKS_MS
}

export default function Board({ board, view = 'jobboard', onOpenCard, onAddCard, onMoveCard }) {
  // Tracks which card is being dragged (desktop). Touch users move a job by
  // opening it and changing its stage in the modal, which is more reliable.
  const [drag, setDrag] = useState(null) // { cardId, fromCol }

  function handleDrop(toCol) {
    if (!drag) return
    if (drag.fromCol !== toCol) onMoveCard(drag.cardId, drag.fromCol, toCol)
    setDrag(null)
  }

  const allCards = Object.values(board.cards || {})
  const scheduledCards = board.columns.find((c) => c.id === 'col-scheduled')?.cardIds.map((id) => board.cards[id]).filter(Boolean) || []
  const progressCards = board.columns.find((c) => c.id === 'col-in-progress')?.cardIds.map((id) => board.cards[id]).filter(Boolean) || []
  const completedCards = board.columns.find((c) => c.id === 'col-complete')?.cardIds.map((id) => board.cards[id]).filter(Boolean) || []
  const recentCompleted = completedCards.filter((card) => !isArchivedCompleted(card))
  const archivedCompleted = completedCards.filter(isArchivedCompleted)

  if (view === 'planner') {
    return <PlannerView cards={[...scheduledCards, ...progressCards]} onOpenCard={onOpenCard} />
  }

  let visibleColumns = board.columns
  if (view === 'scheduled') visibleColumns = board.columns.filter((col) => col.id === 'col-scheduled')
  if (view === 'progress') visibleColumns = board.columns.filter((col) => col.id === 'col-in-progress')
  if (view === 'completed') {
    return (
      <div className="completed-folder">
        <header className="completed-folder__head">
          <div>
            <h2>Completed Job Folder</h2>
            <p>Completed jobs automatically move here after roughly two weeks.</p>
          </div>
          <span>{archivedCompleted.length} archived</span>
        </header>
        <div className="completed-folder__grid">
          {archivedCompleted.length === 0 && <div className="empty-board">No archived completed jobs yet.</div>}
          {archivedCompleted.map((card) => (
            <button key={card.id} className="archive-card" onClick={() => onOpenCard(card.id)}>
              <strong>{card.title}</strong>
              <span>{card.client || 'No builder/client'}</span>
              <small>Completed {new Date(card.completedAt).toLocaleDateString('en-AU')}</small>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="board-shell">
      {view === 'jobboard' && (
        <div className="board-summary">
          <div><strong>{allCards.length}</strong><span>Total jobs</span></div>
          <div><strong>{scheduledCards.length}</strong><span>Scheduled</span></div>
          <div><strong>{progressCards.length}</strong><span>In progress</span></div>
          <div><strong>{recentCompleted.length}</strong><span>Recently completed</span></div>
        </div>
      )}
      <div className="board">
        {visibleColumns.map((col) => {
          const cards = col.cardIds.map((id) => board.cards[id]).filter(Boolean)
          const filteredCards = col.id === 'col-complete' ? cards.filter((card) => !isArchivedCompleted(card)) : cards
          return (
            <Column
              key={col.id}
              column={col}
              cards={filteredCards}
              onOpenCard={onOpenCard}
              onAddCard={onAddCard}
              onDragStartCard={(cardId, fromCol) => setDrag({ cardId, fromCol })}
              onDropCard={handleDrop}
            />
          )
        })}
      </div>
    </div>
  )
}
