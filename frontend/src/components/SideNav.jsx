import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCursor } from '../contexts/CursorContext';

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { setCursorType } = useCursor();

  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About'  },
    { id: 'skills', label: 'Skills'  },
    { id: 'projects', label: 'Projects'},
    { id: 'contact', label: 'Contact' }
  ];

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSectionClick = (sectionId) => {
    setIsOpen(false);
    
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 70;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 150);
  };

  // Only render on mobile devices
  if (!isMobile) {
    return null;
  }

  return (
    <>
      <motion.button 
        className="sidenav-toggle"
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setCursorType('hover')}
        onMouseLeave={() => setCursorType('default')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open navigation menu"
      >
        <span>☰</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              className="sidenav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div 
              className="sidenav"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="sidenav-header">
                <h2>Navigation</h2>
                <motion.button 
                  className="closebtn"
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close navigation menu"
                >
                  ×
                </motion.button>
              </div>

              <div className="sidenav-content">
                {sections.map((section) => (
                  <motion.a
                    key={section.id}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSectionClick(section.id);
                    }}
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => setCursorType('hover')}
                    onMouseLeave={() => setCursorType('default')}
                  >
                    <span className="nav-icon">{section.icon}</span>
                    {section.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SideNav;