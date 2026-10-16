import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'))

  // Save token and user after login or register
  const saveLogin = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
  }

  const login = async (email, password, role) => {
    const { data } = await api.post('/auth/login', { email, password, role })
    saveLogin(data)
    return data.user
  }

  const register = async (form) => {
    const { data } = await api.post('/auth/register', form)
    saveLogin(data)
    return data.user
  }

  // Replace the saved user after a profile change
  const updateUser = (data) => {
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
