import express from 'express'
import cors from 'cors'
import hotelsRouter from './routes/hotels.routes.js'
import bookingsRouter from './routes/bookings.routes.js'
import { getDb } from './db.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// Simple request logger
app.use((req, _res, next) => {
  console.log(`[api] ${req.method} ${req.originalUrl}`)
  next()
})

app.get('/api/health', (_req, res) => {
  const db = getDb()
  res.json({
    status: 'ok',
    hotels: db.hotels.length,
    bookings: db.bookings.length,
    time: new Date().toISOString(),
  })
})

app.use('/api/hotels', hotelsRouter)
app.use('/api/bookings', bookingsRouter)

// 404 for unknown API routes
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return res.status(400).json({ error: 'Invalid JSON in request body' })
  }
  console.error('[api] Unhandled error:', err)
  const status = err.statusCode || err.status || 500
  res.status(status).json({ error: status === 500 ? 'Internal server error' : err.message })
})

app.listen(PORT, () => {
  console.log(`✅ StayEase API running at http://localhost:${PORT}/api`)
})