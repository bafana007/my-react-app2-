import { apiGet, apiPost } from './api.js'

function toQueryString(params) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value)
    }
  })
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export function getHotels(filters = {}) {
  return apiGet(`/hotels${toQueryString(filters)}`)
}

export function getHotelById(id, filters = {}) {
  return apiGet(`/hotels/${id}${toQueryString(filters)}`)
}

export function createHotel(payload) {
  return apiPost('/hotels', payload)
}

export function createBooking(payload) {
  return apiPost('/bookings', payload)
}

export function getBookingsByEmail(email) {
  return apiGet(`/bookings${toQueryString({ email })}`)
}

export function getBookingByReference(reference) {
  return apiGet(`/bookings/${encodeURIComponent(reference)}`)
}