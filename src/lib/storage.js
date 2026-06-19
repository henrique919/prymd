import { seedBoard } from '../data/seed.js'

const KEY = 'prymd.board.v1'

// The prototype persists everything (including photos as data URLs) to
// localStorage so it runs with no backend. When you move to a server,
// this is the only file that should need replacing — swap these two
// functions for API calls and the rest of the app is unchanged.

export function loadBoard() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seedBoard()
    const parsed = JSON.parse(raw)
    if (!parsed || !parsed.columns || !parsed.cards) return seedBoard()
    return parsed
  } catch (err) {
    console.error('Could not read saved board, starting fresh.', err)
    return seedBoard()
  }
}

export function saveBoard(board) {
  try {
    localStorage.setItem(KEY, JSON.stringify(board))
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
  localStorage.removeItem(KEY)
}
