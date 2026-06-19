function cardDate(card) {
  return card.scheduledDate || card.locations?.find((loc) => loc.scheduledDate)?.scheduledDate || ''
}

function cardTime(card) {
  return card.scheduledTime || card.locations?.find((loc) => loc.scheduledTime)?.scheduledTime || ''
}

function formatDate(value) {
  if (!value) return 'No date set'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function PlannerView({ cards = [], onOpenCard }) {
  const sorted = [...cards].sort((a, b) => {
    const aKey = `${cardDate(a) || '9999-99-99'} ${cardTime(a) || '99:99'}`
    const bKey = `${cardDate(b) || '9999-99-99'} ${cardTime(b) || '99:99'}`
    return aKey.localeCompare(bKey)
  })

  const groups = sorted.reduce((acc, card) => {
    const key = cardDate(card) || 'No date set'
    if (!acc[key]) acc[key] = []
    acc[key].push(card)
    return acc
  }, {})

  return (
    <section className="planner">
      <header className="planner__head">
        <div>
          <h2>Planner</h2>
          <p>Calendar-style view of scheduled and live waterproofing work.</p>
        </div>
      </header>

      <div className="planner__groups">
        {Object.entries(groups).map(([date, group]) => (
          <div className="planner-day" key={date}>
            <div className="planner-day__date">{formatDate(date === 'No date set' ? '' : date)}</div>
            <div className="planner-day__jobs">
              {group.map((card) => (
                <button className="planner-job" key={card.id} onClick={() => onOpenCard(card.id)}>
                  <span className="planner-job__time">{cardTime(card) || 'TBC'}</span>
                  <span className="planner-job__main">
                    <strong>{card.title || 'Untitled job'}</strong>
                    <small>{card.client || 'No builder/client'}{card.area ? ` · ${card.area}` : ''}</small>
                  </span>
                  {card.awaitingInspection && <span className="planner-job__tag">Awaiting inspection</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
