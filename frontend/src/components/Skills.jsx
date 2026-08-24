import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/'
const REFRESH_INTERVAL = 30000

const Skills = () => {
  const [skills, setSkills] = useState([])
  const [displayedSkills, setDisplayedSkills] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.3 })

  const fetchSkills = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}skills/`)
      setSkills(response.data)
      setDisplayedSkills(prev => {
        if (prev.length === 0 || JSON.stringify(prev) !== JSON.stringify(response.data.slice(0, 3))) {
          return response.data.slice(0, 3)
        }
        return prev
      })
    } catch (error) {
      console.error('Error fetching skills:', error)
    }
  }, [])

  useEffect(() => {
    fetchSkills()
    const interval = setInterval(fetchSkills, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchSkills])

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
    const filtered = category === 'all' ? skills : skills.filter(skill => skill.category === activeCategory)
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

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
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
    <section id="skills" className="skills" ref={ref}>
      <div className="container">
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
            <button
              key={category}
              className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <motion.div 
          className="skills-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
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
                <div className="skill-icon-wrapper">
                  <div className="skill-orbit-ring" />
                  <div className="skill-icon">
                    {skill.image_url ? (
                      <img 
                        src={skill.image_url} 
                        alt={skill.name} 
                        className="skill-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          const fallback = document.createElement('span');
                          fallback.textContent = skill.icon || '💻';
                          e.target.parentElement.appendChild(fallback);
                        }}
                      />
                    ) : (
                      <span>{skill.icon || '💻'}</span>
                    )}
                  </div>
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