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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className={`admin-container ${isCollapsed ? 'sidebar-collapsed' : ''} ${isMobileMenuOpen ? 'mobile-menu-active' : ''}`}>
      {/* Mobile Overlay */}
      <div className="admin-mobile-overlay" onClick={toggleMobileMenu}></div>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-logo">
          <FolderKanban size={28} className="logo-icon" />
          {!isCollapsed && <span>Admin Portal</span>}
        </div>
        
        <button className="sidebar-collapse-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points={isCollapsed ? "9 18 15 12 9 6" : "15 18 9 12 15 6"} />
          </svg>
        </button>

        <nav className="admin-nav">
          <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} title="Dashboard">
            <LayoutDashboard size={20} />
            {!isCollapsed && <span>Dashboard</span>}
          </Link>
          <Link to="/admin/projects" onClick={() => setIsMobileMenuOpen(false)} className={`nav-link ${location.pathname.includes('/projects') ? 'active' : ''}`} title="Projects">
            <FolderKanban size={20} />
            {!isCollapsed && <span>Projects</span>}
          </Link>
          <Link to="/admin/taxonomies" onClick={() => setIsMobileMenuOpen(false)} className={`nav-link ${location.pathname.includes('/taxonomies') ? 'active' : ''}`} title="Categorías / Tags">
            <Tags size={20} />
            {!isCollapsed && <span>Categorías / Tags</span>}
          </Link>
          <Link to="/admin/about" onClick={() => setIsMobileMenuOpen(false)} className={`nav-link ${location.pathname.includes('/about') ? 'active' : ''}`} title="About">
            <User size={20} />
            {!isCollapsed && <span>About</span>}
          </Link>
          <Link to="/admin/settings" onClick={() => setIsMobileMenuOpen(false)} className={`nav-link ${location.pathname.includes('/settings') ? 'active' : ''}`} title="Settings">
            <Settings size={20} />
            {!isCollapsed && <span>Settings</span>}
          </Link>
        </nav>

        <div className="admin-footer">
          <Link to="/" className="nav-link logout" title="Exit to Site">
            <LogOut size={20} />
            {!isCollapsed && <span>Exit to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Open Mobile Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h2>
            {location.pathname.includes('/projects') ? 'Manage Projects' : 
             location.pathname.includes('/taxonomies') ? 'Categorías / Tags' : 
             location.pathname.includes('/about') ? 'Manage About Me' : 
             'Dashboard Analytics'}
          </h2>
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
