import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAdminTheme } from '../contexts/AdminThemeContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useAdminTheme();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const userData = localStorage.getItem('user_data');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const handleStorageChange = (e) => {
      if (e.key === 'user_data') {
        const newData = localStorage.getItem('user_data');
        if (newData) {
          setUser(JSON.parse(newData));
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    navigate('/admin/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  if (!user) {
    return null;
  }

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard'},
    { to: '/admin/skills', label: 'Skills' },
    { to: '/admin/projects', label: 'Projects' },
    { to: '/admin/experience', label: 'Experience' },
    { to: '/admin/clients', label: 'Clients' },
    { to: '/admin/education', label: 'Education' },
    { to: '/admin/messages', label: 'Messages'},
    { to: '/admin/analytics', label: 'Analytics'},
    { to: '/admin/activities', label: 'Activities'},
    { to: '/admin/settings', label: 'Settings' },
  ];

  return (
    <div className={`admin-layout ${isDark ? 'dark' : 'light'}`}>
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>{isSidebarOpen ? 'Portfolio Admin' : 'PA'}</h2>
          <button
            className="toggle-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className={isActive(item.to)}>
              <span className="nav-icon">{item.icon}</span>
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  className="avatar-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.querySelector('.avatar-fallback').style.display = 'flex';
                  }}
                />
              ) : null}
              <span className="avatar-fallback" style={{ display: user?.avatar_url ? 'none' : 'flex' }}>
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            {isSidebarOpen && (
              <div className="user-details">
                <span className="username">{user?.username || 'Admin'}</span>
                <span className="user-email">{user?.email || 'admin@example.com'}</span>
              </div>
            )}
          </div>

          <button onClick={toggleTheme} className="theme-toggle-btn" title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            <span className="theme-icon">{isDark ? '☀' : '🌙'}</span>
            {isSidebarOpen && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-icon">⏻</span>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <div className="header-left">
            <h1>Welcome, {user?.username || 'Admin'}!</h1>
            <span className="header-subtitle">Manage your portfolio content</span>
          </div>
          <div className="header-right">
            <button onClick={toggleTheme} className="header-theme-toggle" title={isDark ? 'Light mode' : 'Dark mode'}>
              {isDark ? '☀' : '🌙'}
            </button>
            <span className="header-time">
              {new Date().toLocaleString()}
            </span>
          </div>
        </header>
        <div className="admin-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
