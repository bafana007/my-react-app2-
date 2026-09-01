import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
import HotelCard from '../../components/HotelCard/HotelCard.jsx'
import Loader from '../../components/Loader/Loader.jsx'
import { getHotels } from '../../services/hotelService.js'
import './Home.css'

function Home() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    getHotels({ sort: 'rating' })
      .then((data) => {
        if (isMounted) setHotels(data.slice(0, 6))
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
  }, [])

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-inner">
          <h1>
            Find your perfect stay,
            <br />
            <span className="hero-accent">anywhere in the world.</span>
          </h1>
          <p>
            Handpicked hotels across South Africa and beyond — from Camps Bay beachfronts to
            Balinese jungle villas. Real availability, instant confirmation.
          </p>
          <SearchBar />
        </div>
      </section>

      <section className="home-section">
        <div className="section-head">
          <h2>Top rated stays</h2>
          <Link to="/hotels" className="see-all">
            View all hotels →
          </Link>
        </div>

        {loading && <Loader label="Finding the best hotels for you…" />}
        {error && (
          <div className="error-state">
            <p>Could not load hotels. Is the API server running?</p>
            <p className="error-detail">Run <code>npm run dev:all</code> to start both servers.</p>
          </div>
        )}
        {!loading && !error && (
          <div className="hotel-grid">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </section>

      <section className="home-section perks">
        <div className="perk">
          <span className="perk-icon">🔎</span>
          <h3>Search with confidence</h3>
          <p>Live availability for every room, updated the moment someone books.</p>
        </div>
        <div className="perk">
          <span className="perk-icon">⚡</span>
          <h3>Instant confirmation</h3>
          <p>Get your booking reference immediately — no waiting, no calls.</p>
        </div>
        <div className="perk">
          <span className="perk-icon">🛡️</span>
          <h3>Free cancellation</h3>
          <p>Plans change. Cancel free of charge up to 48 hours before check-in.</p>
        </div>
      </section>
    </div>
  )
}

export default Home