import React, { useState, useEffect } from 'react';
import { Eye, Users, FolderKanban, TrendingUp, BarChart3, Globe, Shield, Key, ArrowUpRight } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

const CHART_COLORS = ['#a855f7', '#6366f1', '#ec4899', '#f97316', '#14b8a6', '#eab308', '#3b82f6', '#ef4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a28] border border-white/10 rounded-xl py-3 px-4 text-white text-sm shadow-2xl">
        <p className="m-0 font-semibold mb-1 text-zinc-300">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="m-0 text-sm" style={{ color: entry.color }}>
            {entry.name}: <strong className="text-white">{entry.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function StatCard({ icon, label, value, color, delay = 0 }) {
  return (
    <div className="group relative bg-[#0e0e18] border border-white/[0.06] rounded-2xl p-5 sm:p-6 flex items-center gap-4 transition-all duration-300 hover:border-white/10 hover:-translate-y-1 overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}>
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at 30% 50%, ${color}08, transparent 70%)` }} />
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 relative" style={{ background: color + '12', color }}>
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xl sm:text-2xl font-bold leading-none text-white tabular-nums">{value?.toLocaleString?.() || 0}</span>
        <span className="text-[0.75rem] text-zinc-500 mt-1 truncate">{label}</span>
      </div>
      <ArrowUpRight size={14} className="absolute top-4 right-4 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

function ChartCard({ title, icon, children, className = '' }) {
  return (
    <div className={`bg-[#0e0e18] border border-white/[0.06] rounded-2xl overflow-hidden ${className}`}>
      <h4 className="flex items-center gap-2 m-0 py-4 px-4 sm:px-6 border-b border-white/[0.04] text-sm font-semibold text-zinc-300">
        <span className="text-purple-400">{icon}</span> {title}
      </h4>
      <div className="p-3 sm:p-5">
        {children}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [securityStats, setSecurityStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [securityData, setSecurityData] = useState({ currentPassword: '', newPassword: '' });
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', type: 'primary' });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, secRes] = await Promise.all([
          fetch('http://localhost:3000/api/analytics/dashboard'),
          fetch('http://localhost:3000/api/analytics/security')
        ]);
        setStats(await dashRes.json());
        setSecurityStats(await secRes.json());
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    const fetchSecuritySettings = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/auth/settings');
        const data = await res.json();
        setSecurityData(prev => ({ ...prev, recoveryEmail: data.recovery_email || '' }));
      } catch (err) {
        console.error('Error fetching security settings:', err);
      }
    };
    fetchDashboard();
    fetchSecuritySettings();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!securityData.currentPassword || !securityData.newPassword) return;
    setIsSavingSecurity(true);
    try {
      const res = await fetch('http://localhost:3000/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: securityData.currentPassword, newPassword: securityData.newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setConfirmState({ isOpen: true, title: 'Contraseña Actualizada', message: 'Tu contraseña de administrador ha sido cambiada con éxito.', type: 'primary' });
        setSecurityData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      } else {
        setConfirmState({ isOpen: true, title: 'Error', message: data.error || 'No se pudo actualizar la contraseña.', type: 'danger' });
      }
    } catch (err) {
      setConfirmState({ isOpen: true, title: 'Error Crítico', message: 'Fallo de conexión.', type: 'danger' });
    } finally {
      setIsSavingSecurity(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80 text-zinc-500">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-sm">Cargando datos analíticos...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-red-400 text-center p-10 bg-red-500/5 border border-red-500/20 rounded-2xl">Error al cargar analytics. ¿Están creadas las tablas?</div>;
  }

  const formattedDays = (stats.viewsPerDay || []).map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={<Eye size={22} />} label="Total Visitas" value={stats.total_page_views} color="#a855f7" delay={0} />
        <StatCard icon={<TrendingUp size={22} />} label="Visitas Hoy" value={stats.today_views} color="#14b8a6" delay={80} />
        <StatCard icon={<Users size={22} />} label="Visitantes Únicos" value={stats.unique_visitors} color="#6366f1" delay={160} />
        <StatCard icon={<FolderKanban size={22} />} label="Total Proyectos" value={stats.total_projects} color="#ec4899" delay={240} />
      </div>

      {/* Daily Views */}
      <ChartCard title="Visitas de Página (Últimos 14 Días)" icon={<Globe size={16} />}>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={formattedDays} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" stroke="transparent" tick={{ fill: '#52525b', fontSize: 11 }} />
            <YAxis stroke="transparent" tick={{ fill: '#52525b', fontSize: 11 }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="views" stroke="#a855f7" strokeWidth={2} fill="url(#colorViews)" name="Visitas" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Projects and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <ChartCard title="Vistas por Proyecto" icon={<BarChart3 size={16} />}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.viewsPerProject || []} margin={{ top: 10, right: 10, left: -20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" stroke="transparent" tick={{ fill: '#52525b', fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
              <YAxis stroke="transparent" tick={{ fill: '#52525b', fontSize: 11 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="views" name="Vistas" radius={[6, 6, 0, 0]}>
                {(stats.viewsPerProject || []).map((_, i) => <Cell key={`c-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Vistas por Categoría" icon={<Eye size={16} />}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={stats.viewsPerCategory || []} dataKey="views" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={40} label={CustomPieLabel} labelLine={false}>
                {(stats.viewsPerCategory || []).map((_, i) => <Cell key={`c-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* More charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <ChartCard title="Proyectos por Categoría" icon={<FolderKanban size={16} />}>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={stats.projectsPerCategory || []} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="count" label={CustomPieLabel} labelLine={false}>
                {(stats.projectsPerCategory || []).map((_, i) => <Cell key={`c-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Referentes" icon={<Globe size={16} />}>
          {(!stats.topReferrers || stats.topReferrers.length === 0) ? (
            <div className="flex items-center justify-center h-[200px] text-zinc-500">
              <p className="text-sm">Aún no hay datos de referentes.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {stats.topReferrers.map((ref, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ background: CHART_COLORS[i % CHART_COLORS.length] + '15', color: CHART_COLORS[i % CHART_COLORS.length] }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-zinc-300 truncate">{ref.name}</div>
                  </div>
                  <span className="font-bold text-sm tabular-nums" style={{ color: CHART_COLORS[i % CHART_COLORS.length] }}>{ref.visits}</span>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>

      {/* Security Section */}
      <div className="mt-4 sm:mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
            <Shield size={18} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-white text-base font-semibold m-0">Security Pulse</h3>
            <p className="text-zinc-500 text-xs m-0 mt-0.5">Monitor threats and manage credentials</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Failed Attempts */}
        <div className={`bg-[#0e0e18] border rounded-2xl p-5 sm:p-6 ${securityStats?.isHighAlert ? 'border-red-500/50 animate-pulse' : 'border-white/[0.06]'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Failed Logins (24h)</span>
              <div className="text-3xl sm:text-4xl font-bold text-red-400 mt-2 tabular-nums">{securityStats?.failed_24h || 0}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Shield size={20} className="text-red-400" />
            </div>
          </div>
          <div className="text-zinc-500 text-xs">Total historic: <span className="text-zinc-400 font-semibold">{securityStats?.total_failed || 0}</span></div>
          {securityStats?.isHighAlert && (
            <div className="mt-4 text-center py-2 px-3 rounded-xl text-xs font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20">
              ⚠️ Brute Force Detected
            </div>
          )}
        </div>

        {/* Geo Chart */}
        <ChartCard title="Attack Geolocation" icon={<Globe size={16} />}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={securityStats?.top_countries || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" stroke="transparent" tick={{ fill: '#71717a', fontSize: 11 }} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#ef4444" radius={[0, 6, 6, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Suspicious Activity Table */}
      <ChartCard title="Recent Suspicious Activity" icon={<BarChart3 size={16} />}>
        <div className="overflow-x-auto -mx-3 sm:-mx-5">
          <table className="w-full border-collapse text-left min-w-[500px]">
            <thead>
              <tr>
                {['IP Address', 'Location', 'Date & Time', 'Status'].map(h => (
                  <th key={h} className="py-3 px-3 sm:px-4 text-zinc-500 font-medium text-xs uppercase tracking-wider border-b border-white/[0.04]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {securityStats?.recent_failures?.length > 0 ? (
                securityStats.recent_failures.map((log, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 sm:px-4 border-b border-white/[0.03] text-zinc-300 font-mono text-sm font-medium">{log.ip_address}</td>
                    <td className="py-3 px-3 sm:px-4 border-b border-white/[0.03]">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400"><Globe size={12} /> {log.city}, {log.country}</div>
                    </td>
                    <td className="py-3 px-3 sm:px-4 border-b border-white/[0.03] text-zinc-400 text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-3 sm:px-4 border-b border-white/[0.03]">
                      <span className="py-1 px-2.5 rounded-lg text-[0.65rem] font-bold uppercase bg-red-500/10 text-red-400">Blocked</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center py-10 text-zinc-500 text-sm">No suspicious activity recorded.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* Password Change */}
      <ChartCard title="Seguridad y Credenciales" icon={<Shield size={16} />}>
        <div className="max-w-md">
          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-3">
            <h5 className="text-white text-sm flex items-center gap-2 m-0 font-semibold"><Key size={15} className="text-purple-400" /> Cambiar Contraseña</h5>
            <input type="password" placeholder="Contraseña Actual" value={securityData.currentPassword} onChange={e => setSecurityData({...securityData, currentPassword: e.target.value})}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 px-4 text-white outline-none text-sm transition-all placeholder:text-zinc-600 focus:border-purple-500/40 focus:shadow-[0_0_0_3px_rgba(168,85,247,0.08)]" />
            <input type="password" placeholder="Nueva Contraseña" value={securityData.newPassword} onChange={e => setSecurityData({...securityData, newPassword: e.target.value})}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 px-4 text-white outline-none text-sm transition-all placeholder:text-zinc-600 focus:border-purple-500/40 focus:shadow-[0_0_0_3px_rgba(168,85,247,0.08)]" />
            <button type="submit" disabled={isSavingSecurity}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(168,85,247,0.25)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]">
              Actualizar Contraseña
            </button>
          </form>
        </div>
      </ChartCard>

      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        type={confirmState.type}
        confirmText="Entendido"
        onConfirm={() => setConfirmState({...confirmState, isOpen: false})}
        onCancel={() => setConfirmState({...confirmState, isOpen: false})}
      />
    </div>
  );
}
