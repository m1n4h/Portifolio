import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.3 })

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
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="about" className="about" ref={ref}>
      <div className="container">
        <motion.div
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2 variants={itemVariants} className="section-title">
            About Me
          </motion.h2>
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
            <div className="stat">
              <h3>50+</h3>
              <p>Projects Completed</p>
            </div>
            <div className="stat">
              <h3>3+</h3>
              <p>Years Experience</p>
            </div>
            <div className="stat">
              <h3>30+</h3>
              <p>Happy Clients</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About