import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatCurrency.js'
import './HotelCard.css'

function HotelCard({ hotel, checkIn, checkOut, guests }) {
  const query = new URLSearchParams()
  if (checkIn) query.set('checkIn', checkIn)
  if (checkOut) query.set('checkOut', checkOut)
  if (guests) query.set('guests', guests)
  const qs = query.toString()

  return (
    <Link to={`/hotels/${hotel.id}${qs ? `?${qs}` : ''}`} className="hotel-card">
      <div className="hotel-card-image">
        <img
          src={hotel.image}
          alt={hotel.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <span className="hotel-card-rating">★ {hotel.rating.toFixed(1)}</span>
      </div>

      <div className="hotel-card-body">
        <div className="hotel-card-location">
          {hotel.city}, {hotel.country}
        </div>
        <h3 className="hotel-card-name">{hotel.name}</h3>
        <p className="hotel-card-desc">{hotel.description}</p>

        <div className="hotel-card-amenities">
          {hotel.amenities.slice(0, 3).map((a) => (
            <span key={a} className="amenity-chip">
              {a}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="amenity-chip amenity-more">+{hotel.amenities.length - 3}</span>
          )}
        </div>

        <div className="hotel-card-footer">
          <span className="hotel-card-reviews">{hotel.reviews.toLocaleString()} reviews</span>
          <div className="hotel-card-price">
            <span className="price-from">from</span>
            <span className="price-amount">{formatCurrency(hotel.fromPrice)}</span>
            <span className="price-per">/ night</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default HotelCard