import { seedBoard } from '../data/seed.js'
import { newItp } from '../data/itpTemplate.js'

const KEY = 'prymd.board.v1'
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
        return { ...item, checked: Boolean(savedItem?.checked) }
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

function normaliseCard(card, id) {
  const source = card && typeof card === 'object' ? card : {}

  return {
    id: safeString(source.id, id),
    title: safeString(source.title, 'Untitled job'),
    client: safeString(source.client),
    area: safeString(source.area),
    assignee: safeString(source.assignee),
    scheduledDate: safeString(source.scheduledDate),
    description: safeString(source.description),
    photos: normalisePhotos(source.photos, `job-${id}`),
    itp: normaliseItp(source.itp),
    variations: normaliseVariations(source.variations),
    timeLog: normaliseTimeLog(source.timeLog),
    createdAt: safeString(source.createdAt, new Date().toISOString()),
  }
}

function normaliseBoard(board) {
  if (!board || typeof board !== 'object' || !Array.isArray(board.columns) || !board.cards) {
    return seedBoard()
  }

  const cards = Object.fromEntries(
    Object.entries(board.cards).map(([id, card]) => [id, normaliseCard(card, id)])
  )

  const columns = board.columns
    .map((column, index) => {
      if (!column || typeof column !== 'object') return null

      return {
        id: safeString(column.id, `col-${index}`),
        title: safeString(column.title, `Stage ${index + 1}`),
        cardIds: Array.isArray(column.cardIds)
          ? column.cardIds.filter((cardId) => cards[cardId])
          : [],
      }
    })
    .filter(Boolean)

  if (!columns.length) return seedBoard()

  const assignedIds = new Set(columns.flatMap((column) => column.cardIds))
  const unassignedIds = Object.keys(cards).filter((id) => !assignedIds.has(id))

  if (unassignedIds.length) {
    columns[0] = {
      ...columns[0],
      cardIds: [...columns[0].cardIds, ...unassignedIds],
    }
  }

  return { columns, cards }
}

export function loadBoard() {
  if (!canUseStorage()) return seedBoard()

  try {
    const raw = localStorage.getItem(KEY)
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
}
