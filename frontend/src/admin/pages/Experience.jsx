import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../pages/Skills.css';

const API_URL = '/api/';

const ExperienceManagement = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', category: 'mobile', years: 1.0, image_url: '', is_active: true
  });
  const token = localStorage.getItem('access_token');

  const fetchExperiences = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}experience/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setExperiences(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchExperiences(); }, [fetchExperiences]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API_URL}experience/${editing.id}/`, form, {
          headers: { Authorization: `Token ${token}` }
        });
        setSuccess('Experience updated successfully');
      } else {
        await axios.post(`${API_URL}experience/`, form, {
          headers: { Authorization: `Token ${token}` }
        });
        setSuccess('Experience created successfully');
      }
      setForm({ title: '', description: '', category: 'mobile', years: 1.0, icon: '', image_url: '', is_active: true });
      setEditing(null);
      fetchExperiences();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response?.data?.detail || 'Error saving experience');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_URL}experience/${id}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      fetchExperiences();
    } catch (error) {
      setError('Error deleting experience');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEdit = (exp) => {
    setEditing(exp);
    setForm({
      title: exp.title, description: exp.description, category: exp.category,
      years: exp.years, image_url: exp.image_url || '', is_active: exp.is_active
    });
  };

  if (loading) return <div className="loading-text">Loading experiences...</div>;

  return (
    <div className="skills-management">
      <div className="page-header">
        <h1>Experience Management</h1>
        <span className="skill-count">{experiences.length} items</span>
      </div>

      {error && <div className="error-message">{error}<button className="close-btn" onClick={() => setError(null)}>×</button></div>}
      {success && <div className="success-message">{success}<button className="close-btn" onClick={() => setSuccess(null)}>×</button></div>}

      <div className="skill-form">
        <h3>{editing ? 'Edit Experience' : 'Add Experience'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="mobile">Mobile Development</option>
                <option value="web">Web Development</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="networking">Networking</option>
              </select>
            </div>
            <div className="form-group">
              <label>Years</label>
              <input type="number" step="0.5" value={form.years} onChange={e => setForm({...form, years: parseFloat(e.target.value)})} />
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">{editing ? 'Update' : 'Add'} Experience</button>
            {editing && <button type="button" className="cancel-btn" onClick={() => { setEditing(null); setForm({ title: '', description: '', category: 'mobile', years: 1.0, icon: '', image_url: '', is_active: true }); }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="skills-list">
        {experiences.map(exp => (
          <div key={exp.id} className="skill-item">
            <div className="skill-header">
              <h3>{exp.title}</h3>
              <span className="skill-category">{exp.category}</span>
            </div>
            <p className="skill-description">{exp.description}</p>
            <p className="proficiency-text">{exp.years} years</p>
            <div className="skill-actions">
              <button className="edit-btn" onClick={() => handleEdit(exp)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(exp.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceManagement;
