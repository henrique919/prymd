import { uid } from '../lib/id.js'
import { newItp } from './itpTemplate.js'
import { createLocation } from '../lib/location.js'

// Default columns map to "where a project/site is up to" — the thing James tracks
// in Trello today. Each card is the overall job/site file; locations inside the
// card each carry their own ITP.
export function seedBoard() {
  const demoId = uid('job')
  const location = createLocation({
    building: 'Building 1',
    level: 'Level 1',
    unit: 'Unit 105',
    areaName: 'Bathroom',
    scheduledDate: '',
    scheduledTime: '',
    assignee: 'Dave',
    comments: 'Internal wet area, hobless shower. Complete substrate check before primer.',
    itp: newItp(),
  })

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
        title: 'Marine Parade Apartments',
        client: 'Hartley Builders',
        clientEmail: '',
        area: '12 Marine Pde, Southport',
        assignee: 'Dave',
        scheduledDate: '',
        scheduledTime: '',
        description:
          'Waterproofing project file. Add each bathroom, balcony, podium zone or tanking wall as a separate location with its own ITP.',
        photos: [],
        locations: [location],
        activeLocationId: location.id,
        itp: newItp(),
        variations: [],
        timeLog: [],
        createdAt: new Date().toISOString(),
      },
    },
  }
}
