import { createContext, useContext, useEffect, useState } from 'react'
import { subscribeAuth, signIn, signUp, signOutUser } from '../services/firebase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeAuth(setUser)
    return unsubscribe
  }, [])

  const login = (email, password) => {
    console.log('[auth] signIn attempt', email)
    return signIn(email, password)
      .then((data) => setUser(data.user))
      .catch((err) => {
        console.error('[auth] signIn error', err.code, err.message)
        throw err
      })
  }

  const createAccount = (name, email, password) => {
    console.log('[auth] signUp attempt', email)
    return signUp(email, password, name)
      .then((data) => setUser(data.user))
      .catch((err) => {
        console.error('[auth] signUp error', err.code, err.message)
        throw err
      })
  }

  const logout = () => {
    console.log('[auth] signOut')
    return signOutUser()
      .then(() => setUser(null))
      .catch((err) => {
        console.error('[auth] signOut error', err.code, err.message)
        throw err
      })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, createAccount, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}