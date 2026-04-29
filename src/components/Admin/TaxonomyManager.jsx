import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, Layers, X } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export default function TaxonomyManager() {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [newTag, setNewTag] = useState('');
  const [confirmState, setConfirmState] = useState({
    isOpen: false, title: '', message: '', onConfirm: () => {}, type: 'primary'
  });

  const fetchTaxonomies = async () => {
    try {
      const [catRes, tagRes] = await Promise.all([
        fetch('http://localhost:3000/api/taxonomy/categories'),
        fetch('http://localhost:3000/api/taxonomy/tags')
      ]);
      setCategories(await catRes.json());
      setTags(await tagRes.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchTaxonomies(); }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    try {
      const res = await fetch('http://localhost:3000/api/taxonomy/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newCat.trim() }) });
      if (res.ok) { setNewCat(''); fetchTaxonomies(); }
    } catch (err) { console.error(err); }
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    try {
      const res = await fetch('http://localhost:3000/api/taxonomy/tags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newTag.trim() }) });
      if (res.ok) { setNewTag(''); fetchTaxonomies(); }
    } catch (err) { console.error(err); }
  };

  const handleDeleteCategory = (id) => {
    setConfirmState({
      isOpen: true, title: '¿Eliminar Categoría?', message: 'Los proyectos asociados podrían quedar sin categoría.',
      type: 'danger', confirmText: 'Sí, borrar', cancelText: 'Cancelar',
      onConfirm: async () => { await fetch(`http://localhost:3000/api/taxonomy/categories/${id}`, { method: 'DELETE' }); fetchTaxonomies(); }
    });
  };

  const handleDeleteTag = (id) => {
    setConfirmState({
      isOpen: true, title: '¿Eliminar Etiqueta?', message: '¿Deseas borrar esta etiqueta permanentemente?',
      type: 'danger', confirmText: 'Sí, borrar', cancelText: 'Cancelar',
      onConfirm: async () => { await fetch(`http://localhost:3000/api/taxonomy/tags/${id}`, { method: 'DELETE' }); fetchTaxonomies(); }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">

      {/* Categorías */}
      <div className="bg-[#0e0e18] rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-white/[0.04]">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white m-0">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Layers size={16} className="text-purple-400" />
            </div>
            Categorías
          </h3>
          <p className="text-xs text-zinc-500 mt-1 ml-10">Organiza tus proyectos por categoría</p>
        </div>

        <div className="p-4 sm:p-6">
          <form onSubmit={handleAddCategory} className="flex gap-2 mb-5">
            <input
              type="text" value={newCat} onChange={(e) => setNewCat(e.target.value)}
              placeholder="Nueva categoría..."
              className="flex-1 bg-white/[0.04] border border-white/[0.08] text-white rounded-xl py-2.5 px-4 font-sans text-sm transition-all outline-none placeholder:text-zinc-600 focus:border-purple-500/40 focus:shadow-[0_0_0_3px_rgba(168,85,247,0.08)]"
            />
            <button type="submit" className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none h-[42px] px-4 rounded-xl cursor-pointer flex items-center gap-1.5 text-sm font-semibold font-sans transition-all hover:shadow-[0_4px_16px_rgba(168,85,247,0.25)] active:scale-[0.97] shrink-0">
              <Plus size={16} /> <span className="hidden sm:inline">Añadir</span>
            </button>
          </form>

          <div className="flex flex-col gap-1.5">
            {categories.length === 0 ? (
              <div className="text-center py-8 text-zinc-600 text-sm">Sin categorías aún</div>
            ) : categories.map((cat, i) => (
              <div key={cat.id} className="group flex justify-between items-center bg-white/[0.02] hover:bg-white/[0.04] py-3 px-4 rounded-xl transition-colors animate-fade-in-up" style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
                  <span className="text-zinc-200 text-sm">{cat.name}</span>
                </div>
                <button onClick={() => handleDeleteCategory(cat.id)} className="bg-transparent border-none text-zinc-600 cursor-pointer p-1.5 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400" title="Eliminar">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Count badge */}
        <div className="px-4 sm:px-6 py-3 border-t border-white/[0.04] flex justify-between items-center">
          <span className="text-xs text-zinc-600">{categories.length} categoría{categories.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Etiquetas */}
      <div className="bg-[#0e0e18] rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-white/[0.04]">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white m-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Tag size={16} className="text-indigo-400" />
            </div>
            Etiquetas (Tags)
          </h3>
          <p className="text-xs text-zinc-500 mt-1 ml-10">Tecnologías y habilidades disponibles</p>
        </div>

        <div className="p-4 sm:p-6">
          <form onSubmit={handleAddTag} className="flex gap-2 mb-5">
            <input
              type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)}
              placeholder="Nueva etiqueta..."
              className="flex-1 bg-white/[0.04] border border-white/[0.08] text-white rounded-xl py-2.5 px-4 font-sans text-sm transition-all outline-none placeholder:text-zinc-600 focus:border-indigo-500/40 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)]"
            />
            <button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-none h-[42px] px-4 rounded-xl cursor-pointer flex items-center gap-1.5 text-sm font-semibold font-sans transition-all hover:shadow-[0_4px_16px_rgba(99,102,241,0.25)] active:scale-[0.97] shrink-0">
              <Plus size={16} /> <span className="hidden sm:inline">Añadir</span>
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {tags.length === 0 ? (
              <div className="text-center py-8 text-zinc-600 text-sm w-full">Sin etiquetas aún</div>
            ) : tags.map((tag, i) => (
              <div key={tag.id} className="group flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.06] py-1.5 px-3 rounded-lg text-sm border border-white/[0.06] transition-all animate-fade-in" style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'both' }}>
                <span className="text-zinc-300 text-[0.8rem]">{tag.name}</span>
                <button onClick={() => handleDeleteTag(tag.id)} className="bg-transparent border-none text-zinc-600 cursor-pointer flex p-0 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all" title="Eliminar">
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Count badge */}
        <div className="px-4 sm:px-6 py-3 border-t border-white/[0.04] flex justify-between items-center">
          <span className="text-xs text-zinc-600">{tags.length} etiqueta{tags.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <ConfirmModal isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} type={confirmState.type}
        confirmText={confirmState.confirmText} cancelText={confirmState.cancelText} onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))} />
    </div>
  );
}
