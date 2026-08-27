import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Skills.css';

const API_URL = '/api/';

const Qualifications = () => {
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    country: '', institution: '', course: '', mode_of_learning: 'online',
    issuer: '', start_date: '', end_date: '', description: '', order: 0
  });
  const [certificateFile, setCertificateFile] = useState(null);
  const [viewingCert, setViewingCert] = useState(null);
  const token = localStorage.getItem('access_token');

  const fetchQualifications = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}qualifications/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setQualifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchQualifications(); }, [fetchQualifications]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      });
      formData.append('is_active', 'true');
      if (certificateFile) {
        formData.append('certificate', certificateFile);
      }

      const config = { headers: { Authorization: `Token ${token}` } };

      if (editing) {
        await axios.patch(`${API_URL}qualifications/${editing.id}/`, formData, config);
        setSuccess('Qualification updated successfully');
      } else {
        await axios.post(`${API_URL}qualifications/`, formData, config);
        setSuccess('Qualification created successfully');
      }
      resetForm();
      fetchQualifications();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      const msg = error.response?.data?.detail
        || Object.values(error.response?.data || {}).flat().join(', ')
        || 'Error saving qualification';
      setError(msg);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this qualification?')) return;
    try {
      await axios.delete(`${API_URL}qualifications/${id}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setSuccess('Qualification deleted');
      fetchQualifications();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Error deleting qualification');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEdit = (qual) => {
    setEditing(qual);
    setForm({
      country: qual.country, institution: qual.institution, course: qual.course,
      mode_of_learning: qual.mode_of_learning, issuer: qual.issuer,
      start_date: qual.start_date, end_date: qual.end_date || '',
      description: qual.description || '', order: qual.order || 0
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setCertificateFile(null);
    setForm({
      country: '', institution: '', course: '', mode_of_learning: 'online',
      issuer: '', start_date: '', end_date: '', description: '', order: 0
    });
  };

  if (loading) return <div className="loading-text">Loading qualifications...</div>;

  return (
    <div className="skills-management">
      <div className="page-header">
        <h1>Professional Qualifications</h1>
        <span className="skill-count">{qualifications.length} qualifications</span>
      </div>

      {error && <div className="error-message">{error}<button className="close-btn" onClick={() => setError(null)}>×</button></div>}
      {success && <div className="success-message">{success}<button className="close-btn" onClick={() => setSuccess(null)}>×</button></div>}

      <button className="submit-btn" onClick={() => { resetForm(); setShowForm(!showForm); }} style={{ marginBottom: '1rem' }}>
        {showForm ? 'Close Form' : '+ Add Professional Qualification'}
      </button>

      {showForm && (
        <div className="skill-form">
          <h3>{editing ? 'Edit Qualification' : 'Add Professional Qualification'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Country *</label>
                <input type="text" value={form.country} onChange={e => setForm({...form, country: e.target.value})} required placeholder="e.g., United Kingdom" />
              </div>
              <div className="form-group">
                <label>Institution *</label>
                <input type="text" value={form.institution} onChange={e => setForm({...form, institution: e.target.value})} required placeholder="e.g., TryHackMe" />
              </div>
              <div className="form-group">
                <label>Course *</label>
                <input type="text" value={form.course} onChange={e => setForm({...form, course: e.target.value})} required placeholder="e.g., Pre Security Path" />
              </div>
              <div className="form-group">
                <label>Mode of Learning *</label>
                <select value={form.mode_of_learning} onChange={e => setForm({...form, mode_of_learning: e.target.value})}>
                  <option value="online">Online</option>
                  <option value="in_person">In Person</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div className="form-group">
                <label>Issuer</label>
                <input type="text" value={form.issuer} onChange={e => setForm({...form, issuer: e.target.value})} placeholder="e.g., TryHackMe experts" />
              </div>
              <div className="form-group">
                <label>Order</label>
                <input type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})} />
              </div>
              <div className="form-group">
                <label>Start Date *</label>
                <input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Certificate (PDF/Image)</label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png,.gif" onChange={e => setCertificateFile(e.target.files[0])} />
                {editing?.certificate && !certificateFile && (
                  <small style={{ color: 'var(--accent)' }}>Current file exists. Upload new to replace.</small>
                )}
              </div>
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief description" />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">{editing ? 'Update' : 'Add'} Qualification</button>
              <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="skills-list">
        {qualifications.map(qual => (
          <div key={qual.id} className="skill-item">
            <div className="skill-info">
              <div className="skill-header">
                <h3>{qual.course}</h3>
                <span className="skill-category">{qual.mode_of_learning}</span>
              </div>
              <p className="skill-description"><strong>Institution:</strong> {qual.institution}</p>
              <p className="skill-description"><strong>Country:</strong> {qual.country}</p>
              {qual.issuer && <p className="skill-description"><strong>Issuer:</strong> {qual.issuer}</p>}
              <p className="proficiency-text">
                {qual.start_date} — {qual.end_date || 'Ongoing'}
              </p>
              {qual.certificate_url && (
                <button className="edit-btn" onClick={() => setViewingCert(qual)} style={{ marginTop: '0.5rem' }}>
                  View Certificate
                </button>
              )}
            </div>
            <div className="skill-actions">
              <button className="edit-btn" onClick={() => handleEdit(qual)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(qual.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {viewingCert && (
        <div className="modal-overlay" onClick={() => setViewingCert(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '2rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-primary)', borderRadius: '1rem', padding: '1.5rem', maxWidth: '700px', width: '100%', position: 'relative', maxHeight: '85vh', overflow: 'auto' }}>
            <button onClick={() => setViewingCert(null)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: '#e94560', border: '2px solid #fff', borderRadius: '50%', width: '36px', height: '36px', color: '#fff', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>✕</button>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{viewingCert.course}</h3>
            {viewingCert.certificate_url && (
              viewingCert.certificate_url.endsWith('.pdf') ? (
                <iframe src={viewingCert.certificate_url} style={{ width: '100%', height: '60vh', border: 'none', borderRadius: '0.5rem' }} title="Certificate" />
              ) : (
                <img src={viewingCert.certificate_url} alt="Certificate" style={{ width: '100%', borderRadius: '0.5rem' }} />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Qualifications;
