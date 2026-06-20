import { useState } from 'react'
import Column from './Column.jsx'

export default function Board({ board, onOpenCard, onAddCard, onMoveCard }) {
  // Tracks which card is being dragged (desktop). Touch users move a job by
  // opening it and changing its stage in the modal, which is more reliable.
  const [drag, setDrag] = useState(null) // { cardId, fromCol }

  function handleDrop(toCol) {
    if (!drag) return
    if (drag.fromCol !== toCol) onMoveCard(drag.cardId, drag.fromCol, toCol)
    setDrag(null)
  }

  return (
    <div className="board">
      {board.columns.map((col) => (
        <Column
          key={col.id}
          column={col}
          cards={col.cardIds.map((id) => board.cards[id]).filter(Boolean)}
          onOpenCard={onOpenCard}
          onAddCard={onAddCard}
          onDragStartCard={(cardId, fromCol) => setDrag({ cardId, fromCol })}
          onDropCard={handleDrop}
        />
      ))}
    </div>
  )
}
