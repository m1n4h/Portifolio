import React, { createContext, useContext, useState, useEffect } from 'react'

const AdminThemeContext = createContext()

export const useAdminTheme = () => {
  const context = useContext(AdminThemeContext)
  if (!context) {
    throw new Error('useAdminTheme must be used within AdminThemeProvider')
  }
  return context
}

export const AdminThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('admin-theme')
    return saved ? saved === 'dark' : false
  })

  useEffect(() => {
    localStorage.setItem('admin-theme', isDark ? 'dark' : 'light')
    document.body.setAttribute('data-admin-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark(!isDark)

  return (
    <AdminThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  )
}
