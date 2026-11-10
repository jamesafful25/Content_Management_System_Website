import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/index.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('cms_user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('cms_token'))
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await authAPI.login({ email, password })
      localStorage.setItem('cms_token', data.token)
      localStorage.setItem('cms_user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('cms_token')
    localStorage.removeItem('cms_user')
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = !!token && !!user
  const isSuperAdmin = user?.role === 'superadmin'
  const isEditorOrAbove = ['superadmin', 'editor'].includes(user?.role)

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isSuperAdmin, isEditorOrAbove, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
