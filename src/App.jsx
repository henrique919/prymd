import { useEffect, useState } from 'react'
import Board from './components/Board.jsx'
import JobModal from './components/JobModal.jsx'
import { loadBoard, saveBoard, resetBoard } from './lib/storage.js'
import { newItp, itpProgress } from './data/itpTemplate.js'
import { uid } from './lib/id.js'
import { createLocation } from './lib/location.js'

const COMPLETE_COL = 'col-complete'

export default function App() {
  const [board, setBoard] = useState(loadBoard)
  const [openId, setOpenId] = useState(null)
  const [view, setView] = useState('jobboard')

  useEffect(() => {
    saveBoard(board)
  }, [board])

  const openCard = openId ? board.cards[openId] : null
  const openColumnId = openId
    ? board.columns.find((c) => c.cardIds.includes(openId))?.id
    : null

  function addCard(colId, title) {
    const id = uid('job')
    const location = createLocation({ name: 'Main location', itp: newItp() })
    const card = {
      id,
      title,
      client: '',
      clientEmail: '',
      area: '',
      assignee: '',
      scheduledDate: '',
      scheduledTime: '',
      awaitingInspection: false,
      completedAt: '',
      description: '',
      photos: [],
      locations: [location],
      activeLocationId: location.id,
      // Kept for backwards compatibility with older saved demo data.
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
    if (!window.confirm('Delete this project/site and its location ITPs? This cannot be undone.')) return
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

  function allLocationItpsComplete(card) {
    const locations = Array.isArray(card.locations) && card.locations.length
      ? card.locations
      : [{ itp: card.itp }]
    return locations.every((loc) => itpProgress(loc.itp).complete)
  }

  function moveCard(cardId, fromCol, toCol) {
    if (fromCol === toCol) return
    // Guard: don't let a project slip into "Complete" with unfinished location ITPs.
    if (toCol === COMPLETE_COL) {
      const card = board.cards[cardId]
      if (!allLocationItpsComplete(card)) {
        const ok = window.confirm(
          `Not every location ITP is complete for this project/site.\n\n` +
            'Move it to Complete anyway?'
        )
        if (!ok) return
      }
    }
    setBoard((b) => ({
      ...b,
      cards: {
        ...b.cards,
        [cardId]: {
          ...b.cards[cardId],
          completedAt: toCol === COMPLETE_COL ? (b.cards[cardId].completedAt || new Date().toISOString()) : '',
        },
      },
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
    if (!window.confirm('Reset back to the demo board? Your current projects will be cleared.')) return
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
            <span className="brand__tag">Waterproofing projects, locations, ITPs &amp; variations — from site</span>
          </div>
        </div>
        <button className="topbar__reset" onClick={reset}>Reset demo</button>
      </header>

      <nav className="workspace-tabs" aria-label="Prymd planner views">
        <button className={view === 'planner' ? 'is-active' : ''} onClick={() => setView('planner')}>Planner</button>
        <button className={view === 'scheduled' ? 'is-active' : ''} onClick={() => setView('scheduled')}>Scheduled jobs</button>
        <button className={view === 'progress' ? 'is-active' : ''} onClick={() => setView('progress')}>In Progress</button>
        <button className={view === 'jobboard' ? 'is-active' : ''} onClick={() => setView('jobboard')}>Jobboard</button>
        <button className={view === 'completed' ? 'is-active' : ''} onClick={() => setView('completed')}>Completed folder</button>
      </nav>

      <main>
        <Board
          board={board}
          view={view}
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
