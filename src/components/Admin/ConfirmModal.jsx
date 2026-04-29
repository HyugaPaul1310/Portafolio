import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'primary',
  showButtons = true
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const isDanger = type === 'danger';

  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[2000] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      <div className={`bg-[#12121c] border border-white/[0.06] rounded-2xl sm:rounded-3xl w-full max-w-[440px] py-10 px-6 sm:py-12 sm:px-10 relative flex flex-col items-center text-center transition-all duration-300
        ${isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}`}
        style={{ boxShadow: '0 40px 80px rgba(0, 0, 0, 0.5)', transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>

        {/* Top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent to-transparent ${isDanger ? 'via-red-500/60' : 'via-purple-500/60'}`} />

        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${isDanger ? 'bg-red-500/10 text-red-400' : 'bg-purple-500/10 text-purple-400'}`}>
          {isDanger ? <AlertTriangle size={28} /> : <CheckCircle size={28} />}
        </div>

        <h3 className="m-0 mb-3 text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h3>
        <p className="m-0 text-zinc-400 leading-relaxed text-sm sm:text-[0.95rem]">{message}</p>

        {showButtons && (
          <div className="mt-8 flex gap-3 w-full flex-col-reverse sm:flex-row">
            <button
              className="flex-1 py-3 sm:py-3.5 px-6 rounded-xl font-semibold text-sm cursor-pointer transition-all font-sans flex items-center justify-center bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:bg-white/[0.08] hover:text-white hover:border-white/15 active:scale-[0.98]"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button
              className={`flex-1 py-3 sm:py-3.5 px-6 rounded-xl font-semibold text-sm cursor-pointer transition-all font-sans flex items-center justify-center border-none text-white hover:-translate-y-0.5 active:scale-[0.98] ${isDanger
                ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-[0_8px_24px_rgba(239,68,68,0.3)]'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:shadow-[0_8px_24px_rgba(168,85,247,0.3)]'
                }`}
              onClick={() => { onConfirm(); onCancel(); }}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmModal;
