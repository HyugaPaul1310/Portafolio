import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Settings, LogOut, Tags, User, Menu, X } from 'lucide-react';

const Dashboard = lazy(() => import('./Dashboard'));
const ProjectsManager = lazy(() => import('./ProjectsManager'));
const TaxonomyManager = lazy(() => import('./TaxonomyManager'));
const AboutManager = lazy(() => import('./AboutManager'));

export default function AdminLayout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} />, match: (p) => p === '/admin' },
    { to: '/admin/projects', label: 'Projects', icon: <FolderKanban size={20} />, match: (p) => p.includes('/projects') },
    { to: '/admin/taxonomies', label: 'Categorías / Tags', icon: <Tags size={20} />, match: (p) => p.includes('/taxonomies') },
    { to: '/admin/about', label: 'About', icon: <User size={20} />, match: (p) => p.includes('/about') },
    { to: '/admin/settings', label: 'Settings', icon: <Settings size={20} />, match: (p) => p.includes('/settings') },
  ];

  const pageTitle = location.pathname.includes('/projects') ? 'Manage Projects'
    : location.pathname.includes('/taxonomies') ? 'Categorías / Tags'
    : location.pathname.includes('/about') ? 'Manage About Me'
    : 'Dashboard Analytics';

  return (
    <div className="flex h-screen w-screen bg-[#09090f] text-gray-100 font-sans overflow-hidden">
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-md z-[999] transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMobileMenu}
      />

      {/* Sidebar */}
      <aside className={`
        flex flex-col z-[1000] relative transition-all duration-300 ease-out
        ${isCollapsed ? 'w-[82px]' : 'w-[270px]'}
        
        lg:relative lg:translate-x-0
        
        max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:w-[280px]
        max-lg:transition-transform max-lg:duration-300 max-lg:ease-out
        ${isMobileMenuOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'}
      `}>
        {/* Sidebar background with gradient border effect */}
        <div className="absolute inset-0 bg-[#0c0c14] border-r border-white/[0.06]" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-purple-500/20 via-transparent to-indigo-500/20" />

        <div className="relative flex flex-col h-full py-6 px-4">
          {/* Logo */}
          <div className={`flex items-center gap-3 mb-8 pb-6 border-b border-white/[0.06] ${isCollapsed ? 'justify-center px-0' : 'px-3'}`}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)' }}>
              <FolderKanban size={20} className="text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-lg font-bold text-white tracking-tight leading-tight">Admin</span>
                <span className="text-[0.65rem] uppercase tracking-[0.15em] text-purple-400/70 font-semibold">Control Panel</span>
              </div>
            )}
            {/* Mobile close button */}
            <button onClick={closeMobileMenu} className="ml-auto lg:hidden bg-transparent border-none text-zinc-400 cursor-pointer p-1 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Collapse toggle (desktop only) */}
          <button
            className="absolute -right-3 top-[72px] w-6 h-6 bg-[#1a1a28] text-zinc-400 border border-white/10 rounded-full flex items-center justify-center cursor-pointer z-[1001] transition-all hover:scale-110 hover:bg-purple-500 hover:text-white hover:border-purple-500 max-lg:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points={isCollapsed ? "9 18 15 12 9 6" : "15 18 9 12 15 6"} />
            </svg>
          </button>

          {/* Section label */}
          {!isCollapsed && <p className="text-[0.6rem] uppercase tracking-[0.2em] text-zinc-600 font-semibold px-3 mb-2">Menu</p>}

          {/* Nav */}
          <nav className="flex flex-col gap-1 flex-1">
            {navItems.map((item, i) => {
              const isActive = item.match(location.pathname);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeMobileMenu}
                  title={item.label}
                  className={`group flex items-center gap-3 rounded-xl font-medium text-[0.9rem] transition-all duration-200 relative no-underline
                    ${isCollapsed ? 'justify-center p-3' : 'py-3 px-4'}
                    ${isActive
                      ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/10 text-white'
                      : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]'
                    }`}
                  style={isActive ? { animationDelay: `${i * 50}ms` } : {}}
                >
                  {/* Active indicator bar */}
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-purple-500" />}
                  <span className={`transition-colors ${isActive ? 'text-purple-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}>{item.icon}</span>
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="pt-4 mt-auto border-t border-white/[0.06]">
            {!isCollapsed && <p className="text-[0.6rem] uppercase tracking-[0.2em] text-zinc-600 font-semibold px-3 mb-2">System</p>}
            <Link
              to="/"
              className={`group flex items-center gap-3 rounded-xl font-medium text-[0.9rem] transition-all no-underline text-zinc-500 hover:text-red-400 hover:bg-red-500/[0.06]
                ${isCollapsed ? 'justify-center p-3' : 'py-3 px-4'}`}
              title="Exit to Site"
            >
              <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
              {!isCollapsed && <span>Exit to Site</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-[#09090f] overflow-y-auto min-w-0">
        {/* Header */}
        <header className="h-16 lg:h-[72px] px-4 lg:px-8 flex items-center justify-between border-b border-white/[0.06] bg-[#09090f]/90 backdrop-blur-xl sticky top-0 z-50 shrink-0">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden bg-white/5 border border-white/10 rounded-lg text-zinc-400 cursor-pointer p-2 mr-3 hover:bg-white/10 hover:text-white transition-all active:scale-95"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-1 h-5 rounded-full bg-purple-500 shrink-0 max-sm:hidden" />
            <h2 className="text-base lg:text-xl font-semibold text-white truncate">{pageTitle}</h2>
          </div>

          {/* User profile */}
          <div className="flex items-center gap-3 py-1.5 px-3 bg-white/[0.04] rounded-xl border border-white/[0.06] cursor-pointer transition-all hover:bg-white/[0.07] hover:border-white/10 shrink-0">
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)' }}>P</div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[0.8rem] font-semibold text-white leading-tight">Paul Gonzalez</span>
              <span className="text-[0.6rem] text-zinc-500 font-medium">Administrator</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 animate-fade-in">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                <span className="text-zinc-500 text-sm">Loading module...</span>
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<ProjectsManager />} />
              <Route path="/taxonomies" element={<TaxonomyManager />} />
              <Route path="/about" element={<AboutManager />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}
