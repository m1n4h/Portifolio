import React from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { CursorProvider } from './contexts/CursorContext'
import CustomCursor from './components/CustomCursor'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SideNav from './components/SideNav';  // Make sure this matches the filename exactly

import './styles/global.scss'

function App() {
  return (
    <ThemeProvider>
      <CursorProvider>
        <div className="app">
          <CustomCursor />
          <Header />
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </main>
          <Footer />
          < SideNav/>
        </div>
      </CursorProvider>
    </ThemeProvider>
  )
}

export default App