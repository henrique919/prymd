import { useState } from 'react'
import JobCard from './JobCard.jsx'
import { PlusIcon } from './Icons.jsx'

export default function Column({ column, cards, onOpenCard, onAddCard, onDropCard, onDragStartCard }) {
  const [over, setOver] = useState(false)
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')

  function submit() {
    const t = title.trim()
    if (!t) {
      setAdding(false)
      return
    }
    onAddCard(column.id, t)
    setTitle('')
    setAdding(false)
  }

  return (
    <section
      className={`column ${over ? 'column--over' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        onDropCard(column.id)
      }}
    >
      <header className="column__head">
        <span className="column__title">{column.title}</span>
        <span className="column__count">{column.cardIds.length}</span>
      </header>

      <div className="column__cards">
        {cards.map((card) => (
          <JobCard
            key={card.id}
            card={card}
            onOpen={() => onOpenCard(card.id)}
            onDragStart={() => onDragStartCard(card.id, column.id)}
          />
        ))}

        {adding ? (
          <div className="addcard">
            <textarea
              autoFocus
              className="field"
              rows={2}
              placeholder="Job name — e.g. Unit 7 ensuite"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  submit()
                }
              }}
            />
            <div className="addcard__actions">
              <button className="btn btn--ghost" onClick={() => setAdding(false)}>Cancel</button>
              <button className="btn btn--primary" onClick={submit}>Add job</button>
            </div>
          </div>
        ) : (
          <button className="column__add" onClick={() => setAdding(true)}>
            <PlusIcon /> Add job
          </button>
        )}
      </div>
    </section>
  )
}
