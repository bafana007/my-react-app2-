import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import About from './pages/About/About.jsx'
import Hotels from './pages/Hotels/Hotels.jsx'
import HotelDetail from './pages/HotelDetail/HotelDetail.jsx'
import BookingConfirmation from './pages/BookingConfirmation/BookingConfirmation.jsx'
import MyBookings from './pages/MyBookings/MyBookings.jsx'
import Login from './pages/Login/Login.jsx'
import Admin from './pages/Admin/Admin.jsx'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/hotels/:id" element={<HotelDetail />} />
      <Route path="/booking/:reference" element={<BookingConfirmation />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter