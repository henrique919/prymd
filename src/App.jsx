import { useEffect, useState } from 'react'
import Board from './components/Board.jsx'
import JobModal from './components/JobModal.jsx'
import { loadBoard, saveBoard, resetBoard } from './lib/storage.js'
import { newItp, itpProgress } from './data/itpTemplate.js'
import { uid } from './lib/id.js'

const COMPLETE_COL = 'col-complete'

export default function App() {
  const [board, setBoard] = useState(loadBoard)
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    saveBoard(board)
  }, [board])

  const openCard = openId ? board.cards[openId] : null
  const openColumnId = openId
    ? board.columns.find((c) => c.cardIds.includes(openId))?.id
    : null

  function addCard(colId, title) {
    const id = uid('job')
    const card = {
      id,
      title,
      client: '',
      clientEmail: '',
      area: '',
      assignee: '',
      scheduledDate: '',
      description: '',
      photos: [],
      itp: newItp(),
      variations: [],
      timeLog: [],
      createdAt: new Date().toISOString(),
    }
    setBoard((b) => ({
      ...b,
      cards: { ...b.cards, [id]: card },
      columns: b.columns.map((c) =>
        c.id === colId ? { ...c, cardIds: [...c.cardIds, id] } : c
      ),
    }))
  }

  function updateCard(card) {
    setBoard((b) => ({ ...b, cards: { ...b.cards, [card.id]: card } }))
  }

  function deleteCard(id) {
    if (!window.confirm('Delete this job and its ITP? This cannot be undone.')) return
    setBoard((b) => {
      const cards = { ...b.cards }
      delete cards[id]
      return {
        ...b,
        cards,
        columns: b.columns.map((c) => ({
          ...c,
          cardIds: c.cardIds.filter((cid) => cid !== id),
        })),
      }
    })
    setOpenId(null)
  }

  function moveCard(cardId, fromCol, toCol) {
    if (fromCol === toCol) return
    // Guard: don't let a job slip into "Complete" with an unfinished ITP.
    if (toCol === COMPLETE_COL) {
      const { complete, signed, total } = itpProgress(board.cards[cardId].itp)
      if (!complete) {
        const ok = window.confirm(
          `This job's ITP isn't finished — ${signed} of ${total} hold points signed.\n\n` +
            'Move it to Complete anyway?'
        )
        if (!ok) return
      }
    }
    setBoard((b) => ({
      ...b,
      columns: b.columns.map((c) => {
        if (c.id === fromCol) return { ...c, cardIds: c.cardIds.filter((id) => id !== cardId) }
        if (c.id === toCol) return { ...c, cardIds: [...c.cardIds, cardId] }
        return c
      }),
    }))
  }

  function moveOpenCardTo(toCol) {
    if (openId && openColumnId) moveCard(openId, openColumnId, toCol)
  }

  function reset() {
    if (!window.confirm('Reset back to the demo board? Your current jobs will be cleared.')) return
    resetBoard()
    setBoard(loadBoard())
    setOpenId(null)
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <img className="brand__logo" src="/icon.svg" alt="" />
          <div className="brand__text">
            <span className="brand__mark">Prymd</span>
            <span className="brand__tag">Waterproofing ITPs, photos, reports &amp; variations — from site</span>
          </div>
        </div>
        <button className="topbar__reset" onClick={reset}>Reset demo</button>
      </header>

      <main>
        <Board
          board={board}
          onOpenCard={setOpenId}
          onAddCard={addCard}
          onMoveCard={moveCard}
        />
      </main>

      {openCard && (
        <JobModal
          card={openCard}
          columns={board.columns}
          columnId={openColumnId}
          onChange={updateCard}
          onMove={moveOpenCardTo}
          onClose={() => setOpenId(null)}
          onDelete={() => deleteCard(openCard.id)}
        />
      )}
    </div>
  )
}
