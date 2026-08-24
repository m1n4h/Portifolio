import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import axios from 'axios'
import { useCursor } from '../contexts/CursorContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/'
const REFRESH_INTERVAL = 30000

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [displayedProjects, setDisplayedProjects] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedProject, setSelectedProject] = useState(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.3 })
  const { setCursorType, setCursorText } = useCursor()

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}projects/`)
      setProjects(response.data)
      setDisplayedProjects(prev => {
        if (prev.length === 0 || JSON.stringify(prev) !== JSON.stringify(response.data.slice(0, 3))) {
          return response.data.slice(0, 3)
        }
        return prev
      })
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
    const interval = setInterval(fetchProjects, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchProjects])

  const categories = ['all', 'web', 'mobile', 'desktop']

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter)

  const handleShowMore = () => {
    setShowAll(!showAll)
    if (!showAll) {
      setDisplayedProjects(filteredProjects)
    } else {
      setDisplayedProjects(filteredProjects.slice(0, 3))
    }
  }

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    setShowAll(false)
    const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter)
    setDisplayedProjects(filtered.slice(0, 3))
  }

  const handleCardClick = (project) => {
    setSelectedProject(project)
  }

  const closeModal = () => {
    setSelectedProject(null)
  }

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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  }

  return (
    <section id="projects" className="projects" ref={ref}>
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          Featured Projects
        </motion.h2>

        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          A collection of my recent work and personal projects
        </motion.p>

        <motion.div
          className="projects-filter"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
              onClick={() => handleFilterChange(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </motion.div>

        <motion.div
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {displayedProjects.length > 0 ? (
            displayedProjects.map(project => (
              <motion.div
                key={project.id}
                className="project-card"
                variants={itemVariants}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => handleCardClick(project)}
                style={{ cursor: 'pointer' }}
              >
                <div className="project-image">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="project-placeholder">
                            <img src="/images/icons/placeholder-project.svg" alt="Project" onerror="this.onerror=null;this.style.display='none'" />
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="project-placeholder">
                      <img
                        src="/images/icons/placeholder-project.svg"
                        alt="Project"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-technologies">
                    {project.technologies && project.technologies.split(',').map((tech, index) => (
                      <span key={index} className="tech-tag">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="project-category">
                    <span className={`category-badge ${project.category}`}>
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="featured-badge">Featured</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="no-projects"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p>No projects found in the {activeFilter} category.</p>
            </motion.div>
          )}
        </motion.div>

        {filteredProjects.length > 3 && (
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
              {showAll ? 'Show Less' : `See More (${filteredProjects.length - 3} more)`}
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="project-modal-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeModal}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
          >
            <motion.div
              className="project-modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#1a1a2e',
                borderRadius: '16px',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative'
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '24px',
                  cursor: 'pointer',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
                onMouseEnter={() => setCursorType('hover')}
                onMouseLeave={() => setCursorType('default')}
              >
                ✕
              </button>

              <div style={{ padding: '0' }}>
                <div style={{ position: 'relative' }}>
                  {selectedProject.image_url ? (
                    <img
                      src={selectedProject.image_url}
                      alt={selectedProject.title}
                      style={{
                        width: '100%',
                        height: '300px',
                        objectFit: 'cover',
                        borderRadius: '16px 16px 0 0'
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/icons/placeholder-project.svg';
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '300px',
                      backgroundColor: '#16213e',
                      borderRadius: '16px 16px 0 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src="/images/icons/placeholder-project.svg"
                        alt="Project"
                        style={{ opacity: 0.5 }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <h2 style={{ margin: 0, color: '#e94560', fontSize: '1.8rem' }}>
                      {selectedProject.title}
                    </h2>
                    <span
                      className={`category-badge ${selectedProject.category}`}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        backgroundColor: '#16213e',
                        color: '#e94560'
                      }}
                    >
                      {selectedProject.category}
                    </span>
                    {selectedProject.featured && (
                      <span
                        className="featured-badge"
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          backgroundColor: '#f39c12',
                          color: '#000'
                        }}
                      >
                        Featured
                      </span>
                    )}
                    {selectedProject.status && (
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          backgroundColor: selectedProject.status === 'completed' ? '#27ae60' : selectedProject.status === 'in-progress' ? '#f39c12' : '#95a5a6',
                          color: '#fff'
                        }}
                      >
                        {selectedProject.status}
                      </span>
                    )}
                  </div>

                  <p style={{
                    color: '#a0a0a0',
                    lineHeight: '1.7',
                    marginBottom: '24px',
                    fontSize: '1rem'
                  }}>
                    {selectedProject.description}
                  </p>

                  {selectedProject.technologies && (
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ color: '#e94560', marginBottom: '12px', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                        Technologies
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {selectedProject.technologies.split(',').map((tech, index) => (
                          <span
                            key={index}
                            style={{
                              padding: '6px 14px',
                              backgroundColor: '#16213e',
                              color: '#e94560',
                              borderRadius: '20px',
                              fontSize: '0.85rem',
                              border: '1px solid rgba(233, 69, 96, 0.3)'
                            }}
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {selectedProject.github_url && (
                      <a
                        href={selectedProject.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 24px',
                          backgroundColor: '#16213e',
                          color: '#e94560',
                          textDecoration: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          border: '1px solid #e94560',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#e94560';
                          e.target.style.color = '#fff';
                          setCursorType('hover');
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#16213e';
                          e.target.style.color = '#e94560';
                          setCursorType('default');
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        View on GitHub
                      </a>
                    )}
                    {selectedProject.live_url && (
                      <a
                        href={selectedProject.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 24px',
                          backgroundColor: '#e94560',
                          color: '#fff',
                          textDecoration: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#ff6b81';
                          setCursorType('hover');
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#e94560';
                          setCursorType('default');
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        View Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Projects
