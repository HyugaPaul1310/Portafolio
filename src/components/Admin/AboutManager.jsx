import React, { useState, useEffect } from 'react';
import { Save, Upload, User, Eraser, Plus, Camera, Link as LinkIcon } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export default function AboutManager() {
  const [formData, setFormData] = useState({
    story_title_es: '', story_title_en: '', story_text_es: '', story_text_en: '',
    github_url: '', linkedin_url: '', instagram_url: '', whatsapp_url: '',
    twitter_url: '', youtube_url: '', tiktok_url: '', facebook_url: '',
    existingProfileImage: ''
  });
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmState, setConfirmState] = useState({
    isOpen: false, title: '', message: '', type: 'primary', confirmText: 'Aceptar', showButtons: true
  });

  useEffect(() => {
    if (confirmState.isOpen && !confirmState.showButtons) {
      const timer = setTimeout(() => setConfirmState(prev => ({ ...prev, isOpen: false })), 1000);
      return () => clearTimeout(timer);
    }
  }, [confirmState.isOpen, confirmState.showButtons]);

  useEffect(() => { fetchAboutAndTags(); }, []);

  const fetchAboutAndTags = async () => {
    try {
      const [aboutRes, tagsRes] = await Promise.all([
        fetch('http://localhost:3000/api/about'),
        fetch('http://localhost:3000/api/taxonomy/tags')
      ]);
      if (aboutRes.ok) {
        const data = await aboutRes.json();
        let parsedSkills = data.skills || [];
        if (typeof parsedSkills === 'string') { try { parsedSkills = JSON.parse(parsedSkills); } catch (e) { parsedSkills = []; } }
        setSelectedTags(Array.isArray(parsedSkills) ? parsedSkills : []);
        setFormData({
          story_title_es: data.story_title_es || 'Sobre Mí', story_title_en: data.story_title_en || 'About Me',
          story_text_es: data.story_text_es || '', story_text_en: data.story_text_en || '',
          github_url: data.github_url || '', linkedin_url: data.linkedin_url || '',
          instagram_url: data.instagram_url || '', whatsapp_url: data.whatsapp_url || '',
          twitter_url: data.twitter_url || '', youtube_url: data.youtube_url || '',
          tiktok_url: data.tiktok_url || '', facebook_url: data.facebook_url || '',
          existingProfileImage: data.profile_image_url || ''
        });
        if (data.profile_image_url) setImagePreview(data.profile_image_url);
      }
      if (tagsRes.ok) {
        const tagsData = await tagsRes.json();
        setAvailableTags(tagsData.map(t => t.name));
      }
    } catch (error) { console.error('Failed to fetch data', error); }
  };

  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const toggleTag = (tag) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const handleAddNewSkill = async () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (availableTags.includes(trimmed)) { if (!selectedTags.includes(trimmed)) setSelectedTags(prev => [...prev, trimmed]); setNewSkillInput(''); return; }
    try {
      const res = await fetch('http://localhost:3000/api/taxonomy/tags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: trimmed }) });
      if (res.ok) { setAvailableTags(prev => [...prev, trimmed]); setSelectedTags(prev => [...prev, trimmed]); setNewSkillInput(''); }
    } catch (err) { console.error('Error creating tag:', err); }
  };

  const handleNewSkillKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddNewSkill(); } };

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
    Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
    submitData.append('skills', JSON.stringify(selectedTags));
    if (profileImageFile) submitData.append('profileImage', profileImageFile);
    try {
      const response = await fetch('http://localhost:3000/api/about', { method: 'PUT', body: submitData });
      if (response.ok) {
        const result = await response.json();
        setConfirmState({ isOpen: true, title: '✓ Guardado Exitoso', message: 'Información actualizada correctamente.', type: 'primary', confirmText: 'Excelente', showButtons: false });
        if (result.profile_image_url) { setFormData(prev => ({ ...prev, existingProfileImage: result.profile_image_url })); setImagePreview(result.profile_image_url); }
      } else {
        setConfirmState({ isOpen: true, title: 'Error al Guardar', message: 'No se pudo actualizar. Inténtalo de nuevo.', type: 'danger', confirmText: 'Entendido', showButtons: true });
      }
    } catch (error) {
      console.error('Error saving about data', error);
      setConfirmState({ isOpen: true, title: 'Error Crítico', message: 'Error de conexión con el servidor.', type: 'danger', confirmText: 'Cerrar', showButtons: true });
    } finally { setLoading(false); }
  };

  const inputCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 px-4 text-white text-sm font-sans outline-none transition-all placeholder:text-zinc-600 focus:border-purple-500/40 focus:shadow-[0_0_0_3px_rgba(168,85,247,0.08)]";
  const labelCls = "text-xs text-zinc-500 font-medium";
  const sectionCls = "text-purple-400 mb-3 text-xs uppercase tracking-[0.15em] font-bold flex items-center gap-2";

  const socialFields = [
    [['github_url', 'GitHub', 'https://github.com/...'], ['linkedin_url', 'LinkedIn', 'https://linkedin.com/in/...']],
    [['instagram_url', 'Instagram', 'https://instagram.com/...'], ['whatsapp_url', 'WhatsApp', 'https://wa.me/...']],
    [['twitter_url', 'Twitter / X', 'https://x.com/...'], ['youtube_url', 'YouTube', 'https://youtube.com/...']],
    [['tiktok_url', 'TikTok', 'https://tiktok.com/@...'], ['facebook_url', 'Facebook', 'https://facebook.com/...']],
  ];

  return (
    <div className="max-w-[1100px] mx-auto flex flex-col gap-5">
      <div className="bg-[#0e0e18] rounded-2xl border border-white/[0.06] overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col">

          {/* Profile Image */}
          <div className="p-5 sm:p-8 border-b border-white/[0.04]">
            <h4 className={sectionCls}><Camera size={14} /> Profile Image</h4>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center overflow-hidden transition-all group-hover:border-purple-500/30">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User size={36} className="text-zinc-600" />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl cursor-pointer flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)' }}>
                  <Camera size={16} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm text-zinc-300 font-medium">Foto de Perfil</p>
                <p className="text-xs text-zinc-600 mt-1">800×800px recomendado. JPG, PNG o WebP.</p>
              </div>
            </div>
          </div>

          {/* Story */}
          <div className="p-5 sm:p-8 border-b border-white/[0.04]">
            <h4 className={sectionCls}>Story Text</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Story Title (Spanish)</label>
                <input type="text" name="story_title_es" value={formData.story_title_es} onChange={handleInputChange} required className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Story Title (English)</label>
                <input type="text" name="story_title_en" value={formData.story_title_en} onChange={handleInputChange} required className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Story Description (Spanish)</label>
                <textarea rows="5" name="story_text_es" value={formData.story_text_es} onChange={handleInputChange} required className={`${inputCls} resize-none`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Story Description (English)</label>
                <textarea rows="5" name="story_text_en" value={formData.story_text_en} onChange={handleInputChange} required className={`${inputCls} resize-none`} />
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="p-5 sm:p-8 border-b border-white/[0.04]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
              <h4 className={`${sectionCls} !mb-0`}>Tech Stack</h4>
              {selectedTags.length > 0 && (
                <button type="button" onClick={() => setSelectedTags([])}
                  className="flex items-center gap-1.5 bg-red-500/[0.08] border border-red-500/20 text-red-400 py-1.5 px-3 rounded-lg cursor-pointer text-xs font-sans font-semibold transition-all hover:bg-red-500/15 hover:text-red-300 active:scale-[0.97]">
                  <Eraser size={12} /> Clear ({selectedTags.length})
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {availableTags.length === 0 && <span className="text-zinc-500 text-xs">Loading tags...</span>}
              {availableTags.map(tag => (
                <button type="button" key={tag} onClick={() => toggleTag(tag)}
                  className={`py-1.5 px-3 rounded-lg cursor-pointer text-xs font-medium font-sans transition-all border
                    ${selectedTags.includes(tag) ? 'bg-purple-500 border-purple-500 text-white shadow-sm' : 'bg-white/[0.04] border-white/[0.08] text-zinc-400 hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-zinc-200'}`}>
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-col sm:flex-row">
              <input type="text" value={newSkillInput} onChange={(e) => setNewSkillInput(e.target.value)} onKeyDown={handleNewSkillKeyDown}
                placeholder="Add a new skill..." className={`${inputCls} sm:flex-1`} />
              <button type="button" onClick={handleAddNewSkill}
                className="flex items-center justify-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 py-2.5 px-4 rounded-xl cursor-pointer font-sans text-xs font-semibold whitespace-nowrap transition-all hover:bg-purple-500/20 hover:text-purple-300 active:scale-[0.97]">
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Social Networks */}
          <div className="p-5 sm:p-8">
            <h4 className={sectionCls}><LinkIcon size={14} /> Social Networks</h4>
            {socialFields.map((row, rowIdx) => (
              <div key={rowIdx} className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${rowIdx > 0 ? 'mt-3' : ''}`}>
                {row.map(([name, label, placeholder]) => (
                  <div key={name} className="flex flex-col gap-1.5">
                    <label className={labelCls}>{label}</label>
                    <input type="url" name={name} value={formData[name]} onChange={handleInputChange} placeholder={placeholder} className={inputCls} />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="px-5 sm:px-8 py-5 border-t border-white/[0.04] flex justify-center sm:justify-end">
            <button type="submit" disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none py-3 px-8 rounded-xl cursor-pointer flex items-center justify-center gap-2 text-sm font-semibold font-sans transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(168,85,247,0.25)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 rounded-full border-t-white animate-spin" /> : <><Save size={16} /> Save All Changes</>}
            </button>
          </div>
        </form>
      </div>

      <ConfirmModal isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} type={confirmState.type}
        confirmText={confirmState.confirmText} cancelText="Cerrar" showButtons={confirmState.showButtons}
        onConfirm={() => setConfirmState(prev => ({ ...prev, isOpen: false }))} onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))} />
    </div>
  );
}
