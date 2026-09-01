import { Router } from 'express'
import {
  findHotel,
  findRoom,
  getAvailableUnits,
  createBookingRecord,
  generateReference,
  getDb,
} from '../db.js'

const router = Router()

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function isValidDate(str) {
  if (!ISO_DATE.test(str)) return false
  const d = new Date(`${str}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === str
}

function nightsBetween(checkIn, checkOut) {
  const ms = new Date(`${checkOut}T00:00:00Z`) - new Date(`${checkIn}T00:00:00Z`)
  return Math.round(ms / 86400000)
}

// POST /api/bookings
// Body: { hotelId, roomId, checkIn, checkOut, guests, guestName, guestEmail }
router.post('/', (req, res) => {
  const { hotelId, roomId, checkIn, checkOut, guests, guestName, guestEmail } = req.body || {}

  // --- Validation ---
  if (!hotelId || !roomId || !checkIn || !checkOut || !guestName || !guestEmail) {
    return res.status(400).json({
      error: 'Missing required fields: hotelId, roomId, checkIn, checkOut, guestName, guestEmail',
    })
  }

  if (!isValidDate(checkIn) || !isValidDate(checkOut)) {
    return res.status(400).json({ error: 'Dates must be valid ISO strings (YYYY-MM-DD)' })
  }

  const nights = nightsBetween(checkIn, checkOut)
  if (nights < 1) {
    return res.status(400).json({ error: 'Check-out must be after check-in' })
  }

  const today = new Date().toISOString().slice(0, 10)
  if (checkIn < today) {
    return res.status(400).json({ error: 'Check-in cannot be in the past' })
  }

  if (nights > 30) {
    return res.status(400).json({ error: 'Stays are limited to 30 nights' })
  }

  const numGuests = Number(guests)
  if (!Number.isInteger(numGuests) || numGuests < 1 || numGuests > 10) {
    return res.status(400).json({ error: 'Guests must be a whole number between 1 and 10' })
  }

  if (typeof guestName !== 'string' || guestName.trim().length < 2) {
    return res.status(400).json({ error: 'Please provide the guest’s full name' })
  }

  if (typeof guestEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
    return res.status(400).json({ error: 'Please provide a valid email address' })
  }

  // --- Hotel / room existence ---
  const hotel = findHotel(hotelId)
  if (!hotel) return res.status(404).json({ error: 'Hotel not found' })

  const room = findRoom(hotelId, roomId)
  if (!room) return res.status(404).json({ error: 'Room not found' })

  if (numGuests > room.capacity) {
    return res.status(400).json({
      error: `This room sleeps ${room.capacity} guest(s) — please choose a larger room`,
    })
  }

  // --- Availability (date-overlap check) ---
  const available = getAvailableUnits(roomId, checkIn, checkOut)
  if (available < 1) {
    return res.status(409).json({
      error: 'Sorry, this room is fully booked for the selected dates',
    })
  }

  // --- Create booking ---
  const booking = {
    id: `b${Date.now()}${Math.floor(Math.random() * 1000)}`,
    reference: generateReference(),
    hotelId,
    hotelName: hotel.name,
    hotelCity: hotel.city,
    hotelImage: hotel.image,
    roomId,
    roomName: room.name,
    checkIn,
    checkOut,
    nights,
    guests: numGuests,
    pricePerNight: room.pricePerNight,
    totalPrice: room.pricePerNight * nights,
    currency: 'ZAR',
    guestName: guestName.trim(),
    guestEmail: guestEmail.trim().toLowerCase(),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }

  createBookingRecord(booking)
  return res.status(201).json(booking)
})

// GET /api/bookings?email=  — list bookings for a guest
router.get('/', (req, res) => {
  const { email } = req.query
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email query parameter is required' })
  }

  const bookings = getDb()
    .bookings.filter((b) => b.guestEmail === email.trim().toLowerCase())
    .sort((a, b) => (a.checkIn < b.checkIn ? 1 : -1))

  return res.json(bookings)
})

// GET /api/bookings/:reference — fetch a single booking
router.get('/:reference', (req, res) => {
  const ref = req.params.reference.toUpperCase()
  const booking = getDb().bookings.find((b) => b.reference === ref)
  if (!booking) {
    return res.status(404).json({ error: `No booking found with reference ${ref}` })
  }
  return res.json(booking)
})

export default router