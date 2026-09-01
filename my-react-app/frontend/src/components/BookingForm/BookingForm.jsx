import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { createBooking } from '../../services/hotelService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { logBooking } from '../../services/firebase.js'
import './BookingForm.css'

function BookingForm({ hotel, room, checkIn, checkOut, guests, nights }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [guestName, setGuestName] = useState(user?.name || '')
  const [guestEmail, setGuestEmail] = useState(user?.email || '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const total = room.pricePerNight * nights
  const returnTo = location.pathname

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const booking = await createBooking({
        hotelId: hotel.id,
        roomId: room.id,
        checkIn,
        checkOut,
        guests: Number(guests),
        guestName,
        guestEmail,
      })
      logBooking({
        reference: booking.reference,
        hotelId: hotel.id,
        roomId: room.id,
        checkIn,
        checkOut,
        guests: Number(guests),
        guestName,
        guestEmail,
        totalPrice: booking.totalPrice,
      })
      navigate(`/booking/${booking.reference}`, { state: { booking } })
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <section className="booking-form card-panel" id="booking">
        <h3>Complete your booking</h3>
        <div className="booking-summary">
          <div className="booking-summary-row">
            <span>Room</span>
            <strong>{room.name}</strong>
          </div>
          <div className="booking-summary-row">
            <span>Dates</span>
            <strong>
              {checkIn} → {checkOut} ({nights} {nights === 1 ? 'night' : 'nights'})
            </strong>
          </div>
          <div className="booking-summary-row">
            <span>Guests</span>
            <strong>{guests}</strong>
          </div>
          <div className="booking-summary-row booking-total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </div>
        <p className="booking-auth-note">
          Please <Link to="/login" state={{ from: { pathname: returnTo } }}>sign in</Link> or{' '}
          <Link to="/login" state={{ from: { pathname: returnTo } }}>create an account</Link> to complete this booking.
        </p>
      </section>
    )
  }

  return (
    <section className="booking-form card-panel" id="booking">
      <h3>Complete your booking</h3>
      <div className="booking-summary">
        <div className="booking-summary-row">
          <span>Room</span>
          <strong>{room.name}</strong>
        </div>
        <div className="booking-summary-row">
          <span>Dates</span>
          <strong>
            {checkIn} → {checkOut} ({nights} {nights === 1 ? 'night' : 'nights'})
          </strong>
        </div>
        <div className="booking-summary-row">
          <span>Guests</span>
          <strong>{guests}</strong>
        </div>
        <div className="booking-summary-row booking-total">
          <span>Total</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="booking-fields">
        <label>
          Full name
          <input
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Your full name"
            required
            minLength={2}
          />
        </label>
        <label>
          Email (for your confirmation)
          <input
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        {error && <p className="booking-error">{error}</p>}

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Confirming…' : `Confirm booking · ${formatCurrency(total)}`}
        </button>
        <p className="booking-note">
          Free cancellation up to 48 hours before check-in. You won’t be charged until you arrive.
        </p>
      </form>
    </section>
  )
}

export default BookingForm