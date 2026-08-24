import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './projects.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'web',
    technologies: '',
    image_url: '',
    github_url: '',
    live_url: '',
    status: 'completed',
    featured: false,
    order: 0,
    is_active: true,
  });
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}projects/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  // Validate URL
  const isValidUrl = (url) => {
    if (!url) return true; // Empty is valid (optional field)
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Project title is required');
      return false;
    }
    if (formData.title.length < 3) {
      setError('Project title must be at least 3 characters');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (formData.description.length < 10) {
      setError('Description must be at least 10 characters');
      return false;
    }
    if (!formData.technologies.trim()) {
      setError('Technologies are required');
      return false;
    }
    
    // Validate URLs if provided
    if (formData.image_url && !isValidUrl(formData.image_url)) {
      setError('Please enter a valid image URL (e.g., https://example.com/image.jpg)');
      return false;
    }
    if (formData.github_url && !isValidUrl(formData.github_url)) {
      setError('Please enter a valid GitHub URL (e.g., https://github.com/username/repo)');
      return false;
    }
    if (formData.live_url && !isValidUrl(formData.live_url)) {
      setError('Please enter a valid Live URL (e.g., https://example.com)');
      return false;
    }
    
    // Check for duplicate title
    const existing = projects.find(
      p => p.title.toLowerCase() === formData.title.toLowerCase() && 
      p.id !== editingProject?.id
    );
    if (existing) {
      setError(`Project "${formData.title}" already exists!`);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) return;
    
    setSubmitting(true);

    try {
      let response;
      if (editingProject) {
        response = await axios.put(
          `${API_URL}projects/${editingProject.id}/`,
          formData,
          { headers: { Authorization: `Token ${token}` } }
        );
        setSuccess('✅ Project updated successfully!');
      } else {
        response = await axios.post(
          `${API_URL}projects/`,
          formData,
          { headers: { Authorization: `Token ${token}` } }
        );
        setSuccess('✅ Project added successfully!');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'web',
        technologies: '',
        image_url: '',
        github_url: '',
        live_url: '',
        status: 'completed',
        featured: false,
        order: 0,
        is_active: true,
      });
      setEditingProject(null);
      
      await fetchProjects();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving project:', error);
      if (error.response) {
        if (error.response.status === 400) {
          setError(error.response.data.message || 'Invalid data. Please check your input.');
        } else if (error.response.status === 409) {
          setError('A project with this title already exists.');
        } else {
          setError('Failed to save project. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    setSubmitting(true);
    try {
      await axios.delete(`${API_URL}projects/${id}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setSuccess('✅ Project deleted successfully!');
      await fetchProjects();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      technologies: project.technologies,
      image_url: project.image_url || '',
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      status: project.status,
      featured: project.featured,
      order: project.order || 0,
      is_active: project.is_active,
    });
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      category: 'web',
      technologies: '',
      image_url: '',
      github_url: '',
      live_url: '',
      status: 'completed',
      featured: false,
      order: 0,
      is_active: true,
    });
    setError('');
    setSuccess('');
  };

  const handleSelect = (id) => {
    setSelectedProjects(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedProjects.length === projects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map(p => p.id));
    }
  };

  return (
    <div className="projects-management">
      <div className="page-header">
        <h1>Manage Projects</h1>
        <span className="project-count">{projects.length} projects total</span>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">❌</span>
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

      <form onSubmit={handleSubmit} className="project-form">
        <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
        
        <div className="form-grid">
          <div className="form-group">
            <label>Project Title *</label>
            <input
              type="text"
              placeholder="e.g., Portfolio Website"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
              disabled={submitting}
            >
              <option value="web">Web Development</option>
              <option value="mobile">Mobile Application</option>
              <option value="desktop">Desktop Application</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              disabled={submitting}
            >
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="planned">Planned</option>
            </select>
          </div>

          <div className="form-group">
            <label>Technologies *</label>
            <input
              type="text"
              placeholder="e.g., React, Django, PostgreSQL"
              value={formData.technologies}
              onChange={(e) => setFormData({...formData, technologies: e.target.value})}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              disabled={submitting}
            />
            {formData.image_url && !isValidUrl(formData.image_url) && (
              <small className="url-error">⚠️ Please enter a valid URL</small>
            )}
          </div>

          <div className="form-group">
            <label>GitHub URL</label>
            <input
              type="url"
              placeholder="https://github.com/username/repo"
              value={formData.github_url}
              onChange={(e) => setFormData({...formData, github_url: e.target.value})}
              disabled={submitting}
            />
            {formData.github_url && !isValidUrl(formData.github_url) && (
              <small className="url-error">⚠️ Please enter a valid URL</small>
            )}
          </div>

          <div className="form-group">
            <label>Live URL</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={formData.live_url}
              onChange={(e) => setFormData({...formData, live_url: e.target.value})}
              disabled={submitting}
            />
            {formData.live_url && !isValidUrl(formData.live_url) && (
              <small className="url-error">⚠️ Please enter a valid URL</small>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                disabled={submitting}
              />
              Featured Project
            </label>
            <label>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                disabled={submitting}
              />
              Active
            </label>
          </div>
        </div>

        <div className="form-group full-width">
          <label>Description *</label>
          <textarea
            placeholder="Detailed description of the project"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="4"
            required
            disabled={submitting}
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : editingProject ? 'Update Project' : 'Add Project'}
          </button>
          {editingProject && (
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

      <div className="projects-list">
        {loading ? (
          <p className="loading-text">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="no-projects">No projects added yet. Add your first project above!</p>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-item">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <span className={`status-badge ${project.status}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.technologies.split(',').slice(0, 3).map((tech, i) => (
                    <span key={i} className="tech-tag">{tech.trim()}</span>
                  ))}
                  {project.technologies.split(',').length > 3 && (
                    <span className="tech-tag">+{project.technologies.split(',').length - 3}</span>
                  )}
                </div>
                <div className="project-links">
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer">🌐 Live</a>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">🐙 GitHub</a>
                  )}
                  {project.featured && <span className="featured-badge">⭐ Featured</span>}
                </div>
                <div className="project-actions">
                  <button 
                    onClick={() => handleEdit(project)} 
                    className="edit-btn"
                    disabled={submitting}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)} 
                    className="delete-btn"
                    disabled={submitting}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;