import { LABELS } from '../data/labels.js'

export default function LabelPicker({ selected = [], onChange }) {
  function toggle(id) {
    if (selected.includes(id)) onChange(selected.filter((x) => x !== id))
    else onChange([...selected, id])
  }
  return (
    <div className="labelpicker">
      {LABELS.map((l) => {
        const on = selected.includes(l.id)
        return (
          <button
            key={l.id}
            className={`labelchip ${on ? 'labelchip--on' : ''}`}
            style={on ? { background: l.color, borderColor: l.color, color: '#fff' } : { borderColor: l.color, color: l.color }}
            onClick={() => toggle(l.id)}
          >
            {l.name}
          </button>
        )
      })}
    </div>
  )
}
