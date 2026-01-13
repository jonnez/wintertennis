import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = React.createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('github_token') || null
  })
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const login = (accessToken) => {
    localStorage.setItem('github_token', accessToken)
    // Fetch user info
    fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('github_user', JSON.stringify(data))
      })
      .catch(console.error)
  }

  const logout = () => {
    localStorage.removeItem('github_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
