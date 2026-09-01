import { Router } from 'express'
import { getDb, findHotel, getAvailableUnits } from '../db.js'

const router = Router()

// POST /api/hotels
// Body: hotel object with nested rooms array
router.post('/', (req, res) => {
  const hotel = req.body
  if (!hotel || !hotel.id || !hotel.name || !Array.isArray(hotel.rooms)) {
    return res.status(400).json({ error: 'Invalid hotel payload' })
  }

  const db = getDb()
  if (db.hotels.find((h) => h.id === hotel.id)) {
    return res.status(409).json({ error: 'Hotel with this ID already exists' })
  }

  db.hotels.push(hotel)
  return res.status(201).json(hotel)
})

// GET /api/hotels?city=&guests=&maxPrice=&sort=
// Returns hotels, optionally filtered. When checkIn/checkOut are supplied,
// each room is annotated with live availability for that date range.
router.get('/', (req, res) => {
  const { city, guests, maxPrice, sort, checkIn, checkOut } = req.query
  let hotels = getDb().hotels

  if (city && city.trim()) {
    const q = city.trim().toLowerCase()
    hotels = hotels.filter(
      (h) => h.city.toLowerCase().includes(q) || h.country.toLowerCase().includes(q)
    )
  }

  if (guests && !Number.isNaN(Number(guests))) {
    const minCapacity = Number(guests)
    hotels = hotels.filter((h) => h.rooms.some((r) => r.capacity >= minCapacity))
  }

  if (maxPrice && !Number.isNaN(Number(maxPrice))) {
    const cap = Number(maxPrice)
    hotels = hotels.filter((h) => h.rooms.some((r) => r.pricePerNight <= cap))
  }

  const hasDates = Boolean(checkIn && checkOut)

  const mapped = hotels.map((h) => {
    const rooms = h.rooms.map((r) => {
      if (!hasDates) return { ...r, availableUnits: r.units }
      return { ...r, availableUnits: getAvailableUnits(r.id, checkIn, checkOut) }
    })
    const fromPrice = Math.min(...rooms.map((r) => r.pricePerNight))
    return { ...h, rooms, fromPrice }
  })

  if (hasDates) {
    // Only show hotels that have at least one room available for the range.
    const withAvailability = mapped.filter((h) => h.rooms.some((r) => r.availableUnits > 0))
    return res.json(sortHotels(withAvailability, sort))
  }

  return res.json(sortHotels(mapped, sort))
})

function sortHotels(hotels, sort) {
  const list = [...hotels]
  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => a.fromPrice - b.fromPrice)
    case 'price-desc':
      return list.sort((a, b) => b.fromPrice - a.fromPrice)
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating)
    default:
      return list
  }
}

// GET /api/hotels/:id?checkIn=&checkOut=
router.get('/:id', (req, res) => {
  const hotel = findHotel(req.params.id)
  if (!hotel) {
    return res.status(404).json({ error: 'Hotel not found' })
  }

  const { checkIn, checkOut } = req.query
  const hasDates = Boolean(checkIn && checkOut)

  const rooms = hotel.rooms.map((r) => ({
    ...r,
    availableUnits: hasDates ? getAvailableUnits(r.id, checkIn, checkOut) : r.units,
  }))

  return res.json({ ...hotel, rooms })
})

export default router