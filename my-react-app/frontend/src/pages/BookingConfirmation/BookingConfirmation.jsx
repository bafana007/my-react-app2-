import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import Loader from '../../components/Loader/Loader.jsx'
import { getBookingByReference } from '../../services/hotelService.js'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { formatDate } from '../../utils/formatDate.js'
import './BookingConfirmation.css'

function BookingConfirmation() {
  const { reference } = useParams()
  const location = useLocation()
  const [booking, setBooking] = useState(location.state?.booking || null)
  const [loading, setLoading] = useState(!location.state?.booking)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (location.state?.booking) return undefined

    let isMounted = true
    getBookingByReference(reference)
      .then((data) => {
        if (isMounted) setBooking(data)
      })
      .catch((err) => {
        if (isMounted) setError(err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [reference, location.state])

  if (loading) return <Loader label="Fetching your booking…" />

  if (error || !booking) {
    return (
      <div className="confirmation-page">
        <div className="error-state">
          <p>
            {error?.message || 'Booking not found.'} Double-check the reference and try again.
          </p>
          <Link to="/my-bookings" className="btn btn-outline">
            Look up my bookings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="confirmation-icon">✓</div>
        <h1>Booking confirmed!</h1>
        <p className="confirmation-sub">
          A confirmation has been sent to <strong>{booking.guestEmail}</strong>. Keep your
          reference handy at check-in.
        </p>

        <div className="reference-box">
          <span>Booking reference</span>
          <strong>{booking.reference}</strong>
        </div>

        <div className="confirmation-details">
          <div className="confirmation-row">
            <span>Hotel</span>
            <strong>{booking.hotelName}</strong>
          </div>
          <div className="confirmation-row">
            <span>Location</span>
            <strong>{booking.hotelCity}</strong>
          </div>
          <div className="confirmation-row">
            <span>Room</span>
            <strong>{booking.roomName}</strong>
          </div>
          <div className="confirmation-row">
            <span>Check-in</span>
            <strong>{formatDate(booking.checkIn)}</strong>
          </div>
          <div className="confirmation-row">
            <span>Check-out</span>
            <strong>{formatDate(booking.checkOut)}</strong>
          </div>
          <div className="confirmation-row">
            <span>Guests</span>
            <strong>
              {booking.guests} ({booking.guestName})
            </strong>
          </div>
          <div className="confirmation-row confirmation-total">
            <span>Total ({booking.nights} {booking.nights === 1 ? 'night' : 'nights'})</span>
            <strong>{formatCurrency(booking.totalPrice)}</strong>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/my-bookings" className="btn btn-primary">
            View my bookings
          </Link>
          <Link to="/hotels" className="btn btn-outline">
            Book another stay
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmation