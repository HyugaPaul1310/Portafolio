import React, { useState, useEffect } from 'react';
import { Save, Upload, User, Eraser, Plus } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import './Admin.css';

export default function AboutManager() {
  const [formData, setFormData] = useState({
    story_title_es: '',
    story_title_en: '',
    story_text_es: '',
    story_text_en: '',
    github_url: '',
    linkedin_url: '',
    instagram_url: '',
    whatsapp_url: '',
    twitter_url: '',
    youtube_url: '',
    tiktok_url: '',
    facebook_url: '',
    existingProfileImage: ''
  });
  
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'primary',
    confirmText: 'Aceptar',
    showButtons: true
  });

  useEffect(() => {
    if (confirmState.isOpen && !confirmState.showButtons) {
      const timer = setTimeout(() => {
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      }, 1000); // 1 second for auto-close
      return () => clearTimeout(timer);
    }
  }, [confirmState.isOpen, confirmState.showButtons]);

  useEffect(() => {
    fetchAboutAndTags();
  }, []);

  const fetchAboutAndTags = async () => {
    try {
      const [aboutRes, tagsRes] = await Promise.all([
        fetch('http://localhost:3000/api/about'),
        fetch('http://localhost:3000/api/taxonomy/tags')
      ]);

      if (aboutRes.ok) {
        const data = await aboutRes.json();
        
        let parsedSkills = data.skills || [];
        if (typeof parsedSkills === 'string') {
          try {
            parsedSkills = JSON.parse(parsedSkills);
          } catch (e) {
            parsedSkills = [];
          }
        }
        setSelectedTags(Array.isArray(parsedSkills) ? parsedSkills : []);

        setFormData({
          story_title_es: data.story_title_es || '',
          story_title_en: data.story_title_en || '',
          story_text_es: data.story_text_es || '',
          story_text_en: data.story_text_en || '',
          github_url: data.github_url || '',
          linkedin_url: data.linkedin_url || '',
          instagram_url: data.instagram_url || '',
          whatsapp_url: data.whatsapp_url || '',
          twitter_url: data.twitter_url || '',
          youtube_url: data.youtube_url || '',
          tiktok_url: data.tiktok_url || '',
          facebook_url: data.facebook_url || '',
          existingProfileImage: data.profile_image_url || ''
        });
        if (data.profile_image_url) {
          setImagePreview(data.profile_image_url);
        }
      }

      if (tagsRes.ok) {
        const tagsData = await tagsRes.json();
        setAvailableTags(tagsData.map(t => t.name));
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddNewSkill = async () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    // Check if already exists
    if (availableTags.includes(trimmed)) {
      // Just select it if not already selected
      if (!selectedTags.includes(trimmed)) {
        setSelectedTags(prev => [...prev, trimmed]);
      }
      setNewSkillInput('');
      return;
    }
    // Create new tag in the database
    try {
      const res = await fetch('http://localhost:3000/api/taxonomy/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed })
      });
      if (res.ok) {
        setAvailableTags(prev => [...prev, trimmed]);
        setSelectedTags(prev => [...prev, trimmed]);
        setNewSkillInput('');
      }
    } catch (err) {
      console.error('Error creating tag:', err);
    }
  };

  const handleNewSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNewSkill();
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    submitData.append('skills', JSON.stringify(selectedTags));

    if (profileImageFile) {
      submitData.append('profileImage', profileImageFile);
    }

    try {
      const response = await fetch('http://localhost:3000/api/about', {
        method: 'PUT',
        body: submitData
      });

      if (response.ok) {
        const result = await response.json();
        
        setConfirmState({
          isOpen: true,
          title: 'Guardado Exitoso',
          message: 'La información se ha actualizado correctamente en el servidor.',
          type: 'primary',
          confirmText: 'Excelente',
          showButtons: false
        });

        if (result.profile_image_url) {
          setFormData(prev => ({ ...prev, existingProfileImage: result.profile_image_url }));
          setImagePreview(result.profile_image_url);
        }
      } else {
        setConfirmState({
          isOpen: true,
          title: 'Error al Guardar',
          message: 'No se pudo actualizar la sección. Por favor, inténtalo de nuevo.',
          type: 'danger',
          confirmText: 'Entendido',
          showButtons: true
        });
      }
    } catch (error) {
      console.error('Error saving about data', error);
      setConfirmState({
        isOpen: true,
        title: 'Error Crítico',
        message: 'Ocurrió un error inesperado al conectar con el servidor.',
        type: 'danger',
        confirmText: 'Cerrar',
        showButtons: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="about-manager-container">
      <div className="about-header-flex">
        <h3 className="chart-title" style={{ padding: 0, border: 'none' }}>
           Manage About Me
        </h3>
      </div>

      <div className="table-container about-form-container">
        <form onSubmit={handleSubmit} className="admin-modal-form" style={{ padding: 0 }}>
          
          {/* Profile Image */}
          <div className="form-section">
            <h4>Profile Image</h4>
            <div className="profile-upload-area">
              <div className="image-preview-box">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" />
                ) : (
                  <User size={40} color="#a1a1aa" />
                )}
              </div>
              <div className="upload-controls">
                <label className="upload-button">
                  <Upload size={18} /> Choose New Photo
                  <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleImageChange} />
                </label>
                <span className="upload-hint">Recommended: 800x800px. JPG, PNG or WebP.</span>
              </div>
            </div>
          </div>

          {/* Story Text */}
          <div className="form-section">
            <h4>Story Text</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Story Title (Spanish)</label>
                <input type="text" name="story_title_es" value={formData.story_title_es} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Story Title (English)</label>
                <input type="text" name="story_title_en" value={formData.story_title_en} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="form-row" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Story Description (Spanish)</label>
                <textarea rows="6" name="story_text_es" value={formData.story_text_es} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Story Description (English)</label>
                <textarea rows="6" name="story_text_en" value={formData.story_text_en} onChange={handleInputChange} required />
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="form-section">
            <div className="tech-stack-header">
              <h4 style={{ margin: 0 }}>Tech Stack (Select or Create)</h4>
              {selectedTags.length > 0 && (
                <button type="button" onClick={() => setSelectedTags([])} className="clear-tags-btn">
                  <Eraser size={14} /> Clear Selection
                </button>
              )}
            </div>
            <div className="skill-tags-grid">
              {availableTags.length === 0 && <span className="tags-loading">Loading tags from database...</span>}
              {availableTags.map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`skill-pick-btn ${selectedTags.includes(tag) ? 'selected' : ''}`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {/* Add new skill inline */}
            <div className="add-skill-row">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={handleNewSkillKeyDown}
                placeholder="Add a new skill..."
                className="add-skill-input"
              />
              <button type="button" onClick={handleAddNewSkill} className="add-skill-btn">
                <Plus size={16} /> Add
              </button>
            </div>
          </div>

          {/* Social Networks */}
          <div className="form-section">
            <h4>Social Networks</h4>
            <div className="form-row">
              <div className="form-group">
                <label>GitHub Profile URL</label>
                <input type="url" name="github_url" value={formData.github_url} onChange={handleInputChange} placeholder="https://github.com/..." />
              </div>
              <div className="form-group">
                <label>LinkedIn Profile URL</label>
                <input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleInputChange} placeholder="https://linkedin.com/in/..." />
              </div>
            </div>
            <div className="form-row" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Instagram Handle URL</label>
                <input type="url" name="instagram_url" value={formData.instagram_url} onChange={handleInputChange} placeholder="https://instagram.com/..." />
              </div>
              <div className="form-group">
                <label>WhatsApp Link (wa.me)</label>
                <input type="url" name="whatsapp_url" value={formData.whatsapp_url} onChange={handleInputChange} placeholder="https://wa.me/..." />
              </div>
            </div>
            <div className="form-row" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Twitter / X URL</label>
                <input type="url" name="twitter_url" value={formData.twitter_url} onChange={handleInputChange} placeholder="https://x.com/..." />
              </div>
              <div className="form-group">
                <label>YouTube Channel URL</label>
                <input type="url" name="youtube_url" value={formData.youtube_url} onChange={handleInputChange} placeholder="https://youtube.com/..." />
              </div>
            </div>
            <div className="form-row" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>TikTok URL</label>
                <input type="url" name="tiktok_url" value={formData.tiktok_url} onChange={handleInputChange} placeholder="https://tiktok.com/@..." />
              </div>
              <div className="form-group">
                <label>Facebook Profile URL</label>
                <input type="url" name="facebook_url" value={formData.facebook_url} onChange={handleInputChange} placeholder="https://facebook.com/..." />
              </div>
            </div>
          </div>

          <div className="submit-footer">
            <button type="submit" disabled={loading} className="admin-save-btn">
              <Save size={18} /> {loading ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </form>
      </div>

      <ConfirmModal 
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        type={confirmState.type}
        confirmText={confirmState.confirmText}
        cancelText="Cerrar"
        showButtons={confirmState.showButtons}
        onConfirm={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
