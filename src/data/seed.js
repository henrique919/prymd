import { uid } from '../lib/id.js'
import { newItp } from './itpTemplate.js'

// Default columns map to "where a job is up to" — the thing James tracks in
// Trello today. Workers move a job along as it progresses.
export function seedBoard() {
  const demoId = uid('job')
  const now = Date.now()
  return {
    columns: [
      { id: 'col-scheduled', title: 'Scheduled', cardIds: [demoId] },
      { id: 'col-onsite', title: 'On site', cardIds: [] },
      { id: 'col-inspection', title: 'Awaiting inspection', cardIds: [] },
      { id: 'col-complete', title: 'Complete', cardIds: [] },
    ],
    cards: {
      [demoId]: {
        id: demoId,
        title: 'Unit 4 — main bathroom',
        client: 'Hartley Builders',
        area: '12 Marine Pde, Southport',
        assignee: 'Dave',
        scheduledDate: '',
        description:
          'Internal wet area, shower + floor. Hobless. Two coats Ardex WPM.',
        labels: ['domestic', 'urgent'],
        photos: [],
        itp: newItp(),
        variations: [],
        activity: [
          { id: uid('act'), type: 'event', author: 'System', text: 'Job created', ts: new Date(now - 7200000).toISOString() },
          { id: uid('act'), type: 'comment', author: 'Dave', text: 'Builder reckons substrate will be ready Thursday — bring the primer.', ts: new Date(now - 3600000).toISOString() },
        ],
        createdAt: new Date(now - 7200000).toISOString(),
      },
    },
  }
}
