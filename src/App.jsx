import Hero from './components/Hero/Hero';
import ProjectsSection from './components/Projects/ProjectsSection';
import AboutSection from './components/About/AboutSection';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  return (
    <>
      <div className="grain-overlay"></div>

      <main>
        <Hero />
        <ProjectsSection />
        <AboutSection />
      </main>

      <Footer />
    </>
  );
}

export default App;
