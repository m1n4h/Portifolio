import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Dashboard.css';

const API_URL = '/api/';
const REFRESH_INTERVAL = 15000;

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_projects: 0,
    active_projects: 0,
    total_skills: 0,
    active_skills: 0,
    total_messages: 0,
    unread_messages: 0,
    total_visits: 0,
    unique_visitors: 0,
    recent_messages: [],
    recent_activities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('access_token');

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}dashboard/statistics/`, {
        headers: { 
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setStats(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response) {
        if (error.response.status === 401) {
          setError('Session expired. Please login again.');
          setTimeout(() => {
            localStorage.removeItem('access_token');
            window.location.href = '/admin/login';
          }, 2000);
        } else {
          setError(error.response.data.message || 'Failed to load dashboard data');
        }
      } else if (error.request) {
        setError('Unable to connect to server. Please check if backend is running.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  }, [token]);

  useEffect(() => {
    setLoading(false);
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-large"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <span className="error-icon">!</span>
        <h3>{error}</h3>
        <button onClick={fetchDashboardData} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back! Here's what's happening with your portfolio</p>
        <span className="auto-refresh-badge">Auto-refresh: 15s</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <img src="/images/icons/projects.svg" alt="Projects" className="stat-icon-img" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
          </div>
          <div className="stat-info">
            <h3>Total Projects</h3>
            <p className="stat-number">{stats.total_projects || 0}</p>
            <span className="stat-sub">{stats.active_projects || 0} active</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <img src="/images/icons/skills.svg" alt="Skills" className="stat-icon-img" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
          </div>
          <div className="stat-info">
            <h3>Skills</h3>
            <p className="stat-number">{stats.total_skills || 0}</p>
            <span className="stat-sub">{stats.active_skills || 0} active</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <img src="/images/icons/messages.svg" alt="Messages" className="stat-icon-img" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
          </div>
          <div className="stat-info">
            <h3>Messages</h3>
            <p className="stat-number">{stats.total_messages || 0}</p>
            <span className="stat-sub">{stats.unread_messages || 0} unread</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <img src="/images/icons/analytics.svg" alt="Visitors" className="stat-icon-img" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
          </div>
          <div className="stat-info">
            <h3>Visitors</h3>
            <p className="stat-number">{stats.unique_visitors || 0}</p>
            <span className="stat-sub">{stats.total_visits || 0} total visits</span>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section recent-messages">
          <h2>Recent Messages</h2>
          <div className="message-list">
            {stats.recent_messages && stats.recent_messages.length > 0 ? (
              stats.recent_messages.slice(0, 5).map((msg) => (
                <div key={msg.id} className={`message-item ${!msg.is_read ? 'unread' : ''}`}>
                  <div className="message-info">
                    <strong>{msg.name}</strong>
                    <span className="message-subject">{msg.subject}</span>
                  </div>
                  <span className="message-date">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-data">No messages yet</p>
            )}
          </div>
        </div>

        <div className="section recent-activities">
          <h2>Recent Activities</h2>
          <div className="activity-list">
            {stats.recent_activities && stats.recent_activities.length > 0 ? (
              stats.recent_activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="activity-item">
                  <span className="activity-action">{activity.action}</span>
                  <span className="activity-page">{activity.page || 'Unknown'}</span>
                  <span className="activity-time">
                    {new Date(activity.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-data">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
