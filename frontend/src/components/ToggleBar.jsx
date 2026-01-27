// import React, { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { useCursor } from '../contexts/CursorContext'
// import { useTheme } from '../contexts/ThemeContext'

// const ToggleBar = () => {
//   const [activeSection, setActiveSection] = useState('hero')
//   const [isVisible, setIsVisible] = useState(true)
//   const [lastScrollY, setLastScrollY] = useState(0)
//   const { setCursorType, setCursorText } = useCursor()
//   const { isDark } = useTheme()

//   const sections = [
//     { id: 'hero', label: 'Home', icon: '🏠' },
//     { id: 'about', label: 'About', icon: '👤' },
//     { id: 'skills', label: 'Skills', icon: '💻' },
//     { id: 'projects', label: 'Projects', icon: '🚀' },
//     { id: 'contact', label: 'Contact', icon: '📞' }
//   ]

//   // Handle scroll to detect section changes and hide/show toggle bar
//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY

//       // Hide toggle bar when scrolling down, show when scrolling up
//       if (currentScrollY > lastScrollY && currentScrollY > 100) {
//         setIsVisible(false)
//       } else {
//         setIsVisible(true)
//       }
//       setLastScrollY(currentScrollY)

//       // Update active section based on scroll position
//       const sectionElements = sections.map(section => 
//         document.getElementById(section.id)
//       ).filter(Boolean)

//       const currentSection = sectionElements.find(section => {
//         const rect = section.getBoundingClientRect()
//         return rect.top <= 100 && rect.bottom >= 100
//       })

//       if (currentSection) {
//         setActiveSection(currentSection.id)
//       }
//     }

//     window.addEventListener('scroll', handleScroll, { passive: true })
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [lastScrollY, sections])

//   const handleSectionClick = (sectionId, sectionLabel) => {
//     setActiveSection(sectionId)
//     const element = document.getElementById(sectionId)
//     if (element) {
//       const offset = 80 // Account for fixed header
//       const elementPosition = element.getBoundingClientRect().top
//       const offsetPosition = elementPosition + window.pageYOffset - offset

//       window.scrollTo({
//         top: offsetPosition,
//         behavior: 'smooth'
//       })
//     }
//   }

//   const toggleBarVariants = {
//     hidden: {
//       opacity: 0,
//       y: 50,
//       scale: 0.8
//     },
//     visible: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 25
//       }
//     },
//     exit: {
//       opacity: 0,
//       y: 50,
//       scale: 0.8,
//       transition: {
//         duration: 0.2
//       }
//     }
//   }

//   const buttonVariants = {
//     initial: { scale: 1 },
//     hover: { 
//       scale: 1.1,
//       transition: { type: "spring", stiffness: 400, damping: 10 }
//     },
//     tap: { scale: 0.95 },
//     active: {
//       scale: 1.05,
//       transition: { type: "spring", stiffness: 400, damping: 10 }
//     }
//   }

//   const iconVariants = {
//     initial: { rotate: 0 },
//     hover: { rotate: 360, transition: { duration: 0.5 } },
//     active: { rotate: 0 }
//   }

//   return (
//     <AnimatePresence>
//       {isVisible && (
//         <motion.div 
//           className="toggle-bar"
//           variants={toggleBarVariants}
//           initial="hidden"
//           animate="visible"
//           exit="exit"
//         >
//           {sections.map((section) => (
//             <motion.button
//               key={section.id}
//               className={`toggle-btn ${activeSection === section.id ? 'active' : ''}`}
//               onClick={() => handleSectionClick(section.id, section.label)}
//               variants={buttonVariants}
//               initial="initial"
//               whileHover="hover"
//               whileTap="tap"
//               animate={activeSection === section.id ? "active" : "initial"}
//               onMouseEnter={() => {
//                 setCursorType('hover')
//                 setCursorText(`Go to ${section.label}`)
//               }}
//               onMouseLeave={() => {
//                 setCursorType('default')
//                 setCursorText('')
//               }}
//             >
//               <motion.span 
//                 className="toggle-icon"
//                 variants={iconVariants}
//               >
//                 {section.icon}
//               </motion.span>
//               <span className="toggle-label">{section.label}</span>
              
//               {/* Active indicator dot */}
//               {activeSection === section.id && (
//                 <motion.div 
//                   className="active-indicator"
//                   layoutId="activeIndicator"
//                   initial={false}
//                   transition={{
//                     type: "spring",
//                     stiffness: 500,
//                     damping: 30
//                   }}
//                 />
//               )}
//             </motion.button>
//           ))}
//         </motion.div>
//       )}
//     </AnimatePresence>
//   )
// }

// export default ToggleBar
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCursor } from '../contexts/CursorContext'
import { useTheme } from '../contexts/ThemeContext'

const ToggleBar = () => {
  const [activeSection, setActiveSection] = useState('hero')
  const { setCursorType, setCursorText } = useCursor()
  const { isDark } = useTheme()

  const sections = [
    { id: 'hero', label: 'Home', icon: '🏠' },
    { id: 'about', label: 'About', icon: '👤' },
    { id: 'skills', label: 'Skills', icon: '💻' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'contact', label: 'Contact', icon: '📞' }
  ]

  // Handle scroll to detect section changes only
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section => 
        document.getElementById(section.id)
      ).filter(Boolean)

      const currentSection = sectionElements.find(section => {
        const rect = section.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom >= 100
      })

      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  const handleSectionClick = (sectionId, sectionLabel) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80 // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 },
    active: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  }

  const iconVariants = {
    initial: { rotate: 0 },
    hover: { rotate: 360, transition: { duration: 0.5 } },
    active: { rotate: 0 }
  }

  return (
    <motion.div 
      className="toggle-bar"
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {sections.map((section) => (
        <motion.button
          key={section.id}
          className={`toggle-btn ${activeSection === section.id ? 'active' : ''}`}
          onClick={() => handleSectionClick(section.id, section.label)}
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          animate={activeSection === section.id ? "active" : "initial"}
          onMouseEnter={() => {
            setCursorType('hover')
            setCursorText(`Go to ${section.label}`)
          }}
          onMouseLeave={() => {
            setCursorType('default')
            setCursorText('')
          }}
        >
          <motion.span 
            className="toggle-icon"
            variants={iconVariants}
          >
            {section.icon}
          </motion.span>
          <span className="toggle-label">{section.label}</span>
          
          {/* Active indicator dot */}
          {activeSection === section.id && (
            <motion.div 
              className="active-indicator"
              layoutId="activeIndicator"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
            />
          )}
        </motion.button>
      ))}
    </motion.div>
  )
}

export default ToggleBar