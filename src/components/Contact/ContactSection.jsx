import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Globe, Monitor, Smartphone, Code,
  Send, MessageCircle, Mail, Clock,
  FileText, CheckCircle, Zap, Paperclip,
  User, AtSign, AlertCircle, X, Check,
  ArrowRight
} from 'lucide-react';

const SERVICE_OPTIONS = [
  { id: 'web_page', Icon: Globe },
  { id: 'system_web', Icon: Monitor },
  { id: 'app', Icon: Smartphone },
  { id: 'other', Icon: Code },
];

export default function ContactSection() {
  const { t } = useTranslation();
  const [method, setMethod] = useState('email'); // 'email' | 'whatsapp'
  const [aboutData, setAboutData] = useState(null);
  // status: 'idle' | 'confirming' | 'sending' | 'success'
  const [status, setStatus] = useState('idle');
  const sendTimeoutRef = useRef(null);

  const [emailForm, setEmailForm] = useState({
    name: '', email: '', service: '', customService: '', message: ''
  });
  const [waForm, setWaForm] = useState({
    name: '', service: '', customService: '', message: ''
  });

  useEffect(() => {
    fetch('http://localhost:3000/api/about')
      .then(res => res.json())
      .then(data => setAboutData(data))
      .catch(() => { });
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => { if (sendTimeoutRef.current) clearTimeout(sendTimeoutRef.current); };
  }, []);

  /* ── helpers ── */
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailForm(prev => ({ ...prev, [name]: value }));
  };

  const handleWaChange = (e) => {
    const { name, value } = e.target;
    setWaForm(prev => ({ ...prev, [name]: value }));
  };

  const selectEmailService = (id) => {
    setEmailForm(prev => ({
      ...prev, service: id,
      customService: id === 'other' ? prev.customService : ''
    }));
  };

  const selectWaService = (id) => {
    setWaForm(prev => ({
      ...prev, service: id,
      customService: id === 'other' ? prev.customService : ''
    }));
  };

  /* ── form submit → show confirmation ── */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setStatus('confirming');
  };

  /* ── cancel confirmation ── */
  const handleCancel = () => setStatus('idle');

  /* ── confirm → run send animation → then open link ── */
  const handleConfirm = () => {
    setStatus('sending');

    sendTimeoutRef.current = setTimeout(() => {
      // Actually open the link
      if (method === 'email') {
        doSendEmail();
      } else {
        doSendWhatsApp();
      }
      setStatus('success');

      // Reset after 4 seconds
      sendTimeoutRef.current = setTimeout(() => {
        setStatus('idle');
      }, 4000);
    }, 1800); // animation duration
  };

  /* ── actual send logic ── */
  const doSendEmail = () => {
    const targetEmail = aboutData?.email || aboutData?.contact_email || 'contacto@example.com';
    const serviceName = emailForm.service === 'other'
      ? emailForm.customService
      : t(`contact.form.services.${emailForm.service}`);
    const subject = encodeURIComponent(`Nuevo proyecto: ${serviceName}`);
    const body = encodeURIComponent(
      `Hola, soy ${emailForm.name} (${emailForm.email}).\n\nTipo de proyecto: ${serviceName}\n\nMensaje:\n${emailForm.message}`
    );
    window.open(`mailto:${targetEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  const doSendWhatsApp = () => {
    const waUrl = aboutData?.whatsapp_url || 'https://wa.me/';
    const phone = waUrl.replace(/\D/g, '');
    const serviceName = waForm.service === 'other'
      ? waForm.customService
      : t(`contact.form.services.${waForm.service}`);
    const text = encodeURIComponent(
      `Hola! Soy ${waForm.name}.\n\nMe interesa un proyecto de tipo: ${serviceName}\n\n${waForm.message}`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleReset = () => {
    setStatus('idle');
    if (method === 'email') {
      setEmailForm({ name: '', email: '', service: '', customService: '', message: '' });
    } else {
      setWaForm({ name: '', service: '', customService: '', message: '' });
    }
  };

  const isEmail = method === 'email';
  const currentForm = isEmail ? emailForm : waForm;
  const serviceName = currentForm.service === 'other'
    ? currentForm.customService
    : (currentForm.service ? t(`contact.form.services.${currentForm.service}`) : '');

  return (
    <section className="relative w-full py-[120px] px-5 bg-transparent overflow-hidden" id="contact">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-12">

        {/* ── Hero header ── */}
        <header className="text-center">
          <span className="inline-flex items-center gap-2 px-[18px] py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-[13px] font-medium tracking-wide mb-6">
            <span className="w-[7px] h-[7px] rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse-dot" />
            {t('contact.available_badge')}
          </span>
          <h2 className="font-heading text-[clamp(30px,5vw,52px)] font-bold tracking-tight text-white mb-4 leading-tight">
            {t('contact.title_plain')}{' '}
            <span className="bg-gradient-to-br from-purple-500 to-purple-400 bg-clip-text text-transparent">
              {t('contact.title_highlight')}
            </span>
          </h2>
          <p className="text-gray-400 text-base max-w-[560px] mx-auto leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </header>

        {/* ── Toggle tabs ── */}
        <div className="flex justify-center">
          <div className="flex relative bg-white/5 border border-white/10 rounded-xl p-1 gap-0">
            <button
              type="button"
              className={`relative z-10 flex items-center gap-2 px-7 py-3 rounded-lg font-sans text-sm font-semibold transition-colors whitespace-nowrap ${isEmail ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
              onClick={() => { setMethod('email'); setStatus('idle'); }}
            >
              <Mail size={16} />
              {t('contact.toggle.email')}
            </button>
            <button
              type="button"
              className={`relative z-10 flex items-center gap-2 px-7 py-3 rounded-lg font-sans text-sm font-semibold transition-colors whitespace-nowrap ${!isEmail ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
              onClick={() => { setMethod('whatsapp'); setStatus('idle'); }}
            >
              <MessageCircle size={16} />
              {t('contact.toggle.whatsapp')}
            </button>
            <span 
              className={`absolute top-1 w-[calc(50%-4px)] h-[calc(100%-8px)] rounded-lg transition-all duration-300 ease-in-out z-0
              ${isEmail 
                ? 'left-1 bg-purple-500/20 border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
                : 'left-[calc(50%)] bg-green-500/15 border border-green-500/35 shadow-[0_0_20px_rgba(37,211,102,0.12)]'
              }`} 
            />
          </div>
        </div>

        {/* ── Content: Two columns ── */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-10 items-start animate-fade-in-up">

          {/* Left column — value props */}
          <div className="pt-2">
            <h3 className="font-heading text-2xl font-bold text-white mb-3 leading-tight">
              {isEmail ? t('contact.email_panel.title') : t('contact.wa_panel.title')}
            </h3>
            <p className="text-gray-400 text-[15px] leading-relaxed mb-8">
              {isEmail ? t('contact.email_panel.desc') : t('contact.wa_panel.desc')}
            </p>

            <ul className="flex flex-col gap-6 m-0 p-0 list-none">
              {(isEmail
                ? [
                  { Icon: Clock, titleKey: 'contact.email_panel.v1_title', descKey: 'contact.email_panel.v1_desc' },
                  { Icon: FileText, titleKey: 'contact.email_panel.v2_title', descKey: 'contact.email_panel.v2_desc' },
                  { Icon: CheckCircle, titleKey: 'contact.email_panel.v3_title', descKey: 'contact.email_panel.v3_desc' },
                ]
                : [
                  { Icon: Zap, titleKey: 'contact.wa_panel.v1_title', descKey: 'contact.wa_panel.v1_desc' },
                  { Icon: Clock, titleKey: 'contact.wa_panel.v2_title', descKey: 'contact.wa_panel.v2_desc' },
                  { Icon: Paperclip, titleKey: 'contact.wa_panel.v3_title', descKey: 'contact.wa_panel.v3_desc' },
                ]
              ).map((v, i) => (
                <li key={i} className="flex items-start gap-3.5 relative">
                  <div className={`w-[3px] rounded-sm self-stretch shrink-0 ${isEmail ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-green-500 shadow-[0_0_10px_rgba(37,211,102,0.4)]'}`} />
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${isEmail ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                    <v.Icon size={18} />
                  </div>
                  <div>
                    <strong className="block text-[15px] font-semibold text-gray-100 mb-1">{t(v.titleKey)}</strong>
                    <p className="text-[13px] text-gray-400 leading-relaxed m-0">{t(v.descKey)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column — form card */}
          <div className="flex">
            <div className="w-full bg-[#0e0e1e]/55 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-9 relative min-h-[480px] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-${isEmail ? 'purple' : 'green'}-500/50 to-transparent`} />

              {/* ── CONFIRMATION OVERLAY ── */}
              {status === 'confirming' && (
                <div className="absolute inset-0 bg-[#080814]/90 backdrop-blur-md z-50 flex items-center justify-center p-6 rounded-2xl animate-fade-in">
                  <div className="bg-[#121224]/95 border border-white/10 rounded-2xl p-6 sm:p-9 max-w-[420px] w-full text-center relative shadow-[0_32px_64px_rgba(0,0,0,0.6)] animate-scale-up">
                    <button className="absolute top-4 right-4 bg-white/5 border border-white/10 rounded-lg w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors" onClick={handleCancel} type="button">
                      <X size={18} />
                    </button>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 border animate-bounce-subtle ${isEmail ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                      <AlertCircle size={32} />
                    </div>
                    <h4 className="font-heading text-[22px] font-bold text-white m-0 mb-2">{t('contact.confirm.title')}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed m-0 mb-6">{t('contact.confirm.msg')}</p>

                    {/* Summary */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-left">
                      <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t('contact.form.name')}</span>
                        <span className="text-sm text-gray-100 font-medium">{currentForm.name}</span>
                      </div>
                      {isEmail && (
                        <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t('contact.form.email')}</span>
                          <span className="text-sm text-gray-100 font-medium truncate max-w-[150px] sm:max-w-[200px]">{emailForm.email}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t('contact.form.project_type')}</span>
                        <span className="text-sm text-gray-100 font-medium text-right max-w-[150px] truncate">{serviceName}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 py-3 px-4 rounded-xl font-sans font-semibold text-sm cursor-pointer bg-transparent border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white hover:border-white/20 transition-colors" onClick={handleCancel} type="button">
                        {t('contact.confirm.cancel')}
                      </button>
                      <button
                        className={`flex-[1.5] py-3 px-4 rounded-xl font-heading font-bold text-sm cursor-pointer border-none text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 ${isEmail ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-[0_8px_24px_rgba(168,85,247,0.4)] hover:shadow-[0_12px_32px_rgba(168,85,247,0.55)]' : 'bg-gradient-to-br from-green-500 to-green-600 shadow-[0_8px_24px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.5)]'}`}
                        onClick={handleConfirm}
                        type="button"
                      >
                        {t('contact.confirm.send')}
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SENDING ANIMATION OVERLAY ── */}
              {status === 'sending' && (
                <div className="absolute inset-0 bg-[#080814]/90 backdrop-blur-md z-50 flex items-center justify-center rounded-2xl animate-fade-in">
                  <div className="flex flex-col items-center gap-7 animate-scale-up">
                    <div className="relative flex items-center justify-center w-[120px] h-[120px]">
                      <div className={`absolute rounded-full border-2 border-transparent w-[120px] h-[120px] animate-[spin_2s_linear_infinite] ${isEmail ? 'border-t-purple-500 border-r-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-t-green-500 border-r-green-500/30 shadow-[0_0_20px_rgba(37,211,102,0.15)]'}`} />
                      <div className={`absolute rounded-full border-2 border-transparent w-[90px] h-[90px] animate-[spin_1.5s_linear_infinite_reverse] ${isEmail ? 'border-t-purple-400 border-l-purple-400/20' : 'border-t-green-400 border-l-green-400/20'}`} />
                      <div className={`absolute rounded-full border-2 border-transparent w-[60px] h-[60px] animate-[spin_1s_linear_infinite] ${isEmail ? 'border-b-purple-500 border-r-purple-500/40' : 'border-b-green-500 border-r-green-500/40'}`} />
                      <div className="relative z-10 text-white animate-pulse">
                        {isEmail ? <Send size={28} /> : <MessageCircle size={28} />}
                      </div>
                    </div>
                    <p className="font-heading text-base font-semibold text-gray-400 tracking-wide m-0">{t('contact.confirm.sending')}</p>
                    <div className="w-[200px] h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full animate-progress ${isEmail ? 'bg-gradient-to-r from-purple-500 to-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.6)]' : 'bg-gradient-to-r from-green-500 to-green-400 shadow-[0_0_12px_rgba(37,211,102,0.6)]'}`} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── SUCCESS STATE ── */}
              {status === 'success' && (
                <div className="absolute inset-0 bg-[#080814]/90 backdrop-blur-md z-50 flex items-center justify-center rounded-2xl animate-fade-in">
                  <div className="flex flex-col items-center gap-4 animate-scale-up text-center px-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center relative mb-2 ${isEmail ? 'text-purple-400' : 'text-green-400'}`}>
                      <div className={`absolute inset-0 rounded-full opacity-20 animate-ping ${isEmail ? 'bg-purple-500' : 'bg-green-500'}`} />
                      <div className={`absolute inset-0 rounded-full opacity-20 ${isEmail ? 'bg-purple-500' : 'bg-green-500'}`} />
                      <Check size={40} strokeWidth={3} className="relative z-10" />
                    </div>
                    <h4 className="font-heading text-2xl font-bold text-white m-0">{t('contact.confirm.success_title')}</h4>
                    <p className="text-gray-400 text-[15px] leading-relaxed max-w-[280px] m-0 mb-4">{t('contact.confirm.success_msg')}</p>
                    <button className="py-2.5 px-6 rounded-xl font-sans font-semibold text-sm cursor-pointer bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors" onClick={handleReset} type="button">
                      {t('contact.confirm.another')}
                    </button>
                  </div>
                </div>
              )}

              {/* ── FORM ── */}
              {isEmail ? (
                <form className={`flex flex-col gap-5 ${status !== 'idle' ? 'opacity-0 pointer-events-none absolute inset-0' : 'transition-opacity duration-300'}`} onSubmit={handleFormSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        <User size={13} />
                        {t('contact.form.name')}
                      </label>
                      <input
                        type="text" name="name" className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl font-sans text-[15px] outline-none transition-all placeholder:text-white/20 focus:bg-purple-500/5 focus:border-purple-500/40 focus:ring-[3px] focus:ring-purple-500/10"
                        placeholder={t('contact.form.placeholder_name')}
                        value={emailForm.name} onChange={handleEmailChange} required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        <AtSign size={13} />
                        {t('contact.form.email')}
                      </label>
                      <input
                        type="email" name="email" className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl font-sans text-[15px] outline-none transition-all placeholder:text-white/20 focus:bg-purple-500/5 focus:border-purple-500/40 focus:ring-[3px] focus:ring-purple-500/10"
                        placeholder={t('contact.form.placeholder_email')}
                        value={emailForm.email} onChange={handleEmailChange} required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{t('contact.form.project_type')}</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {SERVICE_OPTIONS.map(({ id, Icon }) => (
                        <button
                          key={id} type="button"
                          className={`flex flex-col items-center justify-center gap-2 py-4 px-2.5 rounded-xl border font-sans text-[13px] font-semibold transition-all duration-300 ${emailForm.service === id ? 'bg-purple-500/10 border-purple-500/50 text-purple-400 shadow-[0_0_18px_rgba(168,85,247,0.15),inset_0_0_18px_rgba(168,85,247,0.04)]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-purple-500/5 hover:border-purple-500/30 hover:text-purple-400 hover:-translate-y-0.5'}`}
                          onClick={() => selectEmailService(id)}
                        >
                          <Icon size={20} />
                          <span>{t(`contact.form.services.${id}`)}</span>
                        </button>
                      ))}
                    </div>
                    {emailForm.service === 'other' && (
                      <input
                        type="text" name="customService" className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl font-sans text-[15px] outline-none transition-all placeholder:text-white/20 focus:bg-purple-500/5 focus:border-purple-500/40 focus:ring-[3px] focus:ring-purple-500/10 mt-2.5"
                        placeholder={t('contact.form.placeholder_other')}
                        value={emailForm.customService} onChange={handleEmailChange} required
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <MessageCircle size={13} />
                      {t('contact.form.message')}
                    </label>
                    <textarea
                      name="message" className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl font-sans text-[15px] outline-none transition-all placeholder:text-white/20 focus:bg-purple-500/5 focus:border-purple-500/40 focus:ring-[3px] focus:ring-purple-500/10 min-h-[110px] resize-y" rows="5"
                      placeholder={t('contact.form.placeholder_message')}
                      value={emailForm.message} onChange={handleEmailChange} required
                    />
                  </div>

                  <button type="submit" className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-heading text-[15px] font-bold text-white cursor-pointer transition-all duration-300 relative overflow-hidden tracking-wide mt-2 bg-gradient-to-br from-purple-500 to-purple-600 shadow-[0_10px_30px_-8px_rgba(168,85,247,0.55)] hover:-translate-y-1 hover:shadow-[0_16px_40px_-8px_rgba(168,85,247,0.7),0_0_20px_rgba(147,51,234,0.25)]">
                    <span>{t('contact.form.send')}</span>
                    <Send size={18} />
                  </button>
                </form>
              ) : (
                <form className={`flex flex-col gap-5 ${status !== 'idle' ? 'opacity-0 pointer-events-none absolute inset-0' : 'transition-opacity duration-300'}`} onSubmit={handleFormSubmit}>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <User size={13} />
                      {t('contact.form.name')}
                    </label>
                    <input
                      type="text" name="name" className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl font-sans text-[15px] outline-none transition-all placeholder:text-white/20 focus:bg-green-500/5 focus:border-green-500/40 focus:ring-[3px] focus:ring-green-500/10"
                      placeholder={t('contact.form.placeholder_name')}
                      value={waForm.name} onChange={handleWaChange} required
                    />
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{t('contact.form.project_type')}</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {SERVICE_OPTIONS.map(({ id, Icon }) => (
                        <button
                          key={id} type="button"
                          className={`flex flex-col items-center justify-center gap-2 py-4 px-2.5 rounded-xl border font-sans text-[13px] font-semibold transition-all duration-300 ${waForm.service === id ? 'bg-green-500/10 border-green-500/50 text-green-400 shadow-[0_0_18px_rgba(37,211,102,0.15),inset_0_0_18px_rgba(37,211,102,0.04)]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-green-500/5 hover:border-green-500/30 hover:text-green-400 hover:-translate-y-0.5'}`}
                          onClick={() => selectWaService(id)}
                        >
                          <Icon size={20} />
                          <span>{t(`contact.form.services.${id}`)}</span>
                        </button>
                      ))}
                    </div>
                    {waForm.service === 'other' && (
                      <input
                        type="text" name="customService" className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl font-sans text-[15px] outline-none transition-all placeholder:text-white/20 focus:bg-green-500/5 focus:border-green-500/40 focus:ring-[3px] focus:ring-green-500/10 mt-2.5"
                        placeholder={t('contact.form.placeholder_other')}
                        value={waForm.customService} onChange={handleWaChange} required
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <MessageCircle size={13} />
                      {t('contact.form.message')}
                    </label>
                    <textarea
                      name="message" className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl font-sans text-[15px] outline-none transition-all placeholder:text-white/20 focus:bg-green-500/5 focus:border-green-500/40 focus:ring-[3px] focus:ring-green-500/10 min-h-[110px] resize-y" rows="5"
                      placeholder={t('contact.form.placeholder_message')}
                      value={waForm.message} onChange={handleWaChange} required
                    />
                  </div>

                  <button type="submit" className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-heading text-[15px] font-bold text-white cursor-pointer transition-all duration-300 relative overflow-hidden tracking-wide mt-2 bg-gradient-to-br from-[#25d366] to-[#128c7e] shadow-[0_10px_30px_-8px_rgba(37,211,102,0.45)] hover:-translate-y-1 hover:shadow-[0_16px_40px_-8px_rgba(37,211,102,0.65),0_0_20px_rgba(18,140,126,0.2)]">
                    <MessageCircle size={18} />
                    <span>{t('contact.form.send_wa')}</span>
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
