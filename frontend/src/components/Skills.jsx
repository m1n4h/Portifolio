import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import axios from 'axios'
import SectionBackground from './SectionBackground'

const API_URL = '/api/'
const REFRESH_INTERVAL = 30000

const Skills = () => {
  const [skills, setSkills] = useState([])
  const [displayedSkills, setDisplayedSkills] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.3 })

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'
        const response = await axios.get(`${API_URL}skills/`)
        setSkills(response.data)
        setDisplayedSkills(response.data.slice(0, 3))
      } catch (error) {
        console.error('Error fetching skills:', error)
      }
    }
    fetchSkills()
  }, [])

  const categories = ['all', 'frontend', 'backend', 'mobile', 'database', 'tools', 'design', 'devops']
  
  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory)

  const handleShowMore = () => {
    setShowAll(!showAll)
    if (!showAll) {
      setDisplayedSkills(filteredSkills)
    } else {
      setDisplayedSkills(filteredSkills.slice(0, 3))
    }
  }

  const handleCategoryFilter = (category) => {
    setActiveCategory(category)
    setShowAll(false)
    const filtered = category === 'all' ? skills : skills.filter(skill => skill.category === category)
    setDisplayedSkills(filtered.slice(0, 3))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: (i) => ({
      opacity: 0,
      y: 60,
      rotateX: 15,
      scale: 0.85,
    }),
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay: i * 0.1,
      },
    }),
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -30,
      transition: { duration: 0.3 },
    },
  }

  const floatAnimation = {
    y: [-4, 4, -4],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }

  return (
    <section id="skills" className="skills" ref={ref}>
      <SectionBackground variant="cool" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          Skills & Technologies
        </motion.h2>

        {/* Category Filter */}
        <motion.div
          className="skills-filter"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map(category => (
            <motion.button
              key={category}
              className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          className="skills-grid"
          layout
        >
          {displayedSkills.length > 0 ? (
            displayedSkills.map(skill => (
              <motion.div
                key={skill.id}
                className="skill-card"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="skill-icon">
                  {skill.image_url ? (
                    <img 
                      src={skill.image_url} 
                      alt={skill.name} 
                      className="skill-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<span>💻</span>`;
                      }}
                    />
                  ) : (
                    <span>{skill.icon || '💻'}</span>
                  )}
                </div>
                <h3 className="skill-name">{skill.name}</h3>
                <div className="skill-progress">
                  <div 
                    className="skill-progress-bar"
                    style={{ width: `${skill.proficiency}%` }}
                  ></div>
                </div>
                <span className="skill-percentage">{skill.proficiency}%</span>
                {skill.description && (
                  <p className="skill-description">{skill.description}</p>
                )}
              </motion.div>
            ))
          ) : (
            <p className="no-skills">No skills found in this category.</p>
          )}
        </motion.div>

        {/* See More Button */}
        {filteredSkills.length > 3 && (
          <motion.div 
            className="see-more-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button 
              className="see-more-btn"
              onClick={handleShowMore}
            >
              {showAll ? 'Show Less' : `See More (${filteredSkills.length - 3} more)`}
            </button>
          </motion.div>
        )}
      </div>

      <style>{`
        .skill-icon-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .skill-orbit-ring {
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border-radius: 50%;
          border: 2px solid transparent;
          border-top-color: var(--accent, #1a6fb5);
          border-right-color: var(--accent, #1a6fb5);
          animation: spinOrbit 2s linear infinite;
          pointer-events: none;
        }

        .skill-orbit-ring::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 6px;
          height: 6px;
          background: var(--accent, #1a6fb5);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: pulseDot 2s ease-in-out infinite;
        }

        .skill-icon {
          position: relative;
          z-index: 1;
          width: 72px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          overflow: hidden;
        }

        .skill-icon .skill-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          perspective: 1000px;
        }

        .skill-card {
          transform-style: preserve-3d;
          will-change: transform;
        }

        @keyframes spinOrbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
        }
      `}</style>
    </section>
  )
}

export default Skills
