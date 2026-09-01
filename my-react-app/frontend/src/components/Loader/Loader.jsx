import './Loader.css'

function Loader({ label = 'Loading…' }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader-spinner" />
      <span>{label}</span>
    </div>
  )
}

export default Loader