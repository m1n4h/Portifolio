import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { CursorProvider } from './contexts/CursorContext';
import CustomCursor from './components/CustomCursor';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SideNav from './components/SideNav';
import './styles/global.scss';

// Admin imports
import { AdminThemeProvider } from './admin/contexts/AdminThemeContext';
import AdminLayout from './admin/components/AdminLayout';
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import SkillsManagement from './admin/pages/Skills';
import ProjectsManagement from './admin/pages/Projects';
import MessagesManagement from './admin/pages/Messages';
import Analytics from './admin/pages/Analytics';
import Activities from './admin/pages/Activities';
import Settings from './admin/pages/Settings';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Portfolio */}
        <Route
          path="/"
          element={
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
                  <SideNav />
                </div>
              </CursorProvider>
            </ThemeProvider>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminThemeProvider>
                <AdminLayout />
              </AdminThemeProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="skills" element={<SkillsManagement />} />
          <Route path="projects" element={<ProjectsManagement />} />
          <Route path="messages" element={<MessagesManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="activities" element={<Activities />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
