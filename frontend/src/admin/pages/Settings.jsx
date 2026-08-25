import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Settings.css';

const API_URL = '/api/';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  // Avatar form
  const [avatarUrl, setAvatarUrl] = useState('');

  // Profile form
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetchUserProfile();
    // Load saved avatar URL from localStorage
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    if (userData.avatar_url) {
      setAvatarUrl(userData.avatar_url);
    }
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}auth/me/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setUser(response.data);
      setProfileData({
        username: response.data.username || '',
        email: response.data.email || '',
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      // Save profile data to localStorage (user data is read-only from backend)
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      userData.first_name = profileData.first_name;
      userData.last_name = profileData.last_name;
      localStorage.setItem('user_data', JSON.stringify(userData));
      setUser(prev => ({ ...prev, ...profileData }));
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match.');
      return;
    }

    if (passwordData.new_password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(`${API_URL}auth/change_password/`, {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password,
      }, {
        headers: { Authorization: `Token ${token}` }
      });
      setSuccess('Password updated successfully!');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.response) {
        const errData = error.response.data;
        setError(errData.error || errData.message || JSON.stringify(errData) || 'Failed to update password.');
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    window.location.href = '/admin/login';
  };

  const handleAvatarSave = () => {
    // Save avatar URL to localStorage
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    userData.avatar_url = avatarUrl;
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(prev => ({ ...prev, avatar_url: avatarUrl }));
    setSuccess('Avatar URL saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="spinner-large"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-management">
      <div className="page-header">
        <h1>Settings</h1>
        <span className="settings-subtitle">Manage your account and preferences</span>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
          <button onClick={() => setError('')} className="close-btn">×</button>
        </div>
      )}

      {success && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          {success}
          <button onClick={() => setSuccess('')} className="close-btn">×</button>
        </div>
      )}

      <div className="settings-tabs">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Change Password
        </button>
        <button
          className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          Account
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'profile' && (
          <div className="settings-card">
            <h2>Profile Information</h2>
            <div className="avatar-section">
              <div className="avatar-preview">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Avatar" 
                    className="avatar-preview-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                  </div>
                )}
              </div>
              <div className="avatar-form">
                <label>Profile Image URL</label>
                <div className="avatar-input-row">
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                  />
                  <button type="button" className="submit-btn" onClick={handleAvatarSave}>
                    Save Avatar
                  </button>
                </div>
                <small className="help-text">Enter a URL for your profile image</small>
              </div>
            </div>
            <div className="profile-info">
              <div className="info-row">
                <label>Username</label>
                <span className="info-value">{user?.username || 'N/A'}</span>
              </div>
              <div className="info-row">
                <label>Email</label>
                <span className="info-value">{user?.email || 'N/A'}</span>
              </div>
              <div className="info-row">
                <label>First Name</label>
                <span className="info-value">{user?.first_name || 'Not set'}</span>
              </div>
              <div className="info-row">
                <label>Last Name</label>
                <span className="info-value">{user?.last_name || 'Not set'}</span>
              </div>
              <div className="info-row">
                <label>Role</label>
                <span className="info-value role-badge">
                  {user?.is_superuser ? 'Superuser' : 'User'}
                </span>
              </div>
              <div className="info-row">
                <label>Member Since</label>
                <span className="info-value">
                  {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="settings-card">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordChange} className="settings-form">
              <div className="form-group">
                <label>Current Password *</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>New Password *</label>
                <input
                  type="password"
                  placeholder="Enter new password (min 8 characters)"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                  required
                  minLength={8}
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password *</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                  required
                  minLength={8}
                  disabled={submitting}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="settings-card">
            <h2>Account Actions</h2>
            <div className="account-actions">
              <div className="action-item">
                <div className="action-info">
                  <h3>Logout</h3>
                  <p>Sign out of your admin account</p>
                </div>
                <button onClick={handleLogout} className="logout-btn-action">
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
