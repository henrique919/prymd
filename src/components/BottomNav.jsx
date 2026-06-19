import { BoardIcon, SearchIcon, BellIcon, MenuIcon, PlusIcon } from './Icons.jsx'

export default function BottomNav({ view, onNav, onAdd }) {
  const tab = (id, label, Icon) => (
    <button className={`nav__btn ${view === id ? 'is-active' : ''}`} onClick={() => onNav(id)}>
      <Icon />
      <span>{label}</span>
    </button>
  )

  return (
    <nav className="nav">
      {tab('board', 'Board', BoardIcon)}
      {tab('search', 'Search', SearchIcon)}
      <button className="nav__add" onClick={onAdd} aria-label="Add job">
        <PlusIcon />
      </button>
      {tab('activity', 'Activity', BellIcon)}
      {tab('menu', 'Menu', MenuIcon)}
    </nav>
  )
}
