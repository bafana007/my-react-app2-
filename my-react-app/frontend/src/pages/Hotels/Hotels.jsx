import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
import HotelCard from '../../components/HotelCard/HotelCard.jsx'
import Loader from '../../components/Loader/Loader.jsx'
import { getHotels } from '../../services/hotelService.js'
import { nightsBetween } from '../../utils/dates.js'
import './Hotels.css'

function Hotels() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const city = searchParams.get('city') || ''
  const checkIn = searchParams.get('checkIn') || ''
  const checkOut = searchParams.get('checkOut') || ''
  const guests = searchParams.get('guests') || ''
  const sort = searchParams.get('sort') || 'recommended'

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    getHotels({ city, checkIn, checkOut, guests, sort })
      .then((data) => {
        if (isMounted) setHotels(data)
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
  }, [city, checkIn, checkOut, guests, sort])

  function handleSortChange(e) {
    const next = new URLSearchParams(searchParams)
    next.set('sort', e.target.value)
    setSearchParams(next)
  }

  const nights = nightsBetween(checkIn, checkOut)
  const hasSearch = Boolean(city || (checkIn && checkOut))

  return (
    <div className="hotels-page">
      <div className="hotels-header">
        <h1>{hasSearch ? 'Search results' : 'All hotels'}</h1>
        <p>
          {checkIn && checkOut
            ? `${nights} ${nights === 1 ? 'night' : 'nights'} · ${checkIn} → ${checkOut}`
            : 'Browse our handpicked collection'}
          {guests ? ` · ${guests} ${guests === '1' ? 'guest' : 'guests'}` : ''}
        </p>
      </div>

      <div className="hotels-toolbar">
        <SearchBar initial={{ city, checkIn, checkOut, guests }} compact />
        <label className="sort-control">
          Sort by
          <select value={sort} onChange={handleSortChange}>
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price (low to high)</option>
            <option value="price-desc">Price (high to low)</option>
            <option value="rating">Guest rating</option>
          </select>
        </label>
      </div>

      {loading && <Loader label="Searching hotels…" />}
      {error && (
        <div className="error-state">
          <p>Could not load hotels. Is the API server running?</p>
        </div>
      )}
      {!loading && !error && hotels.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🧭</span>
          <h2>No hotels match your search</h2>
          <p>Try different dates, a nearby city, or fewer guests.</p>
        </div>
      )}
      {!loading && !error && hotels.length > 0 && (
        <>
          <p className="results-count">
            {hotels.length} {hotels.length === 1 ? 'hotel' : 'hotels'} found
          </p>
          <div className="hotel-grid">
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Hotels