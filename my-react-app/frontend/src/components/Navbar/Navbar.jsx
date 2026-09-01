import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './Navbar.css'

function Navbar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">◆</span> Stay<span className="brand-accent">Ease</span>
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end className="nav-link" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/hotels" className="nav-link" onClick={() => setMenuOpen(false)}>
            Hotels
          </NavLink>
          <NavLink to="/my-bookings" className="nav-link" onClick={() => setMenuOpen(false)}>
            My Bookings
          </NavLink>
          <NavLink to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>
            About
          </NavLink>

          {user ? (
            <div className="nav-user">
              <NavLink to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>
                Admin
              </NavLink>
              <span className="nav-user-name">Hi, {user.name.split(' ')[0]}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
