import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, X } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex justify-center items-center z-[9999] p-4 animate-fade-in">
      {/* Ambient glow circles */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none blur-3xl max-sm:w-[300px] max-sm:h-[300px]"
        style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }} />

      <div className="w-full max-w-[420px] bg-[#0e0e16] rounded-2xl sm:rounded-3xl p-8 sm:p-10 relative overflow-hidden animate-scale-up border border-white/[0.08]"
        style={{ boxShadow: '0 0 80px rgba(168, 85, 247, 0.12), 0 30px 60px rgba(0,0,0,0.5)' }}>
        {/* Decorative top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

        <button className="absolute top-4 right-4 bg-white/5 border-none rounded-lg text-zinc-500 cursor-pointer hover:text-white hover:bg-white/10 transition-all p-2 z-10" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl flex justify-center items-center mx-auto mb-5 text-purple-400 animate-glow-pulse"
            style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(99,102,241,0.15))', border: '1px solid rgba(168,85,247,0.3)' }}>
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl sm:text-[1.85rem] font-bold text-white mb-2 tracking-tight font-heading">Admin Access</h2>
          <p className="text-zinc-500 text-sm">Identificación requerida para el panel de control</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          <div className="relative flex items-center group">
            <Lock className="absolute left-4 text-zinc-600 transition-colors group-focus-within:text-purple-400" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña Maestra"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full py-4 pl-12 pr-12 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-[0.95rem] outline-none transition-all placeholder:text-zinc-600 focus:bg-purple-500/[0.04] focus:border-purple-500/40 focus:shadow-[0_0_0_3px_rgba(168,85,247,0.08)]"
            />
            <button
              type="button"
              className="absolute right-4 bg-transparent border-none text-zinc-600 cursor-pointer transition-colors hover:text-zinc-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/[0.08] border border-red-500/20 text-red-400 py-3 px-4 rounded-xl text-sm text-center animate-fade-in-up flex items-center gap-2 justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="relative text-white border-none py-4 rounded-xl font-bold text-[0.95rem] cursor-pointer transition-all flex justify-center items-center overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #7c3aed, #6366f1)',
              boxShadow: '0 4px 20px rgba(168, 85, 247, 0.25)'
            }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
            {loading ? <span className="w-5 h-5 border-2 border-white/30 rounded-full border-t-white animate-spin" /> : 'Acceder'}
          </button>
        </form>

        {/* Bottom text */}
        <p className="text-center text-[0.7rem] text-zinc-600 mt-6">Secured with SHA-256 encryption</p>
      </div>
    </div>
  );
};

export default LoginModal;
