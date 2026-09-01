import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { todayISO, addDaysISO } from '../../utils/dates.js'
import { logSearch } from '../../services/firebase.js'
import './SearchBar.css'

function SearchBar({ initial = {}, compact = false }) {
  const navigate = useNavigate()
  const [city, setCity] = useState(initial.city || '')
  const [checkIn, setCheckIn] = useState(initial.checkIn || addDaysISO(todayISO(), 7))
  const [checkOut, setCheckOut] = useState(initial.checkOut || addDaysISO(todayISO(), 9))
  const [guests, setGuests] = useState(initial.guests || '2')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (checkOut <= checkIn) {
      setError('Check-out must be after check-in.')
      return
    }
    setError('')
    logSearch({ city: city.trim(), checkIn, checkOut, guests })
    const params = new URLSearchParams({ checkIn, checkOut, guests })
    if (city.trim()) params.set('city', city.trim())
    navigate(`/hotels?${params.toString()}`)
  }

  return (
    <form className={`search-bar ${compact ? 'compact' : ''}`} onSubmit={handleSubmit}>
      <div className="search-fields">
        <label className="search-field">
          <span>Destination</span>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City, country, or hotel"
          />
        </label>

        <label className="search-field">
          <span>Check-in</span>
          <input
            type="date"
            value={checkIn}
            min={todayISO()}
            onChange={(e) => {
              setCheckIn(e.target.value)
              if (e.target.value && checkOut <= e.target.value) {
                setCheckOut(addDaysISO(e.target.value, 1))
              }
            }}
          />
        </label>

        <label className="search-field">
          <span>Check-out</span>
          <input
            type="date"
            value={checkOut}
            min={addDaysISO(checkIn || todayISO(), 1)}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </label>

        <label className="search-field search-field-guests">
          <span>Guests</span>
          <select value={guests} onChange={(e) => setGuests(e.target.value)}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="btn btn-primary search-submit">
          Search
        </button>
      </div>
      {error && <p className="search-error">{error}</p>}
    </form>
  )
}

export default SearchBar