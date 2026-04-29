import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Trash, Eraser, ChevronDown, Image as ImageIcon } from 'lucide-react';

export default function ProjectFormModal({ project, onClose, onSave }) {
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    title_es: '', title_en: '', category: '', color: '#a855f7',
    description_es: '', description_en: '', overview_es: '', overview_en: '',
    problem_es: '', problem_en: '', solution_es: '', solution_en: '',
    learnings_es: '', learnings_en: '',
    show_website: false, website_url: '', show_repo: false, repo_url: ''
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
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
        if (!project && catData.length > 0) setFormData(prev => ({ ...prev, category: catData[0].name }));
      } catch (err) { console.error('API Error:', err); }
    };
    fetchSelects();
    if (project) {
      setFormData({ ...project, show_website: project.show_website == 1 || project.show_website === true, show_repo: project.show_repo == 1 || project.show_repo === true });
      setSelectedTags(Array.isArray(project.tags) ? project.tags : []);
      setExistingImages(Array.isArray(project.gallery) ? project.gallery : []);
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const toggleTag = (tag) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (existingImages.length + newFiles.length + files.length > 8) { alert('Máximo 8 imágenes.'); return; }
    setNewFiles([...newFiles, ...files]);
  };

  const removeNewFile = (i) => setNewFiles(newFiles.filter((_, idx) => idx !== i));
  const removeExistingImage = (i) => setExistingImages(existingImages.filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append('tags', JSON.stringify(selectedTags));
    if (project) {
      submitData.append('existingGallery', JSON.stringify(existingImages));
      newFiles.forEach(file => submitData.append('newImages', file));
      submitData.append('id', project.id);
    } else { newFiles.forEach(file => submitData.append('gallery', file)); }
    Object.keys(formData).forEach(key => { if (!['tags', 'gallery', 'id'].includes(key)) submitData.append(key, formData[key]); });
    onSave(submitData);
  };

  const inputCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 px-4 text-white text-sm font-sans outline-none transition-all placeholder:text-zinc-600 focus:border-purple-500/40 focus:shadow-[0_0_0_3px_rgba(168,85,247,0.08)]";
  const labelCls = "text-xs text-zinc-500 font-medium";
  const sectionCls = "text-purple-400 mb-3 text-xs uppercase tracking-[0.15em] font-bold flex items-center gap-2";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-5 animate-fade-in">
      <div className="bg-[#0e0e18] sm:rounded-2xl rounded-t-2xl border border-white/[0.08] w-full max-w-[800px] max-h-[95vh] sm:max-h-[90vh] flex flex-col animate-slide-in-up sm:animate-scale-up"
        style={{ boxShadow: '0 -10px 60px rgba(0,0,0,0.3)' }}>
        {/* Header */}
        <header className="py-4 px-5 sm:px-6 border-b border-white/[0.06] flex justify-between items-center shrink-0">
          <div>
            <h3 className="m-0 text-base sm:text-lg font-bold text-white">{project ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
            <p className="text-[0.65rem] text-zinc-500 mt-0.5">Completa todos los campos requeridos</p>
          </div>
          <button className="bg-white/5 border border-white/[0.08] rounded-lg p-2 cursor-pointer text-zinc-400 hover:bg-white/10 hover:text-white transition-all active:scale-95" onClick={onClose}><X size={18} /></button>
        </header>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-6 flex-1" encType="multipart/form-data">
          {/* General */}
          <div>
            <h4 className={sectionCls}>General</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Título (ES)</label>
                <input type="text" name="title_es" value={formData.title_es} onChange={handleChange} required className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Título (EN)</label>
                <input type="text" name="title_en" value={formData.title_en} onChange={handleChange} required className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {/* Category */}
              <div className="flex flex-col gap-1.5 relative">
                <label className={labelCls}>Categoría</label>
                <div className={`${inputCls} cursor-pointer flex justify-between items-center`} onClick={() => setDropdownOpen(!dropdownOpen)}>
                  {formData.category || "Seleccione..."} <ChevronDown size={14} className={`text-zinc-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                {dropdownOpen && (
                  <ul className="absolute top-full left-0 right-0 bg-[#16162a] border border-white/[0.08] rounded-xl mt-1 p-1 list-none max-h-[200px] overflow-y-auto z-10 shadow-2xl">
                    {categories.map(cat => (
                      <li key={cat} onClick={() => { setFormData({ ...formData, category: cat }); setDropdownOpen(false); }}
                        className={`p-2.5 cursor-pointer rounded-lg text-sm transition-colors ${formData.category === cat ? 'text-purple-400 bg-purple-500/10' : 'text-zinc-300 hover:bg-white/5'}`}>
                        {cat}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Color */}
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Color del proyecto</label>
                <div className="flex gap-3 items-center">
                  <input type="color" name="color" value={formData.color} onChange={handleChange} className="w-11 h-11 p-0 cursor-pointer border-none bg-transparent rounded-lg" />
                  <div className="flex-1 text-center py-2.5 rounded-xl font-bold text-white text-sm flex items-center justify-center"
                    style={{ backgroundColor: formData.color, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                    {formData.color.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className={`${sectionCls} !mb-0`}>Tech Stack</h4>
              {selectedTags.length > 0 && (
                <button type="button" onClick={() => setSelectedTags([])} className="bg-transparent border-none text-red-400 flex items-center gap-1 cursor-pointer text-xs hover:text-white transition-colors">
                  <Eraser size={12} /> Limpiar
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.length === 0 && <span className="text-zinc-500 text-xs">Cargando...</span>}
              {availableTags.map(tag => (
                <button type="button" key={tag} onClick={() => toggleTag(tag)}
                  className={`py-1.5 px-3 rounded-lg cursor-pointer text-xs font-medium font-sans transition-all border
                    ${selectedTags.includes(tag) ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white/[0.04] border-white/[0.08] text-zinc-400 hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-zinc-200'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery */}
          <div>
            <h4 className={sectionCls}><ImageIcon size={14} /> Galería (Máx. 8)</h4>
            <label className="flex items-center gap-2 cursor-pointer bg-white/[0.04] p-4 rounded-xl border border-dashed border-white/[0.12] w-full sm:w-fit text-sm text-zinc-300 hover:bg-white/[0.06] hover:border-white/20 transition-all">
              <Upload size={16} className="text-purple-400" /> Seleccionar Archivos
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            {(existingImages.length > 0 || newFiles.length > 0) && (
              <div className="flex gap-2 flex-wrap mt-3">
                {existingImages.map((imgUrl, idx) => (
                  <div key={'old-' + idx} className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden group border border-white/[0.06]">
                    <img src={imgUrl} alt="Old" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeExistingImage(idx)} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer border-none">
                      <Trash size={16} className="text-red-400" />
                    </button>
                  </div>
                ))}
                {newFiles.map((file, idx) => (
                  <div key={'new-' + idx} className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden group border-2 border-purple-500/50">
                    <img src={URL.createObjectURL(file)} alt="New" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-purple-500 text-[0.55rem] text-center text-white font-bold py-0.5">NEW</div>
                    <button type="button" onClick={() => removeNewFile(idx)} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer border-none">
                      <Trash size={16} className="text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Text sections */}
          {[
            { title: 'Descripción Breve', fields: [['description_es', 'Descripción (ES)', 2], ['description_en', 'Description (EN)', 2]] },
            { title: 'Overview', fields: [['overview_es', 'Overview (ES)', 3], ['overview_en', 'Overview (EN)', 3]] },
            { title: 'Problema', fields: [['problem_es', 'Problema (ES)', 3], ['problem_en', 'Problem (EN)', 3]] },
            { title: 'Solución', fields: [['solution_es', 'Solución (ES)', 3], ['solution_en', 'Solution (EN)', 3]] },
            { title: 'Aprendizajes', fields: [['learnings_es', 'Aprendizajes (ES)', 3], ['learnings_en', 'Learnings (EN)', 3]] },
          ].map(section => (
            <div key={section.title}>
              <h4 className={sectionCls}>{section.title}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {section.fields.map(([name, label, rows]) => (
                  <div key={name} className="flex flex-col gap-1.5">
                    <label className={labelCls}>{label}</label>
                    <textarea name={name} rows={rows} value={formData[name]} onChange={handleChange} required className={`${inputCls} resize-none`} />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Links */}
          <div>
            <h4 className={sectionCls}>Enlaces Externos</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400">
                  <input type="checkbox" name="show_website" checked={Boolean(formData.show_website)} onChange={handleChange} className="w-auto accent-purple-500" />
                  Habilitar Link Web
                </label>
                {Boolean(formData.show_website) && <input type="url" name="website_url" placeholder="https://..." value={formData.website_url} onChange={handleChange} required className={inputCls} />}
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400">
                  <input type="checkbox" name="show_repo" checked={Boolean(formData.show_repo)} onChange={handleChange} className="w-auto accent-purple-500" />
                  Habilitar Link Repositorio
                </label>
                {Boolean(formData.show_repo) && <input type="url" name="repo_url" placeholder="https://github.com/..." value={formData.repo_url} onChange={handleChange} required className={inputCls} />}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <footer className="py-4 px-4 sm:px-6 border-t border-white/[0.06] flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 shrink-0">
          <button type="button" className="py-2.5 px-5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-400 font-sans font-semibold text-sm cursor-pointer transition-all hover:bg-white/[0.08] hover:text-white active:scale-[0.98]" onClick={onClose}>Cancelar</button>
          <button type="submit" form="" onClick={(e) => { e.preventDefault(); document.querySelector('form[enctype]').requestSubmit(); }}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none py-2.5 px-5 rounded-xl cursor-pointer flex items-center justify-center gap-2 text-sm font-semibold font-sans transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(168,85,247,0.25)] active:scale-[0.98]">
            <Save size={16} /> {project ? 'Guardar Cambios' : 'Crear Proyecto'}
          </button>
        </footer>
      </div>
    </div>
  );
}
