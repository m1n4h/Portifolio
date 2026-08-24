import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Activities.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${API_URL}dashboard/recent_activity/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setActivities(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    const icons = {
      'login': '🔐',
      'view': '👁️',
      'click': '🖱️',
      'submit': '📤',
      'download': '📥',
      'visit': '🌐',
      'scroll': '📜',
      'hover': '🔄',
    };
    return icons[action] || '📊';
  };

  return (
    <div className="activities">
      <h1>User Activities</h1>
      <div className="activity-filters">
        <button onClick={() => fetchActivities()}>Refresh</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="activity-list">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {getActionIcon(activity.action)}
              </div>
              <div className="activity-info">
                <div className="activity-header">
                  <strong>{activity.action}</strong>
                  <span className="activity-time">
                    {new Date(activity.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="activity-details">
                  <span>Page: {activity.page || 'N/A'}</span>
                  <span>Device: {activity.device_type || 'N/A'}</span>
                  <span>Browser: {activity.browser || 'N/A'}</span>
                  {activity.data && (
                    <span>Data: {JSON.stringify(activity.data)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activities;