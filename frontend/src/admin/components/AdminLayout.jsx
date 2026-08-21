import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Get user info
    const userData = localStorage.getItem('user_data');
    if (userData) {
      setUser(JSON.parse(userData));
    }
<<<<<<< HEAD

    // Listen for storage changes (e.g., avatar updated in Settings)
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
=======
>>>>>>> origin/main
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    navigate('/admin/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // If no user, don't render
  if (!user) {
    return null;
  }

  return (
    <div className="admin-layout">
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
          <Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>
<<<<<<< HEAD
            <span className="nav-icon"></span>
            {isSidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link to="/admin/skills" className={isActive('/admin/skills')}>
            <span className="nav-icon"></span>
            {isSidebarOpen && <span>Skills</span>}
          </Link>
          <Link to="/admin/projects" className={isActive('/admin/projects')}>
            <span className="nav-icon"></span>
            {isSidebarOpen && <span>Projects</span>}
          </Link>
          <Link to="/admin/messages" className={isActive('/admin/messages')}>
            <span className="nav-icon"></span>
            {isSidebarOpen && <span>Messages</span>}
          </Link>
          <Link to="/admin/analytics" className={isActive('/admin/analytics')}>
            <span className="nav-icon"></span>
            {isSidebarOpen && <span>Analytics</span>}
          </Link>
          <Link to="/admin/activities" className={isActive('/admin/activities')}>
            <span className="nav-icon"></span>
            {isSidebarOpen && <span>Activities</span>}
          </Link>
          <Link to="/admin/settings" className={isActive('/admin/settings')}>
            <span className="nav-icon"></span>
            {isSidebarOpen && <span>Settings</span>}
          </Link>
=======
            <span className="nav-icon">📊</span>
            {isSidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link to="/admin/skills" className={isActive('/admin/skills')}>
            <span className="nav-icon">💻</span>
            {isSidebarOpen && <span>Skills</span>}
          </Link>
          <Link to="/admin/projects" className={isActive('/admin/projects')}>
            <span className="nav-icon">📁</span>
            {isSidebarOpen && <span>Projects</span>}
          </Link>
          <Link to="/admin/messages" className={isActive('/admin/messages')}>
            <span className="nav-icon">✉️</span>
            {isSidebarOpen && <span>Messages</span>}
          </Link>
          <Link to="/admin/analytics" className={isActive('/admin/analytics')}>
            <span className="nav-icon">📈</span>
            {isSidebarOpen && <span>Analytics</span>}
          </Link>
          <Link to="/admin/activities" className={isActive('/admin/activities')}>
            <span className="nav-icon">👤</span>
            {isSidebarOpen && <span>Activities</span>}
          </Link>
>>>>>>> origin/main
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
<<<<<<< HEAD
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
=======
              {user?.username?.charAt(0).toUpperCase() || 'A'}
>>>>>>> origin/main
            </div>
            {isSidebarOpen && (
              <div className="user-details">
                <span className="username">{user?.username || 'Admin'}</span>
                <span className="user-email">{user?.email || 'admin@example.com'}</span>
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="logout-btn">
<<<<<<< HEAD
            <span></span>
=======
            <span>🚪</span>
>>>>>>> origin/main
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