import React, { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import axios from 'axios'
import { useCursor } from '../contexts/CursorContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/'

const COUNTRIES = [
  { code: 'TZ', name: 'Tanzania', dial: '+255', flag: '🇹🇿' },
  { code: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪' },
  { code: 'UG', name: 'Uganda', dial: '+256', flag: '🇺🇬' },
  { code: 'RW', name: 'Rwanda', dial: '+250', flag: '🇷🇼' },
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵' },
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳' },
  { code: 'AE', name: 'UAE', dial: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦' },
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
  { code: 'EG', name: 'Egypt', dial: '+20', flag: '🇪🇬' },
  { code: 'BR', name: 'Brazil', dial: '+55', flag: '🇧🇷' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', dial: '+31', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', dial: '+46', flag: '🇸🇪' },
  { code: 'KR', name: 'South Korea', dial: '+82', flag: '🇰🇷' },
]

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', country_code: 'TZ', subject: '', message: ''
  })
  const [phoneError, setPhoneError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')
  const [submitMessage, setSubmitMessage] = useState('')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.3 })
  const { setCursorType, setCursorText } = useCursor()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (name === 'phone' || name === 'country_code') setPhoneError('')
  }

  const validatePhone = (phone, countryCode) => {
    if (!phone) return true // phone is optional
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 7) return 'Phone number is too short'
    if (digits.length > 15) return 'Phone number is too long'
    if (!/^[0-9+\-\s()]+$/.test(phone)) return 'Phone contains invalid characters'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validatePhone(formData.phone, formData.country_code)
    if (err) { setPhoneError(err); return }

    setIsSubmitting(true)
    setSubmitStatus('')
    setSubmitMessage('')

    try {
      const payload = { ...formData }
      // If phone doesn't start with +, prepend country dial code
      if (payload.phone && !payload.phone.startsWith('+')) {
        const country = COUNTRIES.find(c => c.code === payload.country_code)
        if (country) {
          const digits = payload.phone.replace(/^0+/, '').replace(/\D/g, '')
          payload.phone = country.dial + digits
        }
      }
      await axios.post(`${API_URL}contact/`, payload, {
        headers: { 'Content-Type': 'application/json' }
      })
      setSubmitStatus('success')
      setSubmitMessage('Message sent successfully! You will be notified on your phone when I reply.')
      setFormData({ name: '', email: '', phone: '', country_code: 'TZ', subject: '', message: '' })
    } catch (error) {
      if (error.response?.data) {
        const data = error.response.data
        if (data.phone) setPhoneError(Array.isArray(data.phone) ? data.phone[0] : data.phone)
        setSubmitStatus('error')
        setSubmitMessage(data.phone ? 'Please fix the phone number.' : (data.detail || data.error || 'Failed to send message.'))
      } else if (error.request) {
        setSubmitStatus('error')
        setSubmitMessage('Unable to connect to server. Please check your connection.')
      } else {
        setSubmitStatus('error')
        setSubmitMessage('An error occurred. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    { icon: '📍', title: 'Location', value: 'Dar es salaam, Tanzania', description: 'Available for remote work worldwide' },
  ]
  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/m1n4h', icon: '🐙' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/aminakalonge', icon: '💼' },
    { name: 'Twitter', url: 'https://twitter.com/aminakalonge', icon: '🐦' },
    { name: 'Instagram', url: 'https://instagram.com/aminakalonge', icon: '📷' }
  ]
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }
  const itemVariants = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } } }

  return (
    <section id="contact" className="contact" ref={ref}>
      <div className="container">
        <motion.h2 className="section-title"
          initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} transition={{ duration: 0.6 }}>
          Get In Touch
        </motion.h2>
        <motion.p className="section-subtitle"
          initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.6, delay: 0.2 }}>
          Let's work together to bring your ideas to life
        </motion.p>

        <div className="contact-content">
          <motion.div className="contact-info" variants={containerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
            {contactInfo.map((info, index) => (
              <motion.div key={index} className="contact-card" variants={itemVariants} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                <div className="contact-icon">{info.icon}</div>
                <h3>{info.title}</h3>
                <p className="contact-value">{info.value}</p>
                <p className="contact-description">{info.description}</p>
              </motion.div>
            ))}
            <motion.div className="social-links" variants={itemVariants}>
              <h4>Follow Me</h4>
              <div className="social-icons">
                {socialLinks.map((social, index) => (
                  <motion.a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="social-link"
                    whileHover={{ scale: 1.2, y: -5 }} whileTap={{ scale: 0.9 }}
                    onMouseEnter={() => { setCursorType('hover'); setCursorText(`${social.name} →`) }}
                    onMouseLeave={() => { setCursorType('default'); setCursorText('') }}>
                    <span className="social-icon">{social.icon}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div className="contact-form-container"
            initial={{ opacity: 0, x: 50 }} animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group phone-group">
                  <div className="phone-input-wrap">
                    <select name="country_code" value={formData.country_code} onChange={handleChange} className="country-select">
                      {COUNTRIES.map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.dial} {c.name}</option>
                      ))}
                    </select>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                      placeholder="Phone Number" className={phoneError ? 'input-error' : ''} />
                  </div>
                  {phoneError && <span className="field-error">{phoneError}</span>}
                  <span className="field-hint">Select your country, then enter your number. You'll receive my reply via SMS.</span>
                </div>
                <div className="form-group">
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required />
                </div>
              </div>

              <div className="form-group full-width">
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" rows="6" required></textarea>
              </div>

              <div className="form-actions">
                <motion.button type="submit" className={`submit-btn ${isSubmitting ? 'submitting' : ''}`} disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </motion.button>
              </div>

              {submitStatus === 'success' && (
                <motion.div className="form-message success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {submitMessage}
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div className="form-message error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {submitMessage}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
