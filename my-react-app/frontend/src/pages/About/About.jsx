import { Link } from 'react-router-dom'
import './About.css'

function About() {
  return (
    <div className="about">
      <section className="about-hero">
        <h1>About StayEase</h1>
        <p>
          We believe finding a great place to stay should be the easiest part of your trip.
          StayEase connects travellers with handpicked hotels across South Africa and the world —
          with honest pricing, live availability, and instant confirmation.
        </p>
      </section>

      <section className="about-grid">
        <div className="about-card">
          <h2>Our story</h2>
          <p>
            Founded in Johannesburg, StayEase started with a simple idea: booking a hotel should
            take minutes, not hours. We partner directly with independent hotels — from Camps Bay
            beachfronts to Winelands estates — so you get great rates and they get fair exposure.
          </p>
        </div>
        <div className="about-card">
          <h2>What we offer</h2>
          <ul>
            <li>Live room availability, updated with every booking</li>
            <li>Transparent pricing in Rand — no hidden fees</li>
            <li>Free cancellation up to 48 hours before check-in</li>
            <li>24/7 guest support, wherever you are</li>
          </ul>
        </div>
        <div className="about-card">
          <h2>Where we operate</h2>
          <p>
            Across South Africa — Cape Town, Johannesburg, Durban, Pretoria and Stellenbosch — plus
            international favourites in Paris, Ubud and New York, with new destinations added
            every month.
          </p>
        </div>
      </section>

      <section className="about-cta">
        <h2>Ready to escape?</h2>
        <Link to="/hotels" className="btn btn-primary">
          Explore hotels
        </Link>
      </section>
    </div>
  )
}

export default About