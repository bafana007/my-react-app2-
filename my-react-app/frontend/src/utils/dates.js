// Date helpers working with ISO strings (YYYY-MM-DD)

export function todayISO() {
  const now = new Date()
  const offsetMs = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10)
}

export function addDaysISO(isoDate, days) {
  const d = new Date(`${isoDate}T00:00:00`)
  d.setDate(d.getDate() + days)
  const offsetMs = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - offsetMs).toISOString().slice(0, 10)
}

export function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0
  const ms = new Date(`${checkOut}T00:00:00`) - new Date(`${checkIn}T00:00:00`)
  return Math.max(0, Math.round(ms / 86400000))
}

export function isValidRange(checkIn, checkOut) {
  return Boolean(checkIn && checkOut && nightsBetween(checkIn, checkOut) >= 1)
}