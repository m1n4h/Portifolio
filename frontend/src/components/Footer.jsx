import React from 'react'
import { motion } from 'framer-motion'
import { useCursor } from '../contexts/CursorContext'

const Footer = () => {
  const { setCursorType, setCursorText } = useCursor()

  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
  ]

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/aminakalonge', icon: '/images/social/github.svg' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/aminakalonge', icon: '/images/social/linkedin.svg' },
    { name: 'Twitter', url: 'https://twitter.com/aminakalonge', icon: '/images/social/twitter.svg' },
    { name: 'Instagram', url: 'https://instagram.com/aminakalonge', icon: '/images/social/instagram.svg' }
  ]

  return (  
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Section */}
          <motion.div
            className="footer-brand"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <img src="/images/logo.png" alt="M1N4H" className="footer-logo" onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'block' }} />
            <span className="footer-logo-fallback" style={{ display: 'none' }}>M1N4H</span>
            <p style={{ marginTop: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Passionate Software Developer crafting secure, beautiful digital experiences.
            </p>
          </motion.div>

          <motion.div 
            className="footer-links"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4>Quick Links</h4>
            <ul>
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    onMouseEnter={() => {
                      setCursorType('hover')
                      setCursorText(`Go to ${link.name} →`)
                    }}
                    onMouseLeave={() => {
                      setCursorType('default')
                      setCursorText('')
                    }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="footer-contact"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4>Get In Touch</h4>
            <div className="contact-item">
              <span>📧</span>
              <a href="mailto:aminakalonge1@gmail.com">aminakalonge1@gmail.com</a>
            </div>
            <div className="contact-item">
              <span>📱</span>
              <a href="tel:+255769526640">+255 769 526 640</a>
            </div>
            <div className="contact-item">
              <span>📍</span>
              <span>Dar es salaam, Tanzania</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="footer-copyright">
            &copy; {currentYear} Amina Kalonge. All rights reserved.
          </p>
          <p className="footer-made-with">
            Made with <span className="heart"></span> using React & Django
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
