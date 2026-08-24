import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../pages/Skills.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/';

const ClientsManagement = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', image_url: '', company: '', testimonial: '', rating: 5, is_active: true
  });
  const token = localStorage.getItem('access_token');

  const fetchClients = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}clients/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setClients(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API_URL}clients/${editing.id}/`, form, {
          headers: { Authorization: `Token ${token}` }
        });
        setSuccess('Client updated');
      } else {
        await axios.post(`${API_URL}clients/`, form, {
          headers: { Authorization: `Token ${token}` }
        });
        setSuccess('Client created');
      }
      setForm({ name: '', description: '', image_url: '', company: '', testimonial: '', rating: 5, is_active: true });
      setEditing(null);
      fetchClients();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Error saving client');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_URL}clients/${id}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      fetchClients();
    } catch (error) {
      setError('Error deleting');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEdit = (client) => {
    setEditing(client);
    setForm({
      name: client.name, description: client.description, image_url: client.image_url || '',
      company: client.company || '', testimonial: client.testimonial || '',
      rating: client.rating, is_active: client.is_active
    });
  };

  if (loading) return <div className="loading-text">Loading clients...</div>;

  return (
    <div className="skills-management">
      <div className="page-header">
        <h1>Clients Management</h1>
        <span className="skill-count">{clients.length} clients</span>
      </div>

      {error && <div className="error-message">{error}<button className="close-btn" onClick={() => setError(null)}>×</button></div>}
      {success && <div className="success-message">{success}<button className="close-btn" onClick={() => setSuccess(null)}>×</button></div>}

      <div className="skill-form">
        <h3>{editing ? 'Edit Client' : 'Add Client'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Rating (1-5)</label>
              <input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({...form, rating: parseInt(e.target.value)})} />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input type="url" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} />
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
            </div>
            <div className="form-group full-width">
              <label>Testimonial</label>
              <textarea rows="2" value={form.testimonial} onChange={e => setForm({...form, testimonial: e.target.value})} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">{editing ? 'Update' : 'Add'} Client</button>
            {editing && <button type="button" className="cancel-btn" onClick={() => { setEditing(null); setForm({ name: '', description: '', image_url: '', company: '', testimonial: '', rating: 5, is_active: true }); }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="skills-list">
        {clients.map(client => (
          <div key={client.id} className="skill-item">
            <div className="skill-header">
              <h3>{client.name}</h3>
              <span className="skill-category">{'⭐'.repeat(client.rating)}</span>
            </div>
            <p className="skill-description">{client.testimonial || client.description}</p>
            {client.company && <p className="proficiency-text">{client.company}</p>}
            <div className="skill-actions">
              <button className="edit-btn" onClick={() => handleEdit(client)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(client.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsManagement;
