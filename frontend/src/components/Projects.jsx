import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import axios from 'axios'
import { useCursor } from '../contexts/CursorContext'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [displayedProjects, setDisplayedProjects] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.3 })
  const { setCursorType, setCursorText } = useCursor()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/projects/')
        setProjects(response.data)
        setDisplayedProjects(response.data.slice(0, 3))
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }
    fetchProjects()
  }, [])

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

        {/* Project Filter */}
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

        {/* Projects Grid */}
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
                            <span>🚀</span>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="project-placeholder">
                      <span>🚀</span>
                    </div>
                  )}
                  <div className="project-overlay">
                    <div className="project-links">
                      {project.live_url && (
                        <motion.a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link live"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onMouseEnter={() => {
                            setCursorType('hover')
                            setCursorText('View Live →')
                          }}
                          onMouseLeave={() => {
                            setCursorType('default')
                            setCursorText('')
                          }}
                        >
                          Live Demo
                        </motion.a>
                      )}
                      {project.github_url && (
                        <motion.a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link github"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onMouseEnter={() => {
                            setCursorType('hover')
                            setCursorText('View Code →')
                          }}
                          onMouseLeave={() => {
                            setCursorType('default')
                            setCursorText('')
                          }}
                        >
                          GitHub
                        </motion.a>
                      )}
                    </div>
                  </div>
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

        {/* See More Button */}
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
    </section>
  )
}

export default Projects