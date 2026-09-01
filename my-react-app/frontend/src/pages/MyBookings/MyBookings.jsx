import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getBookingsByEmail, getBookingByReference } from '../../services/hotelService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { formatDate } from '../../utils/formatDate.js'
import Loader from '../../components/Loader/Loader.jsx'
import './MyBookings.css'

function MyBookings() {
  const { user } = useAuth()
  const [email, setEmail] = useState(user?.email || '')
  const [reference, setReference] = useState('')
  const [bookings, setBookings] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  async function handleEmailSearch(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setSearched(true)
    try {
      const data = await getBookingsByEmail(email)
      setBookings(data)
    } catch (err) {
      setError(err.message)
      setBookings(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleReferenceSearch(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setSearched(true)
    try {
      const booking = await getBookingByReference(reference.trim())
      setBookings([booking])
    } catch (err) {
      setError(err.message)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="my-bookings">
      <h1>My bookings</h1>
      <p className="my-bookings-sub">
        Look up your stays with the email you booked with, or a booking reference.
      </p>

      <div className="lookup-grid">
        <form className="lookup-card" onSubmit={handleEmailSearch}>
          <h3>Find by email</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Search bookings
          </button>
        </form>

        <form className="lookup-card" onSubmit={handleReferenceSearch}>
          <h3>Find by reference</h3>
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. SE-AB12CD"
            required
          />
          <button type="submit" className="btn btn-outline" disabled={loading}>
            Look up reference
          </button>
        </form>
      </div>

      {loading && <Loader label="Searching…" />}

      {error && (
        <div className="error-state">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && bookings && bookings.length === 0 && searched && (
        <div className="empty-state">
          <span className="empty-icon">🧳</span>
          <h2>No bookings found</h2>
          <p>Nothing yet — time to plan your next trip!</p>
          <Link to="/hotels" className="btn btn-primary">
            Browse hotels
          </Link>
        </div>
      )}

      {!loading && !error && bookings && bookings.length > 0 && (
        <div className="bookings-list">
          {bookings.map((b) => (
            <Link key={b.id} to={`/booking/${b.reference}`} className="booking-item">
              <div className="booking-item-image">
                <img
                  src={b.hotelImage}
                  alt={b.hotelName}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
              <div className="booking-item-main">
                <span className={`booking-status status-${b.status}`}>{b.status}</span>
                <h3>{b.hotelName}</h3>
                <p>
                  {b.roomName} · {b.hotelCity}
                </p>
                <p className="booking-item-dates">
                  {formatDate(b.checkIn)} → {formatDate(b.checkOut)} · {b.nights}{' '}
                  {b.nights === 1 ? 'night' : 'nights'} · {b.guests}{' '}
                  {b.guests === 1 ? 'guest' : 'guests'}
                </p>
              </div>
              <div className="booking-item-side">
                <span className="booking-ref">{b.reference}</span>
                <span className="booking-total">{formatCurrency(b.totalPrice)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookings