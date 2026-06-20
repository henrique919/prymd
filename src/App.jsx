import { useEffect, useState } from 'react'
import Board from './components/Board.jsx'
import JobModal from './components/JobModal.jsx'
import BottomNav from './components/BottomNav.jsx'
import Logo from './components/Logo.jsx'
import SearchView from './components/SearchView.jsx'
import ActivityView from './components/ActivityView.jsx'
import MenuView from './components/MenuView.jsx'
import { loadBoard, saveBoard, resetBoard } from './lib/storage.js'
import { newItp, itpProgress } from './data/itpTemplate.js'
import { getUser, setUser, ensureUser } from './lib/user.js'
import { uid } from './lib/id.js'

const COMPLETE_COL = 'col-complete'

export default function App() {
  const [board, setBoard] = useState(loadBoard)
  const [openId, setOpenId] = useState(null)
  const [view, setView] = useState('board')
  const [me, setMe] = useState(getUser())

  useEffect(() => {
    saveBoard(board)
  }, [board])

  const openCard = openId ? board.cards[openId] : null
  const openColumnId = openId
    ? board.columns.find((c) => c.cardIds.includes(openId))?.id
    : null

  // --- activity logging ---
  function logToCard(cardId, entry) {
    setBoard((b) => {
      const card = b.cards[cardId]
      if (!card) return b
      const item = {
        id: uid('act'),
        ts: new Date().toISOString(),
        author: entry.author || 'System',
        type: entry.type || 'event',
        text: entry.text || '',
      }
      return { ...b, cards: { ...b.cards, [cardId]: { ...card, activity: [...(card.activity || []), item] } } }
    })
  }

  // Logger bound to the open card; ensures we have a name for comments/variations.
  function logOpen(entry) {
    let author = entry.author
    if (!author) {
      author = me || ensureUser()
      if (author && author !== me) setMe(author)
    }
    if (openId) logToCard(openId, { ...entry, author: author || 'System' })
  }

  // --- cards ---
  function createCard(colId, title) {
    const id = uid('job')
    const card = {
      id,
      title,
      client: '',
      area: '',
      assignee: me || '',
      scheduledDate: '',
      description: '',
      labels: [],
      photos: [],
      itp: newItp(),
      variations: [],
      activity: [
        { id: uid('act'), ts: new Date().toISOString(), author: me || 'System', type: 'event', text: 'Job created' },
      ],
      createdAt: new Date().toISOString(),
    }
    setBoard((b) => ({
      ...b,
      cards: { ...b.cards, [id]: card },
      columns: b.columns.map((c) => (c.id === colId ? { ...c, cardIds: [...c.cardIds, id] } : c)),
    }))
    return id
  }

  function addCard(colId, title) {
    createCard(colId, title)
  }

  function quickAdd() {
    const firstCol = board.columns[0]
    const id = createCard(firstCol.id, 'New job')
    setView('board')
    setOpenId(id)
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
        columns: b.columns.map((c) => ({ ...c, cardIds: c.cardIds.filter((cid) => cid !== id) })),
      }
    })
    setOpenId(null)
  }

  function moveCard(cardId, fromCol, toCol) {
    if (fromCol === toCol) return
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
    const toTitle = board.columns.find((c) => c.id === toCol)?.title || 'a new stage'
    setBoard((b) => ({
      ...b,
      columns: b.columns.map((c) => {
        if (c.id === fromCol) return { ...c, cardIds: c.cardIds.filter((id) => id !== cardId) }
        if (c.id === toCol) return { ...c, cardIds: [...c.cardIds, cardId] }
        return c
      }),
    }))
    logToCard(cardId, { author: me || 'System', type: 'event', text: `moved to ${toTitle}` })
  }

  function moveOpenCardTo(toCol) {
    if (openId && openColumnId) moveCard(openId, openColumnId, toCol)
  }

  function saveMe(name) {
    setUser(name)
    setMe(name)
  }

  function reset() {
    if (!window.confirm('Reset back to the demo board? Your current jobs will be cleared.')) return
    resetBoard()
    setBoard(loadBoard())
    setOpenId(null)
    setView('board')
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brandwrap">
          <span className="brand__logo"><Logo /></span>
          <div className="brand">
            <span className="brand__mark">Tanqo</span>
            <span className="brand__tag">Waterproofing ITPs, photos &amp; variations — from site</span>
          </div>
        </div>
        {me && <span className="topbar__me" title="You">{me.trim().slice(0, 2).toUpperCase()}</span>}
      </header>

      <main className="main">
        {view === 'board' && (
          <Board board={board} onOpenCard={setOpenId} onAddCard={addCard} onMoveCard={moveCard} />
        )}
        {view === 'search' && <SearchView board={board} onOpenCard={setOpenId} />}
        {view === 'activity' && <ActivityView board={board} onOpenCard={setOpenId} />}
        {view === 'menu' && <MenuView me={me} onSetMe={saveMe} onReset={reset} />}
      </main>

      <BottomNav view={view} onNav={setView} onAdd={quickAdd} />

      {openCard && (
        <JobModal
          card={openCard}
          columns={board.columns}
          columnId={openColumnId}
          onChange={updateCard}
          onMove={moveOpenCardTo}
          onClose={() => setOpenId(null)}
          onDelete={() => deleteCard(openCard.id)}
          onLog={logOpen}
          me={me}
        />
      )}
    </div>
  )
}
