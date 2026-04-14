import React, { useState, useEffect } from 'react';
import { Eye, Users, FolderKanban, TrendingUp, BarChart3, Globe, Shield, Mail, Key } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import './Admin.css';

const CHART_COLORS = ['#a855f7', '#6366f1', '#ec4899', '#f97316', '#14b8a6', '#eab308', '#3b82f6', '#ef4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1a1a24',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '12px 16px',
        color: '#fff',
        fontSize: '0.85rem'
      }}>
        <p style={{ margin: 0, fontWeight: 600, marginBottom: '4px' }}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ margin: 0, color: entry.color }}>
            {entry.name}: <strong>{entry.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color + '15', color }}>
        {icon}
      </div>
      <div className="stat-info">
        <span className="stat-value">{value?.toLocaleString?.() || 0}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [securityStats, setSecurityStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Security State
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
        
        const dashData = await dashRes.json();
        const secData = await secRes.json();
        
        setStats(dashData);
        setSecurityStats(secData);
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
        body: JSON.stringify({ 
          currentPassword: securityData.currentPassword, 
          newPassword: securityData.newPassword 
        })
      });
      const data = await res.json();
      if (data.success) {
        setConfirmState({
          isOpen: true,
          title: 'Contraseña Actualizada',
          message: 'Tu contraseña de administrador ha sido cambiada con éxito.',
          type: 'primary'
        });
        setSecurityData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      } else {
        setConfirmState({
          isOpen: true,
          title: 'Error',
          message: data.error || 'No se pudo actualizar la contraseña.',
          type: 'danger'
        });
      }
    } catch (err) {
      setConfirmState({ isOpen: true, title: 'Error Crítico', message: 'Fallo de conexión.', type: 'danger' });
    } finally {
      setIsSavingSecurity(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', color: '#a1a1aa' }}>
        <div style={{ textAlign: 'center' }}>
          <BarChart3 size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p>Cargando datos analíticos...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div style={{ color: '#ef4444', textAlign: 'center', padding: '40px' }}>Error al cargar analytics. ¿Están creadas las tablas?</div>;
  }

  const formattedDays = (stats.viewsPerDay || []).map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="dashboard-grid">
      {/* Stat Cards */}
      <div className="stats-row">
        <StatCard icon={<Eye size={22} />} label="Total Visitas" value={stats.total_page_views} color="#a855f7" />
        <StatCard icon={<TrendingUp size={22} />} label="Visitas Hoy" value={stats.today_views} color="#14b8a6" />
        <StatCard icon={<Users size={22} />} label="Visitantes Únicos" value={stats.unique_visitors} color="#6366f1" />
        <StatCard icon={<FolderKanban size={22} />} label="Total Proyectos" value={stats.total_projects} color="#ec4899" />
      </div>

      {/* Daily Views Area Chart */}
      <div className="chart-card chart-full">
        <h4 className="chart-title">
          <Globe size={18} /> Visitas de Página (Últimos 14 Días)
        </h4>
        <div className="chart-body">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={formattedDays} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#666" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
              <YAxis stroke="#666" tick={{ fill: '#a1a1aa', fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="views" stroke="#a855f7" strokeWidth={2} fill="url(#colorViews)" name="Visitas" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Projects and Categories */}
      <div className="charts-row">
        <div className="chart-card">
          <h4 className="chart-title"><BarChart3 size={18} /> Vistas por Proyecto</h4>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.viewsPerProject || []} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#a1a1aa', fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
                <YAxis stroke="#666" tick={{ fill: '#a1a1aa', fontSize: 12 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="views" name="Vistas" radius={[6, 6, 0, 0]}>
                  {(stats.viewsPerProject || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h4 className="chart-title"><Eye size={18} /> Vistas por Categoría</h4>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.viewsPerCategory || []}
                  dataKey="views"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={45}
                  label={CustomPieLabel}
                  labelLine={false}
                >
                  {(stats.viewsPerCategory || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Projects per Category and Security Insights */}
      <div className="charts-row">
        <div className="chart-card">
          <h4 className="chart-title"><FolderKanban size={18} /> Proyectos por Categoría</h4>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats.projectsPerCategory || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  label={CustomPieLabel}
                  labelLine={false}
                >
                  {(stats.projectsPerCategory || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h4 className="chart-title"><Globe size={18} /> Top Referentes</h4>
          <div className="chart-body" style={{ padding: '16px' }}>
            {(!stats.topReferrers || stats.topReferrers.length === 0) ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '220px', color: '#a1a1aa' }}>
                <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>Aún no hay datos de referentes.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {stats.topReferrers.map((ref, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ 
                      width: '24px', height: '24px', borderRadius: '4px', 
                      background: CHART_COLORS[i % CHART_COLORS.length] + '22', 
                      color: CHART_COLORS[i % CHART_COLORS.length],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 700
                    }}>#{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', color: '#e4e4e7', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{ref.name}</div>
                    </div>
                    <span style={{ color: CHART_COLORS[i % CHART_COLORS.length], fontWeight: 700, fontSize: '0.85rem' }}>{ref.visits}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- SECURITY INSIGHTS --- */}
      <div className="analytics-section-header" style={{ marginTop: '40px' }}>
        <h3><Shield size={22} color="#ef4444" /> Security Pulse & Intrusion Tracking</h3>
        <p>Monitor failed login attempts and geographical origin of threats.</p>
      </div>

      <div className="analytics-grid">
        {/* Failed Attempts Metrics */}
        <div className={`stat-card security-alert-card ${securityStats?.isHighAlert ? 'high-alert' : ''}`}>
          <div className="stat-header">
            <span className="stat-label">Detected Failed Logins (24h)</span>
            <Shield size={18} color="#ef4444" />
          </div>
          <div className="stat-value" style={{ color: '#ef4444' }}>{securityStats?.failed_24h || 0}</div>
          <div className="stat-change negative">Total historic: {securityStats?.total_failed || 0}</div>
          {securityStats?.isHighAlert && (
            <div className="security-badge danger" style={{ marginTop: '12px', textAlign: 'center' }}>BRUTE FORCE DETECTED</div>
          )}
        </div>

        {/* Top Threat Origins */}
        <div className="chart-card">
          <h4 className="chart-title">Attack Geolocation (Top Countries)</h4>
          <div className="chart-container" style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={securityStats?.top_countries || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={12} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent IP Threats Table */}
      <div className="table-card" style={{ marginTop: '24px' }}>
        <h4 className="chart-title"><BarChart3 size={18} /> Recent Suspicious Activity</h4>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr><th>IP Address</th><th>Location</th><th>Date & Time</th><th>Status</th></tr>
            </thead>
            <tbody>
              {securityStats?.recent_failures && securityStats.recent_failures.length > 0 ? (
                securityStats.recent_failures.map((log, idx) => (
                  <tr key={idx}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{log.ip_address}</td>
                    <td><div className="location-tag"><Globe size={14} /> {log.city}, {log.country}</div></td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                    <td><span className="status-badge inactive">BLOCKED ATTEMPT</span></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#a1a1aa' }}>No suspicious activity recorded.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Section: Settings */}
      <div className="charts-row security-section" style={{ marginTop: '20px' }}>
        <div className="chart-card chart-full">
          <h4 className="chart-title"><Shield size={18} /> Seguridad y Credenciales</h4>
          <div className="chart-body" style={{ padding: '24px' }}>
            <div className="security-settings-grid">
              <form onSubmit={handleUpdatePassword} className="security-form-group">
                <h5><Key size={16} /> Cambiar Contraseña</h5>
                <div className="input-row-neon">
                  <input type="password" placeholder="Contraseña Actual" value={securityData.currentPassword} onChange={e => setSecurityData({...securityData, currentPassword: e.target.value})} />
                  <input type="password" placeholder="Nueva Contraseña" value={securityData.newPassword} onChange={e => setSecurityData({...securityData, newPassword: e.target.value})} />
                  <button type="submit" disabled={isSavingSecurity} className="security-btn">Actualizar Contraseña</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

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
