import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { seedHotels } from './seedData.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'data')
const DB_FILE = path.join(DATA_DIR, 'db.json')

let db = null

function initDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
      if (!Array.isArray(db.hotels) || !Array.isArray(db.bookings)) {
        throw new Error('Malformed database file')
      }
      return
    } catch {
      console.warn('[db] db.json is corrupt — reseeding from seed data.')
    }
  }

  db = { hotels: seedHotels, bookings: [] }
  persist()
  console.log('[db] Seeded new database with', db.hotels.length, 'hotels.')
}

function persist() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
}

export function getDb() {
  if (!db) initDb()
  return db
}

export function saveDb() {
  if (!db) initDb()
  persist()
}

// ---- Hotel helpers ----

export function findHotel(hotelId) {
  return getDb().hotels.find((h) => h.id === hotelId)
}

export function findRoom(hotelId, roomId) {
  const hotel = findHotel(hotelId)
  if (!hotel) return null
  return hotel.rooms.find((r) => r.id === roomId) || null
}

// ---- Booking helpers ----

// Two date ranges overlap when: newCheckIn < existingCheckOut && newCheckOut > existingCheckIn
function rangesOverlap(checkInA, checkOutA, checkInB, checkOutB) {
  return checkInA < checkOutB && checkOutA > checkInB
}

export function getBookedUnits(roomId, checkIn, checkOut) {
  return getDb().bookings.filter(
    (b) => b.roomId === roomId && rangesOverlap(checkIn, checkOut, b.checkIn, b.checkOut)
  ).length
}

export function getAvailableUnits(roomId, checkIn, checkOut) {
  const db_ = getDb()
  const room = db_.hotels.flatMap((h) => h.rooms).find((r) => r.id === roomId)
  if (!room) return 0
  const booked = getBookedUnits(roomId, checkIn, checkOut)
  return Math.max(0, room.units - booked)
}

export function createBookingRecord(booking) {
  const db_ = getDb()
  db_.bookings.push(booking)
  saveDb()
  return booking
}

export function generateReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `SE-${code}`
}