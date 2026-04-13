import React, { useState, useEffect } from 'react';
import { Eye, Users, FolderKanban, TrendingUp, BarChart3, Globe } from 'lucide-react';
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

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/analytics/dashboard');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

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

  // Format dates for display
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

      {/* Row 2: Area chart of daily views */}
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

      {/* Row 3: Bar chart + Pie chart */}
      <div className="charts-row">
        <div className="chart-card">
          <h4 className="chart-title">
            <BarChart3 size={18} /> Vistas por Proyecto
          </h4>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.viewsPerProject || []} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  stroke="#666" 
                  tick={{ fill: '#a1a1aa', fontSize: 11 }} 
                  angle={-35} 
                  textAnchor="end"
                  interval={0}
                />
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
          <h4 className="chart-title">
            <Eye size={18} /> Vistas por Categoría
          </h4>
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
                  labelLine={false}
                  label={CustomPieLabel}
                  strokeWidth={2}
                  stroke="#0a0a0f"
                >
                  {(stats.viewsPerCategory || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  iconType="circle" 
                  iconSize={8}
                  formatter={(value) => <span style={{ color: '#e4e4e7', fontSize: '12px' }}>{value}</span>}
                />
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4: Projects per category pie + Top referrers */}
      <div className="charts-row">
        <div className="chart-card">
          <h4 className="chart-title">
            <FolderKanban size={18} /> Proyectos por Categoría
          </h4>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.projectsPerCategory || []}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={45}
                  labelLine={false}
                  label={CustomPieLabel}
                  strokeWidth={2}
                  stroke="#0a0a0f"
                >
                  {(stats.projectsPerCategory || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  iconType="circle" 
                  iconSize={8}
                  formatter={(value) => <span style={{ color: '#e4e4e7', fontSize: '12px' }}>{value}</span>}
                />
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h4 className="chart-title">
            <Globe size={18} /> Top Referentes
          </h4>
          <div className="chart-body" style={{ padding: '16px' }}>
            {(stats.topReferrers || []).length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', color: '#a1a1aa' }}>
                <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>Aún no hay datos de referentes.<br />Los visitantes aparecerán aquí.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {stats.topReferrers.map((ref, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ 
                      width: '28px', height: '28px', borderRadius: '6px', 
                      background: CHART_COLORS[i % CHART_COLORS.length] + '22', 
                      color: CHART_COLORS[i % CHART_COLORS.length],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700, flexShrink: 0
                    }}>
                      #{i + 1}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', color: '#e4e4e7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ref.name}
                      </div>
                    </div>
                    <span style={{ color: CHART_COLORS[i % CHART_COLORS.length], fontWeight: 700, fontSize: '0.9rem' }}>
                      {ref.visits}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
