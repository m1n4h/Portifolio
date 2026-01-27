import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useCursor } from '../contexts/CursorContext'
import '../styles/cursor.scss'

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { cursorType, cursorText } = useCursor()

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      })
    }

    window.addEventListener('mousemove', mouseMove)
    return () => window.removeEventListener('mousemove', mouseMove)
  }, [])

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1
    },
    hover: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      scale: 2
    },
    click: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 0.8
    }
  }

  return (
    <>
      <motion.div
        className={`cursor ${cursorType}`}
        variants={variants}
        animate={cursorType}
      />
      {cursorText && (
        <motion.div
          className="cursor-text"
          style={{
            left: mousePosition.x + 20,
            top: mousePosition.y + 20
          }}
        >
          {cursorText}
        </motion.div>
      )}
    </>
  )
}

export default CustomCursor