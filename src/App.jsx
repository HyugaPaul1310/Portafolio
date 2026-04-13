import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import ProjectsSection from './components/Projects/ProjectsSection';
import AboutSection from './components/About/AboutSection';
import ContactSection from './components/Contact/ContactSection';
import Footer from './components/Footer/Footer';
import AdminLayout from './components/Admin/AdminLayout';
import './App.css';

function PortfolioLayout() {
  // Track page view silently
  useEffect(() => {
    fetch('http://localhost:3000/api/analytics/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'home' })
    }).catch(() => {}); // fail silently
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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioLayout />} />
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
