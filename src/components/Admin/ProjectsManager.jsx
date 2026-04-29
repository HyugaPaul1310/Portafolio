import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, FolderOpen } from 'lucide-react';
import ProjectFormModal from './ProjectFormModal';
import ConfirmModal from './ConfirmModal';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [confirmState, setConfirmState] = useState({
    isOpen: false, title: '', message: '', onConfirm: () => {}, type: 'primary'
  });

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/projects');
      if (!res.ok) throw new Error('API fetch error');
      const data = await res.json();
      const formattedData = data.map(p => ({
        ...p,
        tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
        gallery: typeof p.gallery === 'string' ? JSON.parse(p.gallery) : p.gallery
      }));
      setProjects(formattedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleAddNew = () => { setEditingProject(null); setIsModalOpen(true); };
  const handleEdit = (project) => { setEditingProject(project); setIsModalOpen(true); };

  const handleDelete = (id) => {
    setConfirmState({
      isOpen: true, title: '¿Eliminar Proyecto?',
      message: 'Esta acción no se puede deshacer. El proyecto será borrado permanentemente.',
      type: 'danger', confirmText: 'Sí, eliminar', cancelText: 'Cancelar',
      onConfirm: async () => {
        try { const res = await fetch(`http://localhost:3000/api/projects/${id}`, { method: 'DELETE' }); if (res.ok) fetchProjects(); }
        catch (error) { console.error(error); }
      }
    });
  };

  const handleSaveProject = async (formData) => {
    const isFormData = formData instanceof FormData;
    const id = isFormData ? formData.get('id') : formData.id;
    const isEditing = !!id;

    setConfirmState({
      isOpen: true,
      title: isEditing ? '¿Guardar Cambios?' : '¿Crear Proyecto?',
      message: isEditing ? '¿Deseas actualizar este proyecto?' : '¿Deseas añadir este nuevo proyecto?',
      type: 'primary', confirmText: isEditing ? 'Sí, guardar' : 'Sí, crear', cancelText: 'Cancelar',
      onConfirm: async () => {
        const url = isEditing ? `http://localhost:3000/api/projects/${id}` : 'http://localhost:3000/api/projects';
        try {
          const res = await fetch(url, {
            method: isEditing ? 'PUT' : 'POST',
            headers: isFormData ? {} : { 'Content-Type': 'application/json' },
            body: isFormData ? formData : JSON.stringify(formData)
          });
          if (res.ok) { setIsModalOpen(false); fetchProjects(); }
        } catch (error) { console.error(error); }
      }
    });
  };

  const filtered = projects.filter(p =>
    p.title_es?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.title_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        <span className="text-zinc-500 text-sm">Cargando proyectos...</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white outline-none placeholder:text-zinc-600 transition-all focus:border-purple-500/40 focus:shadow-[0_0_0_3px_rgba(168,85,247,0.08)]"
          />
        </div>
        <button
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none py-2.5 px-5 rounded-xl cursor-pointer flex items-center justify-center gap-2 text-sm font-semibold font-sans transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(168,85,247,0.25)] active:scale-[0.98] shrink-0"
          onClick={handleAddNew}>
          <Plus size={16} /> Nuevo Proyecto
        </button>
      </div>

      {/* Table / Cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500 bg-[#0e0e18] rounded-2xl border border-white/[0.06]">
          <FolderOpen size={40} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">No se encontraron proyectos</p>
          <p className="text-xs text-zinc-600 mt-1">{searchTerm ? 'Intenta con otro término de búsqueda' : 'Crea tu primer proyecto'}</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-[#0e0e18] rounded-2xl border border-white/[0.06] overflow-hidden">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  {['ID', 'Título', 'Categoría', 'Acciones'].map(h => (
                    <th key={h} className="py-3.5 px-5 text-zinc-500 font-medium text-xs uppercase tracking-wider border-b border-white/[0.04]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5 border-b border-white/[0.03] text-zinc-500 text-sm font-mono">#{p.id}</td>
                    <td className="py-3.5 px-5 border-b border-white/[0.03]">
                      <div className="text-white font-medium text-sm">{p.title_es}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{p.title_en}</div>
                    </td>
                    <td className="py-3.5 px-5 border-b border-white/[0.03]">
                      <span className="py-1 px-2.5 rounded-lg text-xs font-medium" style={{ background: p.color + '18', color: p.color }}>{p.category}</span>
                    </td>
                    <td className="py-3.5 px-5 border-b border-white/[0.03]">
                      <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button className="bg-transparent border-none p-2 rounded-lg cursor-pointer text-zinc-400 flex items-center justify-center transition-all hover:bg-purple-500/10 hover:text-purple-400" onClick={() => handleEdit(p)} title="Editar"><Edit2 size={15} /></button>
                        <button className="bg-transparent border-none p-2 rounded-lg cursor-pointer text-zinc-400 flex items-center justify-center transition-all hover:bg-red-500/10 hover:text-red-400" onClick={() => handleDelete(p.id)} title="Eliminar"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden flex flex-col gap-3">
            {filtered.map(p => (
              <div key={p.id} className="bg-[#0e0e18] rounded-2xl border border-white/[0.06] p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: p.color + '15', color: p.color }}>
                  #{p.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm truncate">{p.title_es}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="py-0.5 px-2 rounded text-[0.65rem] font-medium" style={{ background: p.color + '18', color: p.color }}>{p.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <button className="bg-transparent border-none p-2 rounded-lg cursor-pointer text-zinc-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all" onClick={() => handleEdit(p)}><Edit2 size={16} /></button>
                  <button className="bg-transparent border-none p-2 rounded-lg cursor-pointer text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all" onClick={() => handleDelete(p.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {isModalOpen && <ProjectFormModal project={editingProject} onClose={() => setIsModalOpen(false)} onSave={handleSaveProject} />}
      <ConfirmModal isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} type={confirmState.type}
        confirmText={confirmState.confirmText} cancelText={confirmState.cancelText} onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))} />
    </div>
  );
}
