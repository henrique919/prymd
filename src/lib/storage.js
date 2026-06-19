import { seedBoard } from '../data/seed.js'
import { BAYSET_PRODUCTS, newItp } from '../data/itpTemplate.js'

const KEY = 'prymd.board.v3'
const OLD_KEYS = ['prymd.board.v2', 'prymd.board.v1']
const VALID_RESULTS = new Set(['pending', 'pass', 'fail', 'na'])
const VALID_VARIATION_STATUSES = new Set(['pending', 'approved'])

// The prototype persists everything (including photos as data URLs) to
// localStorage so it runs with no backend. When you move to a server,
// this is the only file that should need replacing — swap these functions
// for API calls and the rest of the app can stay largely unchanged.

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function safeString(value, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function normalisePhotos(photos, prefix) {
  if (!Array.isArray(photos)) return []

  return photos
    .map((photo, index) => {
      if (!photo || typeof photo !== 'object') return null
      const dataUrl = safeString(photo.dataUrl)
      if (!dataUrl) return null

      return {
        id: safeString(photo.id, `${prefix}-${index}`),
        dataUrl,
        ts: safeString(photo.ts, new Date().toISOString()),
      }
    })
    .filter(Boolean)
}

function normaliseItp(itp) {
  const template = newItp()
  if (!Array.isArray(itp)) return template

  return template.map((holdPoint) => {
    const saved = itp.find((item) => item && item.key === holdPoint.key) || {}
    const savedItems = Array.isArray(saved.items) ? saved.items : []

    return {
      ...holdPoint,
      items: holdPoint.items.map((item) => {
        const savedItem = savedItems.find(
          (candidate) => candidate && (candidate.id === item.id || candidate.text === item.text)
        )
        const savedProducts = Array.isArray(savedItem?.selectedProducts)
          ? savedItem.selectedProducts.filter((name) => BAYSET_PRODUCTS.includes(name))
          : []
        return {
          ...item,
          checked: item.type === 'product-select' ? false : Boolean(savedItem?.checked),
          na: item.type === 'product-select' ? false : Boolean(savedItem?.na),
          selectedProducts: item.type === 'product-select' ? savedProducts : [],
        }
      }),
      result: VALID_RESULTS.has(saved.result) ? saved.result : 'pending',
      notes: safeString(saved.notes),
      photos: normalisePhotos(saved.photos, `hp-${holdPoint.key}`),
      signedBy: safeString(saved.signedBy),
      signedAt: safeString(saved.signedAt),
    }
  })
}

function normaliseVariations(variations) {
  if (!Array.isArray(variations)) return []

  return variations
    .map((variation, index) => {
      if (!variation || typeof variation !== 'object') return null

      return {
        id: safeString(variation.id, `var-${index}`),
        description: safeString(variation.description),
        cost: Number(variation.cost) || 0,
        photos: normalisePhotos(variation.photos, `var-${index}`),
        date: safeString(variation.date, new Date().toISOString()),
        status: VALID_VARIATION_STATUSES.has(variation.status) ? variation.status : 'pending',
      }
    })
    .filter(Boolean)
}

function normaliseLoc(loc) {
  if (!loc || typeof loc !== 'object') return null
  const lat = Number(loc.lat)
  const lng = Number(loc.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng, accuracy: Number(loc.accuracy) || null }
}

function normaliseTimeLog(timeLog) {
  if (!Array.isArray(timeLog)) return []

  return timeLog
    .map((entry, index) => {
      if (!entry || typeof entry !== 'object') return null
      const checkInAt = safeString(entry.checkInAt)
      if (!checkInAt) return null

      return {
        id: safeString(entry.id, `time-${index}`),
        worker: safeString(entry.worker),
        checkInAt,
        checkInLoc: normaliseLoc(entry.checkInLoc),
        checkOutAt: safeString(entry.checkOutAt),
        checkOutLoc: normaliseLoc(entry.checkOutLoc),
      }
    })
    .filter(Boolean)
}

function normaliseLocation(location, index, sourceCard) {
  const source = location && typeof location === 'object' ? location : {}
  const fallbackItp = index === 0 && Array.isArray(sourceCard?.itp) ? sourceCard.itp : undefined

  return {
    id: safeString(source.id, `loc-${index}`),
    name: safeString(source.name),
    building: safeString(source.building),
    level: safeString(source.level),
    unit: safeString(source.unit),
    areaName: safeString(source.areaName),
    scheduledDate: safeString(source.scheduledDate),
    scheduledTime: safeString(source.scheduledTime),
    assignee: safeString(source.assignee),
    comments: safeString(source.comments),
    photos: normalisePhotos(source.photos, `loc-${index}`),
    itp: normaliseItp(source.itp || fallbackItp),
    createdAt: safeString(source.createdAt, new Date().toISOString()),
  }
}

function defaultLocationForCard(source, id) {
  return normaliseLocation(
    {
      id: 'loc-main',
      name: safeString(source.title, 'Main location'),
      areaName: safeString(source.title, 'Main location'),
      scheduledDate: safeString(source.scheduledDate),
      scheduledTime: safeString(source.scheduledTime),
      assignee: safeString(source.assignee),
      comments: safeString(source.description),
      photos: [],
      itp: source.itp,
      createdAt: source.createdAt,
    },
    0,
    source
  )
}

function normaliseLocations(locations, sourceCard, id) {
  if (!Array.isArray(locations) || locations.length === 0) {
    return [defaultLocationForCard(sourceCard, id)]
  }

  const next = locations.map((loc, i) => normaliseLocation(loc, i, sourceCard)).filter(Boolean)
  return next.length ? next : [defaultLocationForCard(sourceCard, id)]
}

function normaliseCard(card, id) {
  const source = card && typeof card === 'object' ? card : {}
  const locations = normaliseLocations(source.locations, source, id)
  const activeLocationId = locations.some((loc) => loc.id === source.activeLocationId)
    ? safeString(source.activeLocationId)
    : locations[0]?.id || ''

  return {
    id: safeString(source.id, id),
    title: safeString(source.title, 'Untitled project'),
    client: safeString(source.client),
    clientEmail: safeString(source.clientEmail),
    area: safeString(source.area),
    assignee: safeString(source.assignee),
    scheduledDate: safeString(source.scheduledDate),
    scheduledTime: safeString(source.scheduledTime),
    description: safeString(source.description),
    awaitingInspection: Boolean(source.awaitingInspection),
    completedAt: safeString(source.completedAt),
    photos: normalisePhotos(source.photos, `job-${id}`),
    locations,
    activeLocationId,
    // Legacy support for older cards. Current ITPs live inside locations.
    itp: normaliseItp(source.itp),
    variations: normaliseVariations(source.variations),
    timeLog: normaliseTimeLog(source.timeLog),
    createdAt: safeString(source.createdAt, new Date().toISOString()),
  }
}

const BOARD_COLUMNS = [
  { id: 'col-scheduled', title: 'Scheduled Jobs' },
  { id: 'col-in-progress', title: 'In Progress' },
  { id: 'col-complete', title: 'Completed' },
]

function normaliseBoard(board) {
  if (!board || typeof board !== 'object' || !Array.isArray(board.columns) || !board.cards) {
    return seedBoard()
  }

  const cards = Object.fromEntries(
    Object.entries(board.cards).map(([id, card]) => [id, normaliseCard(card, id)])
  )

  const buckets = {
    'col-scheduled': [],
    'col-in-progress': [],
    'col-complete': [],
  }

  board.columns.forEach((column) => {
    if (!column || typeof column !== 'object' || !Array.isArray(column.cardIds)) return
    const sourceId = safeString(column.id)
    const targetId = sourceId === 'col-onsite' || sourceId === 'col-inspection'
      ? 'col-in-progress'
      : sourceId === 'col-completed'
      ? 'col-complete'
      : buckets[sourceId]
      ? sourceId
      : 'col-scheduled'

    column.cardIds.forEach((cardId) => {
      if (cards[cardId] && !buckets[targetId].includes(cardId)) {
        buckets[targetId].push(cardId)
      }
    })
  })

  const assignedIds = new Set(Object.values(buckets).flat())
  Object.keys(cards).forEach((id) => {
    if (!assignedIds.has(id)) buckets['col-scheduled'].push(id)
  })

  const columns = BOARD_COLUMNS.map((column) => ({
    ...column,
    cardIds: buckets[column.id] || [],
  }))

  return { columns, cards }
}

export function loadBoard() {
  if (!canUseStorage()) return seedBoard()

  try {
    const raw = localStorage.getItem(KEY) || OLD_KEYS.map((key) => localStorage.getItem(key)).find(Boolean)
    if (!raw) return seedBoard()
    return normaliseBoard(JSON.parse(raw))
  } catch (err) {
    console.error('Could not read saved board, starting fresh.', err)
    return seedBoard()
  }
}

export function saveBoard(board) {
  if (!canUseStorage()) return

  try {
    localStorage.setItem(KEY, JSON.stringify(normaliseBoard(board)))
  } catch (err) {
    // Most likely the 5MB localStorage quota was hit by photos.
    console.error('Could not save. Browser storage may be full.', err)
    alert(
      'Storage is full — this prototype keeps photos in the browser, which is limited.\n' +
        'Remove a few photos, or see the README for moving to a real backend.'
    )
  }
}

export function resetBoard() {
  if (!canUseStorage()) return
  localStorage.removeItem(KEY)
  OLD_KEYS.forEach((key) => localStorage.removeItem(key))
}
