// Most crews use one phone per worker, so we ask once and remember who's
// holding this device — every check-in defaults to that name.

const KEY = 'prymd.worker.v1'

export function getWorkerName() {
  try {
    return localStorage.getItem(KEY) || ''
  } catch {
    return ''
  }
}

export function setWorkerName(name) {
  try {
    localStorage.setItem(KEY, name)
  } catch {
    // ignore — non-fatal if storage is unavailable
  }
}
