// No accounts in the prototype — we just remember a name on the device and
// use it to attribute comments, activity and sign-offs (Trello shows who did
// what; this is the lightweight version).
const USER_KEY = 'prymd.user.v1'

export function getUser() {
  try {
    return localStorage.getItem(USER_KEY) || ''
  } catch {
    return ''
  }
}

export function setUser(name) {
  try {
    localStorage.setItem(USER_KEY, name || '')
  } catch {
    /* ignore */
  }
}

// Returns a usable name, prompting once if we don't have one yet.
export function ensureUser() {
  let name = getUser()
  if (!name) {
    name = window.prompt('Your name (so the crew knows who did what):', '') || ''
    name = name.trim()
    if (name) setUser(name)
  }
  return name
}
