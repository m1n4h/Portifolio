import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/';

const Login = () => {
  const [credentials, setCredentials] = useState({ 
    username: '', 
    password: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}auth/login/`, credentials);
      
      if (response.data.token) {
        localStorage.setItem('access_token', response.data.token);
        localStorage.setItem('user_data', JSON.stringify({
          id: response.data.user_id,
          username: response.data.username,
          email: response.data.email,
          is_superuser: response.data.is_superuser
        }));
        
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        setError(error.response.data.error || 'Invalid credentials');
      } else if (error.request) {
        setError('Unable to connect to server. Please check if backend is running.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetMessage('');

    try {
      const response = await axios.post(`${API_URL}auth/reset_password/`, {
        email: resetEmail
      });
      
      setResetMessage('Password reset email sent! Please check your inbox.');
      setShowReset(false);
      setResetEmail('');
    } catch (error) {
      console.error('Reset error:', error);
      if (error.response) {
        setResetMessage(error.response.data.error || 'Failed to reset password');
      } else {
        setResetMessage('Network error. Please try again.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-login">
      <div className="floating-circles">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>

      <div className="login-container">
        <div className="login-brand">
          <span className="brand-icon"></span>
          <h2>Portfolio Admin</h2>
          <p>Login to manage your portfolio</p>
        </div>

        {error && (
          <div className="login-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {!showReset ? (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">
                <span className="label-icon"></span>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={handleChange}
                required
                autoFocus
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <span className="label-icon"></span>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="login-options">
              <button 
                type="button" 
                className="forgot-password"
                onClick={() => setShowReset(true)}
              >
                Forgot Password?
              </button>
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>

            <div className="login-footer">
              <span>Powered by</span>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="brand"
              >
                Amina Kalonge
              </a>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="login-form">
            <div className="form-group">
              <label htmlFor="resetEmail">
                <span className="label-icon">✉️</span>
                Email Address
              </label>
              <input
                type="email"
                id="resetEmail"
                name="resetEmail"
                placeholder="Enter your email address"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                disabled={resetLoading}
              />
              <small className="help-text">
                Enter the email associated with your account
              </small>
            </div>

            {resetMessage && (
              <div className={`reset-message ${resetMessage.includes('sent') ? 'success' : 'error'}`}>
                {resetMessage}
              </div>
            )}

            <button 
              type="submit" 
              className="login-btn"
              disabled={resetLoading}
            >
              {resetLoading ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                'Reset Password'
              )}
            </button>

            <button 
              type="button" 
              className="back-btn"
              onClick={() => {
                setShowReset(false);
                setResetMessage('');
                setResetEmail('');
              }}
            >
              ← Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;