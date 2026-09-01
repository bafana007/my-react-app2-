import { formatCurrency } from '../../utils/formatCurrency.js'
import './RoomCard.css'

function RoomCard({ room, nights, guests, onSelect, disabled, selected }) {
  const total = room.pricePerNight * Math.max(1, nights)
  const tooSmall = guests > room.capacity
  const soldOut = room.availableUnits <= 0
  const unavailable = tooSmall || soldOut

  return (
    <div className={`room-card ${selected ? 'selected' : ''} ${unavailable ? 'unavailable' : ''}`}>
      <div className="room-card-main">
        <h4 className="room-name">{room.name}</h4>
        <p className="room-meta">
          {room.bed} · {room.size} m² · sleeps {room.capacity}
        </p>
        <p className={`room-availability ${soldOut ? 'sold-out' : ''}`}>
          {soldOut
            ? 'Sold out for these dates'
            : room.availableUnits <= 2
              ? `Only ${room.availableUnits} room${room.availableUnits === 1 ? '' : 's'} left`
              : `${room.availableUnits} rooms available`}
        </p>
      </div>

      <div className="room-card-side">
        <div className="room-pricing">
          <span className="room-price">{formatCurrency(room.pricePerNight)}</span>
          <span className="room-per">/ night</span>
          {nights > 1 && <span className="room-total">{formatCurrency(total)} total</span>}
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          disabled={disabled || unavailable}
          onClick={() => onSelect(room)}
        >
          {tooSmall ? 'Too small' : soldOut ? 'Sold out' : 'Reserve'}
        </button>
      </div>
    </div>
  )
}

export default RoomCard