import React, { useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef } from 'react'
import axios from 'axios'
import { useCursor } from '../contexts/CursorContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.2 })
  const { setCursorType, setCursorText } = useCursor()

  const [showExperienceModal, setShowExperienceModal] = useState(false)
  const [showClientsModal, setShowClientsModal] = useState(false)
  const [clients, setClients] = useState([])
  const [education, setEducation] = useState([])
  const [experiences, setExperiences] = useState([])
  const [loadingClients, setLoadingClients] = useState(false)
  const [loadingEducation, setLoadingEducation] = useState(false)
  const [loadingExperiences, setLoadingExperiences] = useState(false)

  useEffect(() => {
    if (showClientsModal && clients.length === 0) {
      setLoadingClients(true)
      axios.get(`${API_URL}clients/`)
        .then(res => setClients(res.data))
        .catch(err => console.error('Failed to fetch clients:', err))
        .finally(() => setLoadingClients(false))
    }
  }, [showClientsModal])

  useEffect(() => {
    setLoadingEducation(true)
    axios.get(`${API_URL}education/`)
      .then(res => setEducation(res.data))
      .catch(err => console.error('Failed to fetch education:', err))
      .finally(() => setLoadingEducation(false))
  }, [])

  useEffect(() => {
    setLoadingExperiences(true)
    axios.get(`${API_URL}experience/`)
      .then(res => setExperiences(res.data))
      .catch(err => console.error('Failed to fetch experiences:', err))
      .finally(() => setLoadingExperiences(false))
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  }
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  }
  const overlayVariants = {
    hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 }
  }
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.8, y: 30, transition: { duration: 0.2 } }
  }

  // Map education level to display info
  const eduCircleData = [
    { key: 'primary', label: 'Primary', fallback: '2011 - 2017', position: 'top' },
    { key: 'secondary', label: 'Secondary', fallback: '2018 - 2021', position: 'right' },
    { key: 'advanced', label: 'Advanced', fallback: '2022 - 2024', position: 'bottom' },
    { key: 'university', label: 'University', fallback: '2024 - Ongoing', position: 'left' },
  ]

  const getEduForLevel = (level) => education.find(e => e.level === level)

  return (
    <section id="about" className="about" ref={ref}>
      <div className="container">
        <motion.div
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2 variants={itemVariants} className="section-title">About Me</motion.h2>
          <motion.div variants={itemVariants} className="about-text">
            <p>
              I'm a passionate Full-Stack and Mobile Developer with expertise in creating
              modern, responsive web and mobile applications. With a strong foundation in
              both frontend and backend technologies, I bring ideas to life through clean,
              efficient code and intuitive user experiences.
            </p>
            <p>
              My journey in software development started with a curiosity about how things
              work, and it has evolved into a passion for building solutions that make a
              difference. I enjoy working with cutting-edge technologies and am always
              eager to learn and adapt to new challenges.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="about-stats">
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onMouseEnter={() => { setCursorType('hover'); setCursorText('View Work →') }}
              onMouseLeave={() => { setCursorType('default'); setCursorText('') }}
              onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
            >
              Projects Completed
            </motion.button>
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onMouseEnter={() => { setCursorType('hover'); setCursorText('View Details →') }}
              onMouseLeave={() => { setCursorType('default'); setCursorText('') }}
              onClick={() => setShowExperienceModal(true)}
            >
              Years of Experience
            </motion.button>
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onMouseEnter={() => { setCursorType('hover'); setCursorText('View Clients →') }}
              onMouseLeave={() => { setCursorType('default'); setCursorText('') }}
              onClick={() => setShowClientsModal(true)}
            >
              Happy Clients
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Circular Education Section */}
        <motion.div
          className="education-circle-section"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="education-circle-title">Education Journey</h3>
          <p className="education-circle-subtitle">My academic path and continuous learning</p>

          {loadingEducation ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading education...</p>
          ) : (
            <div className="edu-circle-container">
              {/* Connecting ring */}
              <div className="edu-ring"></div>
              <div className="edu-ring-pulse"></div>

              {/* Center circle */}
              <motion.div
                className="edu-center"
                initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.6, delay: 0.8, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="edu-center-inner">
                  <span className="edu-center-icon">🎓</span>
                  <p>Bachelor of Science<br />Information Technology</p>
                  <span className="edu-center-badge">2024 - Ongoing</span>
                </div>
              </motion.div>

              {/* 4 surrounding ovals */}
              {eduCircleData.map((item, idx) => {
                const edu = getEduForLevel(item.key)
                const yearText = edu ? `${edu.start_year} - ${edu.end_year || 'Ongoing'}` : item.fallback
                const courseText = edu?.course || ''
                const instText = edu?.institution || item.label
                return (
                  <motion.div
                    key={item.key}
                    className={`edu-oval edu-oval-${item.position}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.5, delay: 1 + idx * 0.15, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.08, y: -5 }}
                  >
                    <div className="edu-oval-inner">
                      <span className="edu-oval-year">{yearText}</span>
                      <h4>{instText}</h4>
                      <span className="edu-oval-level">{item.label}</span>
                      {courseText && <p className="edu-oval-course">{courseText}</p>}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Experience Modal - Dynamic from API */}
      <AnimatePresence>
        {showExperienceModal && (
          <motion.div
            className="modal-overlay"
            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
            onClick={() => setShowExperienceModal(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}
          >
            <motion.div
              variants={modalVariants} initial="hidden" animate="visible" exit="exit"
              onClick={(e) => e.stopPropagation()}
              style={{ background: 'var(--bg-primary)', borderRadius: '1.5rem', border: '1px solid var(--border)', padding: '2.5rem', maxWidth: '550px', width: '100%', position: 'relative', boxShadow: '0 25px 50px var(--shadow-lg)' }}
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                onClick={() => setShowExperienceModal(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '1.2rem' }}
              >×</motion.button>

              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>2 Years of Experience</h3>
              <p style={{ color: 'var(--accent)', fontWeight: '600', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Building digital solutions with passion and precision</p>

              {loadingExperiences ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>Loading...</p>
              ) : experiences.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {experiences.map((item, index) => (
                    <motion.div
                      key={item.id || index}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.1 }}
                      style={{ display: 'flex', gap: '1rem', padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px solid var(--border)', alignItems: 'flex-start' }}
                    >
                      <span style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0 }}>{item.icon || '💼'}</span>
                      <div>
                        <h4 style={{ fontSize: '1rem', color: 'var(--secondary)', marginBottom: '0.25rem', fontWeight: '700' }}>{item.title}</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>{item.description}</p>
                        <span style={{ color: 'var(--accent)', fontWeight: '600', fontSize: '0.8rem', marginTop: '0.25rem', display: 'inline-block' }}>{item.years} years · {item.category}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem 0' }}>No experience data. Add from admin dashboard.</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clients Modal */}
      <AnimatePresence>
        {showClientsModal && (
          <motion.div
            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
            onClick={() => setShowClientsModal(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}
          >
            <motion.div
              variants={modalVariants} initial="hidden" animate="visible" exit="exit"
              onClick={(e) => e.stopPropagation()}
              style={{ background: 'var(--bg-primary)', borderRadius: '1.5rem', border: '1px solid var(--border)', padding: '2.5rem', maxWidth: '600px', width: '100%', maxHeight: '80vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 50px var(--shadow-lg)' }}
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                onClick={() => setShowClientsModal(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '1.2rem' }}
              >×</motion.button>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Happy Clients</h3>
              <p style={{ color: 'var(--accent)', fontWeight: '600', marginBottom: '1.5rem', fontSize: '0.95rem' }}>What people say about working with me</p>
              {loadingClients ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>Loading testimonials...</p>
              ) : clients.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {clients.map((client, index) => (
                    <motion.div key={client.id || index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.1 }} style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        {client.image_url ? (
                          <img src={client.image_url} alt={client.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--secondary)' }} />
                        ) : (
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '1.2rem' }}>{client.name.charAt(0)}</div>
                        )}
                        <div>
                          <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.1rem' }}>{client.name}</h4>
                          {client.company && <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: '600' }}>{client.company}</span>}
                          <div style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>{'★'.repeat(client.rating || 5)}</div>
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', fontStyle: 'italic', margin: 0, paddingLeft: '1rem', borderLeft: '3px solid var(--accent)' }}>"{client.testimonial || client.description}"</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>No testimonials available yet.</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default About
