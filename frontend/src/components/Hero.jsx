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
          Full-Stack & Mobile Developer
        </motion.h2>
        <motion.p variants={itemVariants} className="hero-description">
          Crafting digital experiences with modern technologies and 
          innovative solutions. Passionate about clean code and user-centric design.
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