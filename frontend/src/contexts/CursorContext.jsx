import React, { createContext, useContext, useState } from 'react'

const CursorContext = createContext()

export const useCursor = () => {
  const context = useContext(CursorContext)
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider')
  }
  return context
}

export const CursorProvider = ({ children }) => {
  const [cursorType, setCursorType] = useState('default')
  const [cursorText, setCursorText] = useState('')

  return (
    <CursorContext.Provider value={{
      cursorType,
      setCursorType,
      cursorText,
      setCursorText
    }}>
      {children}
    </CursorContext.Provider>
  )
}