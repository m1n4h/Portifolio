import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Skills.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend',
    proficiency: 80,
    icon: '',
    image_url: '',
    description: '',
  });
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}skills/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setError('Failed to load skills. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Skill name is required');
      return false;
    }
    if (formData.name.length < 2) {
      setError('Skill name must be at least 2 characters');
      return false;
    }
    if (formData.proficiency < 1 || formData.proficiency > 100) {
      setError('Proficiency must be between 1 and 100');
      return false;
    }
    if (!formData.category) {
      setError('Category is required');
      return false;
    }
    return true;
  };

  // Check for duplicate skill
  const checkDuplicate = (name, excludeId = null) => {
    const existing = skills.find(
      s => s.name.toLowerCase() === name.toLowerCase() && s.id !== excludeId
    );
    if (existing) {
      setError(`Skill "${name}" already exists!`);
      return true;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate
    if (!validateForm()) return;
    
    // Check for duplicates
    if (checkDuplicate(formData.name, editingSkill?.id)) return;
    
    setSubmitting(true);

    try {
      let response;
      if (editingSkill) {
        response = await axios.put(
          `${API_URL}skills/${editingSkill.id}/`,
          formData,
          { headers: { Authorization: `Token ${token}` } }
        );
        setSuccess('Skill updated successfully!');
      } else {
        response = await axios.post(
          `${API_URL}skills/`,
          formData,
          { headers: { Authorization: `Token ${token}` } }
        );
        setSuccess('Skill added successfully!');
      }

      // Reset form
      setFormData({
        name: '',
        category: 'frontend',
        proficiency: 80,
        icon: '',
        image_url: '',
        description: '',
      });
      setEditingSkill(null);
      
      // Refresh list
      await fetchSkills();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving skill:', error);
      if (error.response) {
        if (error.response.status === 400) {
          setError(error.response.data.message || 'Invalid data. Please check your input.');
        } else if (error.response.status === 401) {
          setError('Session expired. Please login again.');
        } else if (error.response.status === 409) {
          setError('A skill with this name already exists.');
        } else {
          setError('Failed to save skill. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    
    setSubmitting(true);
    try {
      await axios.delete(`${API_URL}skills/${id}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setSuccess('Skill deleted successfully!');
      await fetchSkills();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting skill:', error);
      setError('Failed to delete skill. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon: skill.icon || '',
      image_url: skill.image_url || '',
      description: skill.description || '',
    });
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'frontend',
      proficiency: 80,
      icon: '',
      image_url: '',
      description: '',
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="skills-management">
      <div className="page-header">
        <h1>Manage Skills</h1>
        <span className="skill-count">{skills.length} skills total</span>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">!</span>
          {error}
          <button onClick={() => setError('')} className="close-btn">×</button>
        </div>
      )}

      {success && (
        <div className="success-message">
          <span className="success-icon">✓</span>
          {success}
          <button onClick={() => setSuccess('')} className="close-btn">×</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="skill-form">
        <h3>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h3>
        
        <div className="form-grid">
          <div className="form-group">
            <label>Skill Name *</label>
            <input
              type="text"
              placeholder="e.g., React, Python"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              disabled={submitting}
              className={formData.name && skills.some(s => 
                s.name.toLowerCase() === formData.name.toLowerCase() && 
                s.id !== editingSkill?.id
              ) ? 'duplicate' : ''}
            />
            {formData.name && skills.some(s => 
              s.name.toLowerCase() === formData.name.toLowerCase() && 
              s.id !== editingSkill?.id
            ) && (
              <small className="duplicate-warning">This skill already exists</small>
            )}
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
              disabled={submitting}
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Database</option>
              <option value="tools">Tools</option>
              <option value="design">Design</option>
              <option value="devops">DevOps</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>

          <div className="form-group">
            <label>Proficiency (1-100) *</label>
            <div className="proficiency-input">
              <input
                type="range"
                min="1"
                max="100"
                value={formData.proficiency}
                onChange={(e) => setFormData({...formData, proficiency: parseInt(e.target.value)})}
                disabled={submitting}
              />
              <span className="proficiency-value">{formData.proficiency}%</span>
            </div>
          </div>

          <div className="form-group">
            <label>Icon (Emoji or Font Awesome)</label>
            <input
              type="text"
              placeholder="e.g., ⚛️ or fa-react"
              value={formData.icon}
              onChange={(e) => setFormData({...formData, icon: e.target.value})}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Image URL (for real images)</label>
            <input
              type="url"
              placeholder="https://example.com/skill-logo.png"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              disabled={submitting}
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            placeholder="Brief description of the skill"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="3"
            disabled={submitting}
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : editingSkill ? 'Update Skill' : 'Add Skill'}
          </button>
          {editingSkill && (
            <button 
              type="button" 
              className="cancel-btn"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="skills-list">
        {loading ? (
          <p className="loading-text">Loading skills...</p>
        ) : skills.length === 0 ? (
          <p className="no-skills">No skills added yet. Add your first skill above!</p>
        ) : (
          skills.map((skill) => (
            <div key={skill.id} className="skill-item">
              <div className="skill-info">
                <div className="skill-header">
                  <h3>{skill.name}</h3>
                  <span className="skill-category">{skill.category}</span>
                </div>
                <p className="skill-description">{skill.description || 'No description'}</p>
                <div className="skill-progress">
                  <div className="progress-bar">
                    <div style={{ width: `${skill.proficiency}%` }}></div>
                  </div>
                  <span className="proficiency-text">{skill.proficiency}%</span>
                </div>
              </div>
              <div className="skill-actions">
                <button 
                  onClick={() => handleEdit(skill)} 
                  className="edit-btn"
                  disabled={submitting}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(skill.id)} 
                  className="delete-btn"
                  disabled={submitting}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Skills;
