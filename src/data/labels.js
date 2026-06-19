// Trello-style labels, tailored to a waterproofing business. Colored bars on
// the card front; toggle them in the job's Labels picker.
export const LABELS = [
  { id: 'urgent', name: 'Urgent', color: '#d1495b' },
  { id: 'domestic', name: 'Domestic', color: '#2e9e6b' },
  { id: 'commercial', name: 'Commercial', color: '#11606b' },
  { id: 'external', name: 'External', color: '#e0a03a' },
  { id: 'warranty', name: 'Warranty / callback', color: '#8a4fb3' },
  { id: 'awaiting', name: 'Awaiting other trade', color: '#5e6e6c' },
]

export function labelById(id) {
  return LABELS.find((l) => l.id === id) || null
}
