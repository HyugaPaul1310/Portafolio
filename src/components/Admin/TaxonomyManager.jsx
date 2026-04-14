import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, Layers, X } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import './Admin.css';

export default function TaxonomyManager() {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  
  const [newCat, setNewCat] = useState('');
  const [newTag, setNewTag] = useState('');

  // Custom Confirm Modal State
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'primary'
  });

  const fetchTaxonomies = async () => {
    try {
      const [catRes, tagRes] = await Promise.all([
        fetch('http://localhost:3000/api/taxonomy/categories'),
        fetch('http://localhost:3000/api/taxonomy/tags')
      ]);
      setCategories(await catRes.json());
      setTags(await tagRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTaxonomies();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    try {
      const res = await fetch('http://localhost:3000/api/taxonomy/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCat.trim() })
      });
      if (res.ok) {
        setNewCat('');
        fetchTaxonomies();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    try {
      const res = await fetch('http://localhost:3000/api/taxonomy/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTag.trim() })
      });
      if (res.ok) {
        setNewTag('');
        fetchTaxonomies();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = (id) => {
    setConfirmState({
      isOpen: true,
      title: '¿Eliminar Categoría?',
      message: '¿Estás seguro de que deseas eliminar esta categoría? Los proyectos asociados podrían quedar sin categoría.',
      type: 'danger',
      confirmText: 'Sí, borrar categoría',
      cancelText: 'Mejor no',
      onConfirm: async () => {
        await fetch(`http://localhost:3000/api/taxonomy/categories/${id}`, { method: 'DELETE' });
        fetchTaxonomies();
      }
    });
  };

  const handleDeleteTag = (id) => {
    setConfirmState({
      isOpen: true,
      title: '¿Eliminar Etiqueta?',
      message: '¿Deseas borrar esta etiqueta permanentemente?',
      type: 'danger',
      confirmText: 'Sí, borrar etiqueta',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        await fetch(`http://localhost:3000/api/taxonomy/tags/${id}`, { method: 'DELETE' });
        fetchTaxonomies();
      }
    });
  };

  return (
    <div className="taxonomy-manager-grid">
      
      {/* Box Categorías */}
      <div className="table-container taxonomy-box">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', margin: '0 0 16px 0' }}>
            <Layers size={20} /> Gestionar Categorías
        </h3>
        
        <form onSubmit={handleAddCategory} className="taxonomy-form">
            <input 
                type="text" 
                value={newCat} 
                onChange={(e) => setNewCat(e.target.value)} 
                placeholder="Nueva categoría..."
                className="taxonomy-input"
            />
            <button type="submit" className="admin-save-btn taxonomy-btn">
                <Plus size={18} /> Añadir
            </button>
        </form>

        <div className="taxonomy-list">
            {categories.map(cat => (
                <div key={cat.id} className="taxonomy-item">
                    <span>{cat.name}</span>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="taxonomy-delete-btn" title="Eliminar">
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
        </div>
      </div>

      {/* Box Etiquetas */}
      <div className="table-container taxonomy-box">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', margin: '0 0 16px 0' }}>
            <Tag size={20} /> Gestionar Etiquetas (Tags)
        </h3>
        
        <form onSubmit={handleAddTag} className="taxonomy-form">
            <input 
                type="text" 
                value={newTag} 
                onChange={(e) => setNewTag(e.target.value)} 
                placeholder="Nueva etiqueta..."
                className="taxonomy-input"
            />
            <button type="submit" className="admin-save-btn taxonomy-btn">
                <Plus size={18} /> Añadir
            </button>
        </form>

        <div className="taxonomy-tags-cloud">
            {tags.map(tag => (
                <div key={tag.id} className="taxonomy-tag-pill">
                    <span>{tag.name}</span>
                    <button onClick={() => handleDeleteTag(tag.id)} className="taxonomy-tag-delete" title="Eliminar">
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        type={confirmState.type}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}
