import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Settings, LogOut, Tags, User } from 'lucide-react';
import ProjectsManager from './ProjectsManager';
import TaxonomyManager from './TaxonomyManager';
import Dashboard from './Dashboard';
import AboutManager from './AboutManager';
import './Admin.css';

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <FolderKanban size={28} className="logo-icon" />
          <span>Admin Portal</span>
        </div>
        
        <nav className="admin-nav">
          <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/admin/projects" className={`nav-link ${location.pathname.includes('/projects') ? 'active' : ''}`}>
            <FolderKanban size={20} />
            Projects
          </Link>
          <Link to="/admin/taxonomies" className={`nav-link ${location.pathname.includes('/taxonomies') ? 'active' : ''}`}>
            <Tags size={20} />
            Categorías / Tags
          </Link>
          <Link to="/admin/about" className={`nav-link ${location.pathname.includes('/about') ? 'active' : ''}`}>
            <User size={20} />
            About
          </Link>
          <Link to="/admin/settings" className={`nav-link ${location.pathname.includes('/settings') ? 'active' : ''}`}>
            <Settings size={20} />
            Settings
          </Link>
        </nav>

        <div className="admin-footer">
          <Link to="/" className="nav-link logout">
            <LogOut size={20} />
            Exit to Site
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <h2>{location.pathname.includes('/projects') ? 'Manage Projects' : location.pathname.includes('/taxonomies') ? 'Categorías / Tags' : 'Dashboard Analytics'}</h2>
          <div className="admin-user-profile">
            <div className="avatar">P</div>
            <span>Paul Gonzalez</span>
          </div>
        </header>

        <div className="admin-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectsManager />} />
            <Route path="/taxonomies" element={<TaxonomyManager />} />
            <Route path="/about" element={<AboutManager />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
