import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import RoomCard from '../../components/RoomCard/RoomCard.jsx'
import BookingForm from '../../components/BookingForm/BookingForm.jsx'
import Loader from '../../components/Loader/Loader.jsx'
import { getHotelById } from '../../services/hotelService.js'
import { nightsBetween, todayISO, addDaysISO, isValidRange } from '../../utils/dates.js'
import { formatCurrency } from '../../utils/formatCurrency.js'
import './HotelDetail.css'

function HotelDetail() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const checkIn = searchParams.get('checkIn') || ''
  const checkOut = searchParams.get('checkOut') || ''
  const guests = Number(searchParams.get('guests')) || 2
  const hasDates = isValidRange(checkIn, checkOut)
  const nights = nightsBetween(checkIn, checkOut)

  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)
    setSelectedRoom(null)

    getHotelById(id, { checkIn, checkOut })
      .then((data) => {
        if (isMounted) setHotel(data)
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
  }, [id, checkIn, checkOut])

  function handleDateChange(field, value) {
    const next = new URLSearchParams(searchParams)
    next.set(field, value)
    if (field === 'checkIn' && next.get('checkOut') <= value) {
      next.set('checkOut', addDaysISO(value, 1))
    }
    setSearchParams(next)
  }

  if (loading) return <Loader label="Loading hotel…" />

  if (error || !hotel) {
    return (
      <div className="detail-page">
        <div className="error-state">
          <p>Could not load this hotel. It may not exist, or the API server is offline.</p>
          <Link to="/hotels" className="btn btn-outline">
            ← Back to all hotels
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="detail-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / <Link to="/hotels">Hotels</Link> /{' '}
        <span>{hotel.name}</span>
      </div>

      <div className="detail-hero">
        <div className="detail-hero-image">
          <img
            src={hotel.image}
            alt={hotel.name}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
        <div className="detail-hero-info">
          <p className="detail-location">
            {hotel.city}, {hotel.country} · {hotel.address}
          </p>
          <h1>{hotel.name}</h1>
          <p className="detail-rating">
            <span className="rating-badge">★ {hotel.rating.toFixed(1)}</span>
            <span className="rating-reviews">{hotel.reviews.toLocaleString()} reviews</span>
          </p>
          <p className="detail-desc">{hotel.description}</p>
          <div className="detail-amenities">
            {hotel.amenities.map((a) => (
              <span key={a} className="amenity-chip">
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="detail-dates card-panel">
        <h3>Your stay</h3>
        <div className="detail-dates-fields">
          <label>
            Check-in
            <input
              type="date"
              value={checkIn || addDaysISO(todayISO(), 7)}
              min={todayISO()}
              onChange={(e) => handleDateChange('checkIn', e.target.value)}
            />
          </label>
          <label>
            Check-out
            <input
              type="date"
              value={checkOut || addDaysISO(todayISO(), 9)}
              min={addDaysISO(checkIn || todayISO(), 1)}
              onChange={(e) => handleDateChange('checkOut', e.target.value)}
            />
          </label>
          <div className="stay-summary">
            {hasDates ? (
              <>
                <strong>
                  {nights} {nights === 1 ? 'night' : 'nights'}
                </strong>
                <span>{guests} {guests === 1 ? 'guest' : 'guests'}</span>
              </>
            ) : (
              <span>Select dates to see live availability</span>
            )}
          </div>
        </div>
      </section>

      <section className="detail-rooms">
        <h2>Choose your room</h2>
        {hasDates ? (
          <div className="room-list">
            {hotel.rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                nights={nights}
                guests={guests}
                selected={selectedRoom?.id === room.id}
                onSelect={setSelectedRoom}
              />
            ))}
          </div>
        ) : (
          <p className="rooms-hint">
            Pick your check-in and check-out dates above to see which rooms are available.
          </p>
        )}
      </section>

      {selectedRoom && hasDates && (
        <BookingForm
          hotel={hotel}
          room={selectedRoom}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          nights={nights}
        />
      )}

      {!selectedRoom && hasDates && (
        <p className="select-hint">
          Select a room above to continue — from {formatCurrency(Math.min(...hotel.rooms.map((r) => r.pricePerNight)))} per night.
        </p>
      )}
    </div>
  )
}

export default HotelDetail