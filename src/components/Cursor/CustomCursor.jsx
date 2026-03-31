import React, { useEffect, useState, useRef } from 'react';
import './Cursor.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile - touch screens don't need custom cursors
    if (typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
      setIsMobile(true);
      return;
    }

    const handleMouseMove = (e) => {
      setIsVisible(true);
      if (dotRef.current) {
        // Direct tracking 1:1, no delay for maximum responsiveness
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Event delegation to check hovering state on interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName?.toLowerCase() === 'a' ||
        target.tagName?.toLowerCase() === 'button' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.classList?.contains('nav-item') ||
        target.classList?.contains('logo-text') ||
        target.classList?.contains('project-card');
                          
      if (isInteractive) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName?.toLowerCase() === 'a' ||
        target.tagName?.toLowerCase() === 'button' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.classList?.contains('nav-item') ||
        target.classList?.contains('logo-text') ||
        target.classList?.contains('project-card');
                          
      if (isInteractive) {
        setIsHovering(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  if (isMobile) return null;

  return (
    <div 
      ref={dotRef} 
      className={`cursor-wrapper ${isVisible ? 'visible' : ''}`}
    >
      <div className={`cursor-dot ${isHovering ? 'hovering' : ''}`} />
    </div>
  );
}
