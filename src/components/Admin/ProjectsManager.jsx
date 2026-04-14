import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import ProjectFormModal from './ProjectFormModal';
import ConfirmModal from './ConfirmModal';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Custom Confirm Modal State
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'primary'
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

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddNew = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setConfirmState({
      isOpen: true,
      title: '¿Eliminar Proyecto?',
      message: 'Esta acción no se puede deshacer. El proyecto será borrado permanentemente de la base de datos.',
      type: 'danger',
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/projects/${id}`, { method: 'DELETE' });
          if (res.ok) fetchProjects();
        } catch (error) {
          console.error(error);
        }
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
      message: isEditing 
        ? '¿Estás seguro de que deseas actualizar la información de este proyecto?' 
        : '¿Estás seguro de que deseas añadir este nuevo proyecto al portafolio?',
      type: 'primary',
      confirmText: isEditing ? 'Sí, guardar ahora' : 'Sí, crear ahora',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        const url = isEditing ? `http://localhost:3000/api/projects/${id}` : 'http://localhost:3000/api/projects';
        const method = isEditing ? 'PUT' : 'POST';

        try {
          const res = await fetch(url, {
            method,
            headers: isFormData ? {} : { 'Content-Type': 'application/json' },
            body: isFormData ? formData : JSON.stringify(formData)
          });
          if (res.ok) {
            setIsModalOpen(false);
            fetchProjects();
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  if (loading) return <div style={{ color: '#fff', padding: '40px', textAlign: 'center' }}>Cargando proyectos...</div>;

  return (
    <div className="projects-manager">
      <div className="table-actions">
        <button className="admin-save-btn" onClick={handleAddNew}>
          <Plus size={18} />
          Nuevo Proyecto
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título (ES)</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>No existen proyectos.</td></tr>
            ) : (
              projects.map(p => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>
                    <strong>{p.title_es}</strong>
                    <div style={{ fontSize: '12px', color: '#a1a1aa' }}>{p.title_en}</div>
                  </td>
                  <td>
                    <span style={{ 
                      background: p.color + '22', 
                      color: p.color, 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {p.category}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="actions-wrapper">
                      <button className="icon-btn edit" onClick={() => handleEdit(p)} title="Editar"><Edit2 size={16} /></button>
                      <button className="icon-btn delete" onClick={() => handleDelete(p.id)} title="Eliminar"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ProjectFormModal 
          project={editingProject} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveProject} 
        />
      )}

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
