import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, X } from 'lucide-react';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.success) {
        onLoginSuccess();
        onClose();
      } else {
        setError(data.message || 'Contraseña incorrecta');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="neon-login-card">
        <button className="close-login" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="login-header">
          <div className="neon-icon">
            <ShieldCheck size={40} />
          </div>
          <h2>Admin Access</h2>
          <p>Identificación requerida para el panel de control</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group-neon">
            <Lock className="input-icon" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña Maestra"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              className="toggle-visible"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <div className="neon-border"></div>
          </div>

          {error && <div className="login-error-neon">{error}</div>}

          <button type="submit" disabled={loading} className="neon-submit-btn">
            {loading ? <span className="loader-neon"></span> : 'Acceder'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
