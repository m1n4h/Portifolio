import React, { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import axios from 'axios'
import { useCursor } from '../contexts/CursorContext'
import SectionBackground from './SectionBackground'

const API_URL = '/api/'

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
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [phoneError, setPhoneError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')
  const [submitMessage, setSubmitMessage] = useState('')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.3 })
  const { setCursorType, setCursorText } = useCursor()

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        return ''
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email'
        return ''
      case 'phone':
        if (!value) return '' // phone is optional
        const digits = value.replace(/\D/g, '')
        if (digits.length < 7) return 'Phone number is too short'
        if (digits.length > 15) return 'Phone number is too long'
        return ''
      case 'subject':
        if (!value.trim()) return 'Subject is required'
        if (value.trim().length < 3) return 'Subject must be at least 3 characters'
        return ''
      case 'message':
        if (!value.trim()) return 'Message is required'
        if (value.trim().length < 10) return 'Message must be at least 10 characters'
        return ''
      default:
        return ''
    }
  }

  const validateAll = () => {
    const newErrors = {}
    let isValid = true
    ;['name', 'email', 'subject', 'message'].forEach(field => {
      const error = validateField(field, formData[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })
    return { isValid, errors: newErrors }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
    if (name === 'phone' || name === 'country_code') setPhoneError('')
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const { isValid, errors: validationErrors } = validateAll()
    
    // Mark all fields as touched
    setTouched({ name: true, email: true, phone: true, subject: true, message: true })
    
    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('')
    setSubmitMessage('')

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'
      
      const response = await axios.post(`${API_URL}contact/`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Message sent successfully:', response.data)
      
      setSubmitStatus('success')
      setSubmitMessage('✅ Message sent successfully! I\'ll get back to you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      
      if (error.response) {
        setSubmitStatus('error')
        setSubmitMessage(error.response.data.error || '❌ Failed to send message. Please try again.')
      } else if (error.request) {
        setSubmitStatus('error')
        setSubmitMessage('❌ Unable to connect to server. Please check your connection.')
      } else {
        setSubmitStatus('error')
        setSubmitMessage('❌ An error occurred. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      value: 'aminakalonge1@gmail.com',
      description: 'Drop me an email anytime'
    },
    {
      icon: '📱',
      title: 'Phone',
      value: '+255 769 526 640',
      description: 'Available Mon–Fri, 9am–6pm EAT'
    },
    {
      icon: '📍',
      title: 'Location',
      value: 'Dar es Salaam, Tanzania',
      description: 'Available for remote work worldwide'
    },
  ]

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/m1n4h', icon: '🐙' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/aminakalonge', icon: '💼' },
    { name: 'Twitter', url: 'https://twitter.com/aminakalonge', icon: '🐦' },
    { name: 'Instagram', url: 'https://instagram.com/aminakalonge', icon: '📷' }
  ]
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }
  const itemVariants = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } } }

  const getFieldClass = (fieldName) => {
    if (errors[fieldName] && touched[fieldName]) return 'input-error'
    if (!errors[fieldName] && touched[fieldName] && formData[fieldName]) return 'input-valid'
    return ''
  }

  return (
    <section id="contact" className="contact" ref={ref}>
      <SectionBackground variant="cool" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
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
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number (Optional)"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your Message *"
                  rows="6"
                  required
                ></textarea>
                {errors.message && touched.message && <span className="field-error">{errors.message}</span>}
              </div>

              <div className="form-actions">
                <motion.button
                  type="submit"
                  className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </motion.button>
              </div>

              {submitStatus === 'success' && (
                <motion.div 
                  className="form-message success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {submitMessage}
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div 
                  className="form-message error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {submitMessage}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      <style>{`
        .field-error {
          display: block;
          color: #e94560;
          font-size: 0.75rem;
          margin-top: 4px;
          animation: shakeError 0.3s ease;
        }
        .input-error {
          border-color: #e94560 !important;
          box-shadow: 0 0 0 2px rgba(233, 69, 96, 0.2) !important;
        }
        .input-valid {
          border-color: #27ae60 !important;
          box-shadow: 0 0 0 2px rgba(39, 174, 96, 0.2) !important;
        }
        @keyframes shakeError {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </section>
  )
}

export default Contact
