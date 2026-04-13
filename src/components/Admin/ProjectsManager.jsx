import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import ProjectFormModal from './ProjectFormModal';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/projects');
      if (!res.ok) throw new Error('API fetch error');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
      alert('Error fetching projects. Is the backend running?');
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

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este proyecto?')) {
      try {
        const res = await fetch(`http://localhost:3000/api/projects/${id}`, { method: 'DELETE' });
        if (res.ok) fetchProjects();
      } catch (error) {
        console.error(error);
        alert('Failed to delete project');
      }
    }
  };

  const handleSaveProject = async (formData) => {
    const isFormData = formData instanceof FormData;
    const id = isFormData ? formData.get('id') : formData.id;
    const isEditing = !!id;
    
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
      } else {
        alert('Error saving project.');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to save project');
    }
  };

  if (loading) return <div style={{ color: '#fff' }}>Loading projects...</div>;

  return (
    <div className="projects-manager">
      <div className="table-actions">
        <button className="admin-save-btn" onClick={handleAddNew}>
          <Plus size={18} />
          Add New Project
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
    </div>
  );
}
