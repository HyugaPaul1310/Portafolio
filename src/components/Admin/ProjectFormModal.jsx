import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Trash, Eraser } from 'lucide-react';
import './Admin.css';

export default function ProjectFormModal({ project, onClose, onSave }) {
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    title_es: '', title_en: '',
    category: '', color: '#a855f7',
    description_es: '', description_en: '',
    overview_es: '', overview_en: '',
    problem_es: '', problem_en: '',
    solution_es: '', solution_en: '',
    learnings_es: '', learnings_en: '',
    show_website: false, website_url: '',
    show_repo: false, repo_url: ''
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    // Fetch categories and tags from DB
    const fetchSelects = async () => {
      try {
        const [catRes, tagsRes] = await Promise.all([
          fetch('http://localhost:3000/api/taxonomy/categories'),
          fetch('http://localhost:3000/api/taxonomy/tags')
        ]);
        const catData = await catRes.json();
        const tagsData = await tagsRes.json();
        setCategories(catData.map(c => c.name));
        setAvailableTags(tagsData.map(t => t.name));

        // Asign defaults if no project editing
        if (!project && catData.length > 0) {
          setFormData(prev => ({ ...prev, category: catData[0].name }));
        }
      } catch (err) {
        console.error('API Error:', err);
      }
    };
    fetchSelects();

    if (project) {
      setFormData({ ...project });
      setSelectedTags(Array.isArray(project.tags) ? project.tags : []);
      setExistingImages(Array.isArray(project.gallery) ? project.gallery : []);
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (existingImages.length + newFiles.length + files.length > 8) {
      alert('Error: Solo se permiten un máximo de 8 imágenes para el proyecto.');
      return;
    }
    setNewFiles([...newFiles, ...files]);
  };

  const removeNewFile = (index) => {
    setNewFiles(newFiles.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Preparar FormData (para soporte de Archivos Multer locales)
    const submitData = new FormData();
    submitData.append('tags', JSON.stringify(selectedTags));

    // Si estamos editando y conservamos imágenes, las pasamos
    if (project) {
      submitData.append('existingGallery', JSON.stringify(existingImages));
      newFiles.forEach(file => {
        submitData.append('newImages', file);
      });
      // Añadimos también el ID
      submitData.append('id', project.id);
    } else {
      newFiles.forEach(file => {
        submitData.append('gallery', file); // Multer espera 'gallery' en creación
      });
    }

    // Agregar todo el resto de textos
    Object.keys(formData).forEach(key => {
      // Ignoramos estos que ya manejamos de forma especial
      if (['tags', 'gallery', 'id'].includes(key)) return;
      submitData.append(key, formData[key]);
    });

    onSave(submitData);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-container">
        <header className="admin-modal-header">
          <h3>{project ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </header>

        <form onSubmit={handleSubmit} className="admin-modal-form" encType="multipart/form-data">
          <div className="form-section">
            <h4>General</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Título (ES)</label>
                <input type="text" name="title_es" value={formData.title_es} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Título (EN)</label>
                <input type="text" name="title_en" value={formData.title_en} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ position: 'relative' }}>
                <label>Categoría</label>
                <div
                  className="admin-select"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: 'inherit'
                  }}
                >
                  {formData.category || (categories.length === 0 ? "Cargando..." : "Seleccione una categoría")}
                  <span style={{ fontSize: '10px' }}>▼</span>
                </div>
                {dropdownOpen && (
                  <ul style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: '#1a1a24',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    marginTop: '4px',
                    padding: 0,
                    listStyle: 'none',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 10
                  }}>
                    {categories.map(cat => (
                      <li
                        key={cat}
                        onClick={() => {
                          setFormData({ ...formData, category: cat });
                          setDropdownOpen(false);
                        }}
                        style={{
                          padding: '12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          color: formData.category === cat ? 'var(--accent-purple)' : '#fff',
                          background: formData.category === cat ? 'rgba(255,255,255,0.05)' : 'transparent'
                        }}
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="form-group">
                <label>Color (#hex) - Previsualización</label>
                <div className="color-picker-row" style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type="color" name="color" value={formData.color} onChange={handleChange} style={{ width: '50px', height: '40px', padding: '0', cursor: 'pointer', border: 'none', background: 'transparent' }} />
                  <div style={{ 
                    backgroundColor: formData.color, 
                    color: '#fff', 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    fontWeight: 'bold', 
                    textShadow: '0 1px 3px rgba(0,0,0,0.5)', 
                    flex: '1 1 150px', 
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {formData.color.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ margin: 0 }}>Lenguajes y Herramientas Usadas (Etiquetas)</h4>
              {selectedTags.length > 0 && (
                <button type="button" onClick={() => setSelectedTags([])} style={{ background: 'transparent', border: 'none', color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <Eraser size={14} /> Limpiar Etiquetas
                </button>
              )}
            </div>
            <div className="tags-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {availableTags.length === 0 && <span style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Cargando etiquetas desde la base de datos...</span>}
              {availableTags.map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    background: selectedTags.includes(tag) ? 'var(--accent-purple)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${selectedTags.includes(tag) ? 'var(--accent-purple)' : 'rgba(255,255,255,0.1)'}`,
                    color: '#fff',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h4>Galería de Imágenes (Máximo 8 en Total)</h4>
            <div className="form-group">
              <label className="file-upload-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)', width: 'fit-content' }}>
                <Upload size={18} /> Seleccionar Archivos desde la PC
                <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
            </div>

            <div className="image-previews" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
              {/* Mostrar viejas imagenes */}
              {existingImages.map((imgUrl, idx) => (
                <div key={'old-' + idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={imgUrl} alt="Old" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => removeExistingImage(idx)} style={{ position: 'absolute', top: 2, right: 2, background: 'red', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer', padding: '4px' }}>
                    <Trash size={12} />
                  </button>
                </div>
              ))}

              {/* Mostrar nuevas imagenes */}
              {newFiles.map((file, idx) => (
                <div key={'new-' + idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--accent-purple)' }}>
                  <img src={URL.createObjectURL(file)} alt="New" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, background: 'rgba(0,0,0,0.6)', width: '100%', fontSize: '10px', textAlign: 'center', color: 'lime' }}>NUEVA</div>
                  <button type="button" onClick={() => removeNewFile(idx)} style={{ position: 'absolute', top: 2, right: 2, background: 'red', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer', padding: '4px' }}>
                    <Trash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h4>Descripción Breve del Proyecto (Tarjeta)</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Descripción corta (ES)</label>
                <textarea name="description_es" rows={2} value={formData.description_es} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label>Descripción corta (EN)</label>
                <textarea name="description_en" rows={2} value={formData.description_en} onChange={handleChange} required></textarea>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Visión General (Overview Modal)</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Overview (ES)</label>
                <textarea name="overview_es" rows={3} value={formData.overview_es} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label>Overview (EN)</label>
                <textarea name="overview_en" rows={3} value={formData.overview_en} onChange={handleChange} required></textarea>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Estudio de Caso: Problema</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Problema (ES)</label>
                <textarea name="problem_es" rows={3} value={formData.problem_es} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label>Problem (EN)</label>
                <textarea name="problem_en" rows={3} value={formData.problem_en} onChange={handleChange} required></textarea>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Estudio de Caso: Solución</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Solución (ES)</label>
                <textarea name="solution_es" rows={3} value={formData.solution_es} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label>Solution (EN)</label>
                <textarea name="solution_en" rows={3} value={formData.solution_en} onChange={handleChange} required></textarea>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Estudio de Caso: Aprendizajes</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Aprendizajes (ES)</label>
                <textarea name="learnings_es" rows={3} value={formData.learnings_es} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label>Learnings (EN)</label>
                <textarea name="learnings_en" rows={3} value={formData.learnings_en} onChange={handleChange} required></textarea>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Enlaces Externos</h4>
            <div className="form-row">
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" name="show_website" checked={Boolean(formData.show_website)} onChange={handleChange} style={{ width: 'auto' }} />
                  Habilitar Link de Página Web
                </label>
                {Boolean(formData.show_website) && (
                  <input type="url" name="website_url" placeholder="https://mipagina.com" value={formData.website_url} onChange={handleChange} required />
                )}
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" name="show_repo" checked={Boolean(formData.show_repo)} onChange={handleChange} style={{ width: 'auto' }} />
                  Habilitar Link de Repositorio (Ej. Github)
                </label>
                {Boolean(formData.show_repo) && (
                  <input type="url" name="repo_url" placeholder="https://github.com/..." value={formData.repo_url} onChange={handleChange} required />
                )}
              </div>
            </div>
          </div>

          <footer className="admin-modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="admin-save-btn">
              <Save size={18} />
              {project ? 'Editar Proyecto' : 'Guardar Proyecto'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
