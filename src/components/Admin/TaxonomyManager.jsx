import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, Layers, X } from 'lucide-react';
import './Admin.css';

export default function TaxonomyManager() {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  
  const [newCat, setNewCat] = useState('');
  const [newTag, setNewTag] = useState('');

  const fetchTaxonomies = async () => {
    try {
      const [catRes, tagRes] = await Promise.all([
        fetch('http://localhost:3000/api/categories'),
        fetch('http://localhost:3000/api/tags')
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
      const res = await fetch('http://localhost:3000/api/categories', {
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
      const res = await fetch('http://localhost:3000/api/tags', {
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

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('¿Eliminar esta categoría?')) return;
    await fetch(`http://localhost:3000/api/categories/${id}`, { method: 'DELETE' });
    fetchTaxonomies();
  };

  const handleDeleteTag = async (id) => {
    if (!window.confirm('¿Eliminar esta etiqueta?')) return;
    await fetch(`http://localhost:3000/api/tags/${id}`, { method: 'DELETE' });
    fetchTaxonomies();
  };

  return (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
      
      {/* Box Categorías */}
      <div className="table-container" style={{ flex: 1, padding: '24px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', margin: '0 0 16px 0' }}>
            <Layers size={20} /> Gestionar Categorías
        </h3>
        
        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <input 
                type="text" 
                value={newCat} 
                onChange={(e) => setNewCat(e.target.value)} 
                placeholder="Nueva categoría..."
                style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', padding: '10px 16px', fontFamily: 'inherit' }}
            />
            <button type="submit" className="admin-save-btn" style={{ padding: '0 16px' }}>
                <Plus size={18} /> Añadir
            </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {categories.map(cat => (
                <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px' }}>
                    <span>{cat.name}</span>
                    <button onClick={() => handleDeleteCategory(cat.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Eliminar">
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
        </div>
      </div>

      {/* Box Etiquetas */}
      <div className="table-container" style={{ flex: 1, padding: '24px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', margin: '0 0 16px 0' }}>
            <Tag size={20} /> Gestionar Etiquetas (Tags)
        </h3>
        
        <form onSubmit={handleAddTag} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <input 
                type="text" 
                value={newTag} 
                onChange={(e) => setNewTag(e.target.value)} 
                placeholder="Nueva etiqueta..."
                style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', padding: '10px 16px', fontFamily: 'inherit' }}
            />
            <button type="submit" className="admin-save-btn" style={{ padding: '0 16px' }}>
                <Plus size={18} /> Añadir
            </button>
        </form>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {tags.map(tag => (
                <div key={tag.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem' }}>
                    <span>{tag.name}</span>
                    <button onClick={() => handleDeleteTag(tag.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', padding: 0 }} title="Eliminar">
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
}
