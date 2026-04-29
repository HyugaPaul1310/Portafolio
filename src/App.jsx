import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import ProjectsSection from './components/Projects/ProjectsSection';
import AboutSection from './components/About/AboutSection';
import ContactSection from './components/Contact/ContactSection';
import Footer from './components/Footer/Footer';

// Lazy loading 
const AdminLayout = lazy(() => import('./components/Admin/AdminLayout'));
const LoginModal = lazy(() => import('./components/Admin/LoginModal'));
import './App.css';

function PortfolioLayout() {
  // Track page view silently
  useEffect(() => {
    fetch('http://localhost:3000/api/analytics/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'home' })
    }).catch(() => { }); // fail silently
  }, []);

  return (
    <>
      <div className="grain-overlay"></div>
      <Navbar />
      <main>
        <Hero />
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('admin_auth') === 'true'
  );
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const handleTrigger = () => setIsLoginOpen(true);
    window.addEventListener('trigger-admin-login', handleTrigger);
    return () => window.removeEventListener('trigger-admin-login', handleTrigger);
  }, []);

  const handleLoginSuccess = () => {
    sessionStorage.setItem('admin_auth', 'true');
    setIsAuthenticated(true);
    if (window.location.pathname !== '/admin') {
      window.location.href = '/admin';
    }
  };

  return (
    <Router>
      <Suspense fallback={
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
          <div className="loading-spinner"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<PortfolioLayout />} />
          <Route
            path="/admin/*"
            element={
              isAuthenticated ? (
                <AdminLayout />
              ) : (
                <div style={{
                  height: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#0a0a0a',
                  color: '#444'
                }}>
                  <p>Acceso Restringido</p>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    style={{
                      marginTop: '20px',
                      background: 'transparent',
                      border: '1px solid #333',
                      color: '#666',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Iniciar Sesión
                  </button>
                </div>
              )
            }
          />
        </Routes>

        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </Suspense>
    </Router>
  );
}

export default App;
