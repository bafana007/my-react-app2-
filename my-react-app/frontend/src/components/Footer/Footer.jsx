import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand-mark">◆</span> Stay<span className="brand-accent">Ease</span>
          <p>Handpicked hotels across South Africa and beyond. Book easy, stay easy.</p>
        </div>
        <div className="footer-col">
          <h4>Explore</h4>
          <a href="/hotels">All hotels</a>
          <a href="/my-bookings">My bookings</a>
          <a href="/about">About us</a>
        </div>
        <div className="footer-col">
          <h4>Top destinations</h4>
          <a href="/hotels?city=Cape%20Town">Cape Town</a>
          <a href="/hotels?city=Johannesburg">Johannesburg</a>
          <a href="/hotels?city=Durban">Durban</a>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <a href="mailto:help@stayease.example">help@stayease.example</a>
          <span>+27 (0)11 555 0100</span>
          <span>Mon–Sun, 24/7</span>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} StayEase Hotels. All rights reserved. Demo project.
      </div>
    </footer>
  )
}

export default Footer