import React from 'react'
import { motion } from 'framer-motion'
import { useCursor } from '../contexts/CursorContext'

const Hero = () => {
  const { setCursorType, setCursorText } = useCursor()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="hero" className="hero">
      <motion.div
        className="hero-content container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="hero-title">
          Amina Kalonge
        </motion.h1>
        <motion.h2 variants={itemVariants} className="hero-subtitle">
          software Engineer | Cybersecurity Enthusiast | Mobile App Developer
         
        </motion.h2>
        <motion.p variants={itemVariants} className="hero-description">
          I am a passionate Software Developer with a strong focus on Mobile Application
           development, backed by a solid foundation in Cybersecurity and Networking 
           fundamentals. I believe that great apps aren't just functional—they're secure, efficient, and built with the user's safety in mind.
        </motion.p>
        <motion.div variants={itemVariants} className="hero-buttons">
          <motion.button 
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => {
              setCursorType('hover')
              setCursorText('View Work →')
            }}
            onMouseLeave={() => {
              setCursorType('default')
              setCursorText('')
            }}
            onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
          >
            View My Work
          </motion.button>
          <motion.button 
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => {
              setCursorType('hover')
              setCursorText('Get in Touch →')
            }}
            onMouseLeave={() => {
              setCursorType('default')
              setCursorText('')
            }}
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
          >
            Get in Touch
          </motion.button>
        </motion.div>
      </motion.div>
      
      {/* Animated background elements */}
      <div className="hero-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>
    </section>
  )
}

export default Hero