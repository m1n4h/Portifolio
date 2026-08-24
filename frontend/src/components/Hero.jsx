import React from 'react'
import { motion } from 'framer-motion'
import { useCursor } from '../contexts/CursorContext'

const Hero = () => {
  const { setCursorType, setCursorText } = useCursor()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  }
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  }

  return (
    <section id="hero" className="hero">
      <div className="hero-inner container">
        {/* Left - Text */}
        <motion.div
          className="hero-text"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p variants={itemVariants} className="hero-greeting">Hello, I'm</motion.p>
          <motion.h1 variants={itemVariants} className="hero-title">Amina Kalonge</motion.h1>
          <motion.h2 variants={itemVariants} className="hero-subtitle">
            Software Engineer | Cybersecurity Enthusiast | Mobile App Developer
          </motion.h2>
          <motion.p variants={itemVariants} className="hero-description">
            I am a passionate Software Developer with a strong focus on Mobile Application
            development, backed by a solid foundation in Cybersecurity and Networking
            fundamentals. I believe that great apps aren't just functional—they're secure, efficient, and built with the user's safety in mind.
          </motion.p>
          <motion.div variants={itemVariants} className="hero-buttons">
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onMouseEnter={() => { setCursorType('hover'); setCursorText('View Work') }}
              onMouseLeave={() => { setCursorType('default'); setCursorText('') }}
              onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
            >
              View My Work
            </motion.button>
            <motion.button
              className="btn-secondary"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onMouseEnter={() => { setCursorType('hover'); setCursorText('Get in Touch') }}
              onMouseLeave={() => { setCursorType('default'); setCursorText('') }}
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            >
              Get in Touch
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right - Profile Image */}
        <motion.div
          className="hero-image-wrap"
          initial={{ opacity: 0, x: 60, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        >
          <div className="hero-image-glow"></div>
          <div className="hero-image-ring"></div>
          <div className="hero-image-ring-2"></div>
          <motion.img
            src="/images/profile.jpg"
            alt="Amina Kalonge"
            className="hero-profile-img"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextElementSibling.style.display = 'flex'
            }}
          />
          <div className="hero-profile-fallback" style={{ display: 'none' }}>
            <span>AK</span>
          </div>
          {/* Floating badges */}
          <motion.div className="hero-badge hero-badge-1" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            <span>2+ Years</span>
          </motion.div>
          <motion.div className="hero-badge hero-badge-2" animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
            <span>Mobile Dev</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Background */}
      <div className="hero-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>
    </section>
  )
}

export default Hero
