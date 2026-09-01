import AppRouter from './router.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <main className="app-main">
          <AppRouter />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App