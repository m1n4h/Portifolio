import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { useCursor } from '../contexts/CursorContext'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const { setCursorType, setCursorText } = useCursor()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Education', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
  ]

  return (
    <motion.header
      className={`header ${scrolled ? 'scrolled' : ''}`}
      data-theme={isDark ? 'dark' : 'light'}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="header-container">
        <div className="logo">
          <a href="#hero" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src="/images/logo.png"
              alt="M1N4H"
              className="logo-img"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'block' }}
            />
            <span className="logo-fallback" style={{ display: 'none' }}>M1N4H</span>
          </a>
        </div>

        <div className="nav-menu">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onMouseEnter={() => { setCursorType('hover'); setCursorText(`Go to ${item.name}`) }}
              onMouseLeave={() => { setCursorType('default'); setCursorText('') }}
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <motion.button
            className="theme-toggle"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onMouseEnter={() => { setCursorType('hover'); setCursorText(isDark ? 'Light Mode' : 'Dark Mode') }}
            onMouseLeave={() => { setCursorType('default'); setCursorText('') }}
          >
            {isDark ? '☀️' : '🌙'}
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
