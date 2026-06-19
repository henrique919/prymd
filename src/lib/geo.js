// Thin promise wrapper around the browser geolocation API. Used to stamp
// "where" on a check-in/check-out — best-effort only, never blocks the
// action if it's denied, slow, or unsupported.

export function getLocation({ timeout = 8000 } = {}) {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve(null)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        })
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout, maximumAge: 60000 }
    )
  })
}

export function mapsUrl(loc) {
  if (!loc) return null
  return `https://www.google.com/maps?q=${loc.lat},${loc.lng}`
}
