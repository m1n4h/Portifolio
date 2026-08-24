import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../pages/Skills.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/';

const EducationManagement = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    institution: '', level: 'primary', start_year: 2024, end_year: '',
    description: '', course: '', is_current: false, is_active: true
  });
  const token = localStorage.getItem('access_token');

  const fetchEducations = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}education/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setEducations(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchEducations(); }, [fetchEducations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, end_year: form.end_year || null };
    try {
      if (editing) {
        await axios.put(`${API_URL}education/${editing.id}/`, data, {
          headers: { Authorization: `Token ${token}` }
        });
        setSuccess('Education updated');
      } else {
        await axios.post(`${API_URL}education/`, data, {
          headers: { Authorization: `Token ${token}` }
        });
        setSuccess('Education created');
      }
      setForm({ institution: '', level: 'primary', start_year: 2024, end_year: '', description: '', course: '', is_current: false, is_active: true });
      setEditing(null);
      fetchEducations();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Error saving education');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_URL}education/${id}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      fetchEducations();
    } catch (error) {
      setError('Error deleting');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEdit = (edu) => {
    setEditing(edu);
    setForm({
      institution: edu.institution, level: edu.level, start_year: edu.start_year,
      end_year: edu.end_year || '', description: edu.description || '',
      course: edu.course || '', is_current: edu.is_current, is_active: edu.is_active
    });
  };

  if (loading) return <div className="loading-text">Loading education...</div>;

  return (
    <div className="skills-management">
      <div className="page-header">
        <h1>Education Management</h1>
        <span className="skill-count">{educations.length} entries</span>
      </div>

      {error && <div className="error-message">{error}<button className="close-btn" onClick={() => setError(null)}>×</button></div>}
      {success && <div className="success-message">{success}<button className="close-btn" onClick={() => setSuccess(null)}>×</button></div>}

      <div className="skill-form">
        <h3>{editing ? 'Edit Education' : 'Add Education'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Institution</label>
              <input type="text" value={form.institution} onChange={e => setForm({...form, institution: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Level</label>
              <select value={form.level} onChange={e => setForm({...form, level: e.target.value})}>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="advanced">Advanced</option>
                <option value="university">University</option>
              </select>
            </div>
            <div className="form-group">
              <label>Start Year</label>
              <input type="number" value={form.start_year} onChange={e => setForm({...form, start_year: parseInt(e.target.value)})} required />
            </div>
            <div className="form-group">
              <label>End Year (blank if ongoing)</label>
              <input type="number" value={form.end_year} onChange={e => setForm({...form, end_year: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Course</label>
              <input type="text" value={form.course} onChange={e => setForm({...form, course: e.target.value})} />
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={form.is_current} onChange={e => setForm({...form, is_current: e.target.checked})} />
                Currently studying here
              </label>
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">{editing ? 'Update' : 'Add'} Education</button>
            {editing && <button type="button" className="cancel-btn" onClick={() => { setEditing(null); setForm({ institution: '', level: 'primary', start_year: 2024, end_year: '', description: '', course: '', is_current: false, is_active: true }); }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="skills-list">
        {educations.map(edu => (
          <div key={edu.id} className="skill-item">
            <div className="skill-header">
              <h3>{edu.institution}</h3>
              <span className="skill-category">{edu.level}</span>
            </div>
            <p className="skill-description">{edu.description}</p>
            <p className="proficiency-text">{edu.start_year} - {edu.end_year || 'Ongoing'}{edu.course ? ` | ${edu.course}` : ''}</p>
            <div className="skill-actions">
              <button className="edit-btn" onClick={() => handleEdit(edu)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(edu.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationManagement;
