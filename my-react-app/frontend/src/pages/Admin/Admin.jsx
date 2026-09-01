import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { createHotel } from '../../services/hotelService.js'
import { saveHotelToFirestore } from '../../services/firebase.js'
import './Admin.css'

function Admin() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    id: '',
    name: '',
    city: '',
    country: '',
    address: '',
    description: '',
    rating: '4.5',
    reviews: '0',
    amenities: '',
    image: '',
  })
  const [rooms, setRooms] = useState([
    { id: '', name: '', pricePerNight: '', capacity: '2', units: '1', size: '', bed: '' },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function updateRoom(index, field, value) {
    setRooms((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  function addRoom() {
    setRooms((prev) => [
      ...prev,
      { id: '', name: '', pricePerNight: '', capacity: '2', units: '1', size: '', bed: '' },
    ])
  }

  function removeRoom(index) {
    setRooms((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.id.trim() || !form.name.trim() || !form.city.trim() || !Array.isArray(rooms) || rooms.length === 0) {
      setError('Please provide at least hotel ID, name, city, and one room.')
      return
    }

    const parsedRooms = rooms.map((r, idx) => {
      const id = r.id.trim() || `${form.id.trim()}-r${idx + 1}`
      return {
        id,
        name: r.name.trim(),
        pricePerNight: Number(r.pricePerNight) || 0,
        capacity: Number(r.capacity) || 1,
        units: Number(r.units) || 1,
        size: Number(r.size) || 0,
        bed: r.bed.trim(),
      }
    })

    const payload = {
      id: form.id.trim(),
      name: form.name.trim(),
      city: form.city.trim(),
      country: form.country.trim(),
      address: form.address.trim(),
      description: form.description.trim(),
      rating: Number(form.rating) || 0,
      reviews: Number(form.reviews) || 0,
      amenities: form.amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
      image: form.image.trim(),
      rooms: parsedRooms,
    }

    setLoading(true)
    try {
      await createHotel(payload)
      await saveHotelToFirestore({
        ...payload,
        createdAt: new Date().toISOString(),
      })
      setSuccess('Hotel uploaded successfully')
      setForm({
        id: '',
        name: '',
        city: '',
        country: '',
        address: '',
        description: '',
        rating: '4.5',
        reviews: '0',
        amenities: '',
        image: '',
      })
      setRooms([
        { id: '', name: '', pricePerNight: '', capacity: '2', units: '1', size: '', bed: '' },
      ])
    } catch (err) {
      setError(err.message || 'Failed to upload hotel')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <h1>Admin</h1>
          <p>Please sign in to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-card">
        <h1>Upload hotel</h1>
        <p className="admin-sub">Add a new hotel to StayEase. The hotel will be saved to the API database and Firestore.</p>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-grid">
            <label>
              Hotel ID
              <input value={form.id} onChange={(e) => updateForm('id', e.target.value)} placeholder="e.g. h9" required />
            </label>
            <label>
              Hotel name
              <input value={form.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="Hotel name" required />
            </label>
            <label>
              City
              <input value={form.city} onChange={(e) => updateForm('city', e.target.value)} placeholder="City" required />
            </label>
            <label>
              Country
              <input value={form.country} onChange={(e) => updateForm('country', e.target.value)} placeholder="Country" />
            </label>
            <label>
              Address
              <input value={form.address} onChange={(e) => updateForm('address', e.target.value)} placeholder="Address" />
            </label>
            <label>
              Image URL
              <input value={form.image} onChange={(e) => updateForm('image', e.target.value)} placeholder="https://..." />
            </label>
            <label>
              Rating
              <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => updateForm('rating', e.target.value)} />
            </label>
            <label>
              Reviews
              <input type="number" min="0" value={form.reviews} onChange={(e) => updateForm('reviews', e.target.value)} />
            </label>
          </div>

          <label>
            Description
            <textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} placeholder="Short description" />
          </label>

          <label>
            Amenities (comma separated)
            <input value={form.amenities} onChange={(e) => updateForm('amenities', e.target.value)} placeholder="Free WiFi, Pool, Spa" />
          </label>

          <div className="rooms-header">
            <h3>Rooms</h3>
            <button type="button" className="btn btn-outline btn-sm" onClick={addRoom}>
              Add room
            </button>
          </div>

          {rooms.map((room, index) => (
            <div key={index} className="room-row">
              <div className="form-grid">
                <label>
                  Room ID
                  <input
                    value={room.id}
                    onChange={(e) => updateRoom(index, 'id', e.target.value)}
                    placeholder={`${form.id.trim() || 'hotel'}-r${index + 1}`}
                  />
                </label>
                <label>
                  Room name
                  <input value={room.name} onChange={(e) => updateRoom(index, 'name', e.target.value)} placeholder="Room name" required />
                </label>
                <label>
                  Price/night
                  <input type="number" min="0" value={room.pricePerNight} onChange={(e) => updateRoom(index, 'pricePerNight', e.target.value)} required />
                </label>
                <label>
                  Capacity
                  <input type="number" min="1" value={room.capacity} onChange={(e) => updateRoom(index, 'capacity', e.target.value)} required />
                </label>
                <label>
                  Units
                  <input type="number" min="1" value={room.units} onChange={(e) => updateRoom(index, 'units', e.target.value)} required />
                </label>
                <label>
                  Size (sqm)
                  <input type="number" min="0" value={room.size} onChange={(e) => updateRoom(index, 'size', e.target.value)} />
                </label>
                <label>
                  Bed type
                  <input value={room.bed} onChange={(e) => updateRoom(index, 'bed', e.target.value)} placeholder="King bed" />
                </label>
              </div>
              {rooms.length > 1 && (
                <button type="button" className="room-remove" onClick={() => removeRoom(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}

          {error && <p className="admin-error">{error}</p>}
          {success && <p className="admin-success">{success}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Uploading…' : 'Upload hotel'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Admin