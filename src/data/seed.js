import { uid } from '../lib/id.js'
import { newItp } from './itpTemplate.js'
import { createLocation } from '../lib/location.js'

function daysAgo(days) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

function isoDate(offset = 0) {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return date.toISOString().slice(0, 10)
}

// Each card is the overall job/site/project file. Locations inside the card each
// carry their own ITP, photos and resource planning details.
export function seedBoard() {
  const scheduledId = uid('job')
  const progressId = uid('job')
  const completeId = uid('job')

  const scheduledLocation = createLocation({
    building: 'Building 1',
    level: 'Level 1',
    unit: 'Unit 105',
    areaName: 'Bathroom',
    scheduledDate: isoDate(2),
    scheduledTime: '07:00',
    assignee: 'Dave',
    comments: 'Internal wet area, hobless shower. Complete substrate check before primer.',
    itp: newItp(),
  })

  const progressLocation = createLocation({
    building: 'Podium Deck',
    level: 'Zone C',
    unit: '',
    areaName: 'Trafficable deck',
    scheduledDate: isoDate(0),
    scheduledTime: '10:30',
    assignee: 'Liam',
    comments: 'First coat complete. Second coat due after curing window.',
    itp: newItp(),
  })

  const completeLocation = createLocation({
    building: 'Building 2',
    level: 'Level 3',
    unit: 'Unit 305',
    areaName: 'Balcony',
    scheduledDate: isoDate(-12),
    scheduledTime: '08:00',
    assignee: 'Mark',
    comments: 'Recently completed balcony works. Keep visible for two weeks before archive.',
    itp: newItp(),
  })

  return {
    columns: [
      { id: 'col-scheduled', title: 'Scheduled Jobs', cardIds: [scheduledId] },
      { id: 'col-in-progress', title: 'In Progress', cardIds: [progressId] },
      { id: 'col-complete', title: 'Completed', cardIds: [completeId] },
    ],
    cards: {
      [scheduledId]: {
        id: scheduledId,
        title: 'Riverside Tower Waterproofing',
        client: 'Hartley Builders',
        clientEmail: '',
        area: '12 Marine Pde, Southport',
        assignee: 'Dave',
        scheduledDate: isoDate(2),
        scheduledTime: '07:00',
        awaitingInspection: false,
        completedAt: '',
        description:
          'Upcoming waterproofing project file. Add each bathroom, balcony, podium zone or tanking wall as a separate location with its own ITP.',
        photos: [],
        locations: [scheduledLocation],
        activeLocationId: scheduledLocation.id,
        itp: newItp(),
        variations: [],
        timeLog: [],
        createdAt: new Date().toISOString(),
      },
      [progressId]: {
        id: progressId,
        title: 'Podium Deck Waterproofing',
        client: 'Hartley Builders',
        clientEmail: '',
        area: 'Riverside Tower - Podium Deck',
        assignee: 'Liam',
        scheduledDate: isoDate(0),
        scheduledTime: '10:30',
        awaitingInspection: true,
        completedAt: '',
        description: 'In progress. First coat complete, second coat to be carried out after cure window and project-team inspection.',
        photos: [],
        locations: [progressLocation],
        activeLocationId: progressLocation.id,
        itp: newItp(),
        variations: [],
        timeLog: [],
        createdAt: new Date().toISOString(),
      },
      [completeId]: {
        id: completeId,
        title: 'Unit 305 Balcony',
        client: 'Hartley Builders',
        clientEmail: '',
        area: 'Riverside Tower - Building 2',
        assignee: 'Mark',
        scheduledDate: isoDate(-12),
        scheduledTime: '08:00',
        awaitingInspection: false,
        completedAt: daysAgo(12),
        description: 'Recently completed. Jobs remain here for roughly two weeks before they move to the Completed Job Folder.',
        photos: [],
        locations: [completeLocation],
        activeLocationId: completeLocation.id,
        itp: newItp(),
        variations: [],
        timeLog: [],
        createdAt: daysAgo(20),
      },
    },
  }
}
