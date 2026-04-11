import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import {
  TrendingUp, TrendingDown, Minus, RefreshCw, Calendar,
  AlertTriangle, Star, Clock, BarChart2, Activity,
  ChevronDown, Download, Info, Package, Zap, Bell,
} from 'lucide-react';

const C = {
  primary:   '#487AA4',
  dark:      '#386184',
  light:     '#E6F1FB',
  success:   '#10B981',
  warning:   '#F59E0B',
  danger:    '#EF4444',
  neutral:   '#64748B',
  bg:        '#F8FAFC',
  card:      '#FFFFFF',
  border:    '#E2E8F0',
  text:      '#0F172A',
  textSoft:  '#64748B',
};

const Sparkline = ({ data = [], color = C.primary, width = 80, height = 32, showForecast = false }) => {
  if (!data.length) return null;
  const split = showForecast ? data.findIndex(d => d.isForecast) : -1;
  const allVals = data.map(d => d.qty ?? d.predicted ?? 0);
  const max = Math.max(...allVals, 1);
  const pts = allVals.map((v, i) => `${(i / (allVals.length - 1)) * width},${height - (v / max) * height}`);

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      {split > 0 && (
        <line
          x1={(split / (allVals.length - 1)) * width}
          y1={0}
          x2={(split / (allVals.length - 1)) * width}
          y2={height}
          stroke={C.border}
          strokeDasharray="3,2"
          strokeWidth={1}
        />
      )}
      <polyline
        points={pts.slice(0, split > 0 ? split : undefined).join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {split > 0 && (
        <polyline
          points={pts.slice(split).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray="4,3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.6}
        />
      )}
    </svg>
  );
};

const Bar = ({ pct = 0, color = C.primary, height = 8, animated = true }) => (
  <div style={{ width: '100%', height, background: C.border, borderRadius: 99, overflow: 'hidden' }}>
    <div
      style={{
        height: '100%',
        width: `${Math.min(pct, 100)}%`,
        background: color,
        borderRadius: 99,
        transition: animated ? 'width 0.8s cubic-bezier(.4,0,.2,1)' : 'none',
      }}
    />
  </div>
);

const TrendPill = ({ trend, pct }) => {
  const cfg = {
    up:     { bg: '#DCFCE7', color: '#15803D', Icon: TrendingUp,   label: `+${Math.abs(pct)}%` },
    down:   { bg: '#FEE2E2', color: '#B91C1C', Icon: TrendingDown, label: `-${Math.abs(pct)}%` },
    stable: { bg: '#F1F5F9', color: C.neutral,  Icon: Minus,       label: 'Stable' },
  }[trend] || { bg: '#F1F5F9', color: C.neutral, Icon: Minus, label: '—' };

  const { bg, color, Icon, label } = cfg;

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: bg, color }}>
      <Icon size={10} />{label}
    </span>
  );
};

const SectionHeader = ({ icon: Icon, title, sub }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: C.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={18} color={C.primary} />
    </div>
    <div>
      <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: C.textSoft, marginTop: 1 }}>{sub}</div>}
    </div>
  </div>
);

const ForecastBarChart = ({ data = [], height = 200 }) => {
  if (!data.length) return null;
  const maxH = Math.max(...data.map(d => d.high ?? d.predicted ?? 0), 1);
  const barW = Math.floor(100 / data.length) - 1;

  return (
    <div style={{ position: 'relative', height, display: 'flex', alignItems: 'flex-end', gap: 2, padding: '0 4px' }}>
      {data.map((d, i) => {
        const predH = ((d.predicted ?? 0) / maxH) * (height - 30);
        const lowH  = ((d.low ?? 0) / maxH) * (height - 30);
        const highH = ((d.high ?? 0) / maxH) * (height - 30);
        const isToday = i === 0;

        return (
          <div
            key={i}
            title={`${d.day} ${d.date}\nForecast: ${d.predicted}\nRange: ${d.low}–${d.high}`}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', cursor: 'default' }}
          >
            <div style={{
              position: 'absolute',
              bottom: 20,
              width: '60%',
              height: highH - lowH,
              background: C.primary,
              opacity: 0.12,
              borderRadius: 3,
              bottom: 20 + lowH,
            }} />
            <div style={{
              position: 'absolute',
              bottom: 20,
              width: '45%',
              height: predH,
              background: isToday
                ? `linear-gradient(180deg, ${C.primary}, ${C.dark})`
                : `linear-gradient(180deg, ${C.primary}99, ${C.primary}55)`,
              borderRadius: '3px 3px 0 0',
              transition: 'height 0.6s ease',
            }} />
            <div style={{ position: 'absolute', bottom: 2, fontSize: 9, color: C.textSoft, fontWeight: 500 }}>
              {d.day}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ReportsContent = () => {
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [horizon,   setHorizon]   = useState(14);
  const [activeTab, setActiveTab] = useState('overview');
  const [animating, setAnimating] = useState(false);

  // ── Rush hour state ──────────────────────────────────────────────────────
  const [rushData, setRushData] = useState(null);

  const fetchRush = useCallback(async () => {
    try {
      const res = await api.get('/orders/rush-hours');
      setRushData(res.data?.data || null);
    } catch {
      // silent fail — alert is non-critical
    }
  }, []);

  useEffect(() => {
    fetchRush();
    const interval = setInterval(fetchRush, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchRush]);
  // ────────────────────────────────────────────────────────────────────────

  const fetchForecast = useCallback(async (h = horizon) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/demand-forecast?horizon=${h}`);
      setData(res.data?.data || null);
      setAnimating(true);
      setTimeout(() => setAnimating(false), 1000);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load forecast data');
    } finally {
      setLoading(false);
    }
  }, [horizon]);

  useEffect(() => { fetchForecast(); }, []);

  const handleHorizonChange = (h) => {
    setHorizon(h);
    fetchForecast(h);
  };

  const insightIcon = (icon) => ({
    'trending-up':   TrendingUp,
    'trending-down': TrendingDown,
    'calendar':      Calendar,
    'clock':         Clock,
    'star':          Star,
    'alert':         AlertTriangle,
  }[icon] || Info);

  const insightColor = (type) => ({
    positive: { bg: '#DCFCE7', color: '#15803D', border: '#BBF7D0' },
    warning:  { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
    info:     { bg: C.light,   color: C.dark,    border: '#BFDBFE' },
  }[type] || { bg: '#F1F5F9', color: C.neutral, border: C.border });

  return (
    <div style={{ minHeight: '100vh', background: C.bg, padding: 28, fontFamily: 'inherit' }}>

      {/* ── Rush Hour Alert ─────────────────────────────────────────────── */}
      {rushData && (() => {
        const { isCurrentlyCritical, isCurrentlyRush, currentHour, upcomingRush, peakHour } = rushData;

        if (isCurrentlyCritical) return (
          <div style={{
            background: '#FCEBEB', border: '1px solid #E24B4A',
            borderRadius: 10, padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
          }}>
            <Bell size={18} color="#A32D2D" style={{ flexShrink: 0, animation: 'bellShake 0.5s ease-in-out infinite alternate' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#A32D2D' }}>
                Rush hour NOW — {currentHour.label} is at critical capacity!
              </div>
              <div style={{ fontSize: 12, color: '#A32D2D', opacity: 0.8, marginTop: 3 }}>
                {currentHour.pct}% of your peak load. Ensure full staff coverage immediately.
              </div>
            </div>
            <span style={{
              background: '#F7C1C1', borderRadius: 6, padding: '4px 10px',
              fontSize: 12, color: '#A32D2D', fontWeight: 600, whiteSpace: 'nowrap',
            }}>
              CRITICAL
            </span>
            <style>{`@keyframes bellShake{from{transform:rotate(-10deg)}to{transform:rotate(10deg)}}`}</style>
          </div>
        );

        if (isCurrentlyRush) return (
          <div style={{
            background: '#FAEEDA', border: '1px solid #EF9F27',
            borderRadius: 10, padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
          }}>
            <Bell size={18} color="#854F0B" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#854F0B' }}>
                Rush hour in progress — {currentHour.label}
              </div>
              <div style={{ fontSize: 12, color: '#854F0B', opacity: 0.8, marginTop: 3 }}>
                Higher than average order volume. Check your KOT queue.
              </div>
            </div>
            <span style={{
              background: '#FAC775', borderRadius: 6, padding: '4px 10px',
              fontSize: 12, color: '#854F0B', fontWeight: 600,
            }}>
              RUSH
            </span>
          </div>
        );

        if (upcomingRush?.length > 0) {
          const next = upcomingRush[0];
          const hoursAway = next.hour - new Date().getHours();
          return (
            <div style={{
              background: '#E6F1FB', border: '1px solid #185FA5',
              borderRadius: 10, padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
            }}>
              <Bell size={18} color="#185FA5" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#185FA5' }}>
                  Upcoming rush at {next.label}
                </div>
                <div style={{ fontSize: 12, color: '#185FA5', opacity: 0.8, marginTop: 3 }}>
                  {hoursAway} hour{hoursAway !== 1 ? 's' : ''} away based on 30-day history. Start prepping kitchen now.
                </div>
              </div>
              <span style={{
                background: '#B5D4F4', borderRadius: 6, padding: '4px 10px',
                fontSize: 12, color: '#185FA5', fontWeight: 600, whiteSpace: 'nowrap',
              }}>
                {hoursAway}h away
              </span>
            </div>
          );
        }

        return null;
      })()}
      {/* ── End Rush Hour Alert ─────────────────────────────────────────── */}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>
            Demand Forecasting
          </h1>
          <p style={{ fontSize: 13, color: C.textSoft, marginTop: 4 }}>
            AI-powered predictions from your historical sales data
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, padding: 4 }}>
            {[7, 14, 30].map(h => (
              <button
                key={h}
                onClick={() => handleHorizonChange(h)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 7,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: horizon === h ? C.primary : 'transparent',
                  color: horizon === h ? '#fff' : C.textSoft,
                  transition: 'all 0.2s',
                }}
              >
                {h}d
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchForecast(horizon)}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 10, border: `1px solid ${C.border}`,
              background: '#fff', fontSize: 13, fontWeight: 500,
              color: C.text, cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 13 }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '6rem 0' }}>
          <div style={{ width: 40, height: 40, border: `3px solid ${C.border}`, borderTopColor: C.primary, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: C.textSoft, fontSize: 14 }}>Analysing sales patterns…</p>
        </div>
      )}

      {!loading && data && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
            {[
              {
                label: 'Total Orders (90d)',
                value: data.summary.totalOrders.toLocaleString(),
                icon: BarChart2,
                color: C.primary,
                bg: C.light,
              },
              {
                label: 'Avg Daily Orders',
                value: data.summary.avgDailyOrders,
                icon: Activity,
                color: C.success,
                bg: '#DCFCE7',
              },
              {
                label: `Next ${Math.min(horizon, 7)}-Day Forecast`,
                value: data.summary.nextWeekOrders,
                icon: TrendingUp,
                color: data.summary.weekChange >= 0 ? C.success : C.danger,
                bg: data.summary.weekChange >= 0 ? '#DCFCE7' : '#FEE2E2',
                sub: `${data.summary.weekChange >= 0 ? '+' : ''}${data.summary.weekChange}% vs last week`,
              },
              {
                label: 'Top Item',
                value: data.summary.topItem || '—',
                icon: Star,
                color: C.warning,
                bg: '#FEF3C7',
                small: true,
              },
            ].map(({ label, value, icon: Icon, color, bg, sub, small }) => (
              <div key={label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <p style={{ fontSize: 12, color: C.textSoft, fontWeight: 500, margin: 0 }}>{label}</p>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={15} color={color} />
                  </div>
                </div>
                <p style={{ fontSize: small ? 15 : 24, fontWeight: 700, color: C.text, margin: 0, lineHeight: 1.2 }}>{value}</p>
                {sub && <p style={{ fontSize: 11, color: data.summary.weekChange >= 0 ? C.success : C.danger, marginTop: 4, fontWeight: 600 }}>{sub}</p>}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 2, marginBottom: 20, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 5, width: 'fit-content' }}>
            {[
              { key: 'overview', label: 'Overview',    icon: BarChart2 },
              { key: 'items',    label: 'By Item',     icon: Package   },
              { key: 'patterns', label: 'Patterns',    icon: Activity  },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 18px', borderRadius: 9, border: 'none',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: activeTab === key ? C.primary : 'transparent',
                  color: activeTab === key ? '#fff' : C.textSoft,
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={14} />{label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 18 }}>

              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
                <SectionHeader icon={TrendingUp} title={`${horizon}-Day Demand Forecast`} sub="Predicted daily orders with confidence bands" />

                <ForecastBarChart data={data.overall} height={220} />

                <div style={{ display: 'flex', gap: 20, marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                  {[
                    { color: C.primary, label: 'Predicted demand', opacity: 1 },
                    { color: C.primary, label: 'Confidence range', opacity: 0.15 },
                  ].map(({ color, label, opacity }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.textSoft }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: color, opacity }} />
                      {label}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 20, overflowX: 'auto' }}>
                  <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                        {['Date', 'Day', 'Predicted', 'Range', 'Trend'].map(h => (
                          <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: C.textSoft, fontWeight: 600, fontSize: 11 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.overall.slice(0, 10).map((row, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? '#FAFBFD' : '#fff' }}>
                          <td style={{ padding: '9px 10px', color: C.text, fontWeight: 500 }}>{row.date}</td>
                          <td style={{ padding: '9px 10px', color: C.textSoft }}>{row.day}</td>
                          <td style={{ padding: '9px 10px' }}>
                            <span style={{ fontWeight: 700, color: C.primary, fontSize: 14 }}>{row.predicted}</span>
                          </td>
                          <td style={{ padding: '9px 10px', color: C.textSoft }}>{row.low} – {row.high}</td>
                          <td style={{ padding: '9px 10px' }}>
                            <TrendPill trend={row.trend} pct={0} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                  <SectionHeader icon={Zap} title="AI Insights" sub="Actionable recommendations" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(data.insights || []).map((ins, i) => {
                      const Icon = insightIcon(ins.icon);
                      const { bg, color, border } = insightColor(ins.type);
                      return (
                        <div
                          key={i}
                          style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '12px 14px' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <Icon size={13} color={color} />
                            <span style={{ fontSize: 12, fontWeight: 700, color }}>{ins.title}</span>
                          </div>
                          <p style={{ fontSize: 11, color, opacity: 0.8, margin: 0, lineHeight: 1.5 }}>{ins.detail}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 14 }}>Next 7 Days</p>
                  {data.overall.slice(0, 7).map((d, i) => {
                    const maxPred = Math.max(...data.overall.slice(0, 7).map(x => x.predicted), 1);
                    return (
                      <div key={i} style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>{d.day} <span style={{ color: C.textSoft, fontWeight: 400 }}>{d.date.slice(5)}</span></span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: C.primary }}>{d.predicted} orders</span>
                        </div>
                        <Bar pct={Math.round((d.predicted / maxPred) * 100)} height={5} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 80px 100px 80px 120px', gap: 12, padding: '0 20px', marginBottom: 4 }}>
                {['Menu Item', 'Total Sold', 'Wk Avg', 'Next 7d Forecast', 'Trend', 'History'].map(h => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 600, color: C.textSoft, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
                ))}
              </div>

              {(data.byItem || []).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: C.textSoft, background: C.card, borderRadius: 14, border: `1px solid ${C.border}` }}>
                  <Package size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                  <p>No item data available yet. Place some orders first.</p>
                </div>
              ) : (
                (data.byItem || []).map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: C.card,
                      border: `1px solid ${C.border}`,
                      borderRadius: 14,
                      padding: '16px 20px',
                      display: 'grid',
                      gridTemplateColumns: '2fr 80px 80px 100px 80px 120px',
                      gap: 12,
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>{item.name}</p>
                      <p style={{ fontSize: 11, color: C.textSoft, marginTop: 2 }}>
                        {item.changePercent !== 0 ? `${item.changePercent > 0 ? '+' : ''}${item.changePercent}% vs prev period` : 'Stable demand'}
                      </p>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{item.totalSold}</span>
                    <span style={{ fontSize: 14, color: C.textSoft }}>{item.weeklyAvg}/wk</span>
                    <div>
                      <span style={{ fontSize: 16, fontWeight: 700, color: C.primary }}>{item.nextWeekTotal}</span>
                      <span style={{ fontSize: 11, color: C.textSoft, marginLeft: 4 }}>units</span>
                    </div>
                    <TrendPill trend={item.trend} pct={Math.abs(item.changePercent)} />
                    <div>
                      <Sparkline
                        data={[
                          ...item.history.map(h => ({ ...h, isForecast: false })),
                          ...(item.forecast || []).slice(0, 7).map(f => ({ qty: f.predicted, isForecast: true })),
                        ]}
                        color={item.trend === 'up' ? C.success : item.trend === 'down' ? C.danger : C.primary}
                        showForecast
                        width={100}
                        height={30}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'patterns' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
                <SectionHeader icon={Calendar} title="Day-of-Week Demand" sub="Which days are busiest" />
                {(data.dayOfWeekPattern || []).map((d, i) => {
                  const isMax = d.pct === 100;
                  return (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 13, fontWeight: isMax ? 700 : 500, color: isMax ? C.primary : C.text }}>{d.day}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: isMax ? C.primary : C.textSoft }}>
                          {d.orders} orders {isMax && '🔥'}
                        </span>
                      </div>
                      <Bar pct={d.pct} color={isMax ? C.primary : `${C.primary}77`} height={7} />
                    </div>
                  );
                })}
              </div>

              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
                <SectionHeader icon={Clock} title="Hourly Traffic Pattern" sub="Peak service hours" />
                <div style={{ display: 'flex', align: 'flex-end', gap: 3, height: 120, alignItems: 'flex-end' }}>
                  {(data.hourlyPattern || []).map((h, i) => {
                    const isKey = h.pct >= 80;
                    return (
                      <div
                        key={i}
                        title={`${h.hour}: ${h.count} orders`}
                        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'default' }}
                      >
                        <div style={{
                          width: '80%',
                          height: `${Math.max(h.pct, 3)}%`,
                          background: isKey
                            ? `linear-gradient(180deg, ${C.primary}, ${C.dark})`
                            : `${C.primary}44`,
                          borderRadius: '2px 2px 0 0',
                          minHeight: 2,
                          transition: 'height 0.5s ease',
                        }} />
                        {i % 4 === 0 && (
                          <div style={{ fontSize: 8, color: C.textSoft, marginTop: 3, transform: 'rotate(-30deg)', whiteSpace: 'nowrap' }}>
                            {h.hour.slice(0, 2)}h
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                  {(data.hourlyPattern || [])
                    .filter(h => h.pct >= 80)
                    .slice(0, 3)
                    .map(h => (
                      <div key={h.hour} style={{ background: C.light, borderRadius: 8, padding: '6px 12px', fontSize: 12, color: C.dark, fontWeight: 600 }}>
                        🔥 {h.hour}
                      </div>
                    ))
                  }
                </div>
              </div>

              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, gridColumn: '1 / -1' }}>
                <SectionHeader
                  icon={Activity}
                  title="Historical Sales vs Forecast"
                  sub="Last 30 days actual + next forecast period"
                />
                <div style={{ display: 'flex', gap: 4, height: 140, alignItems: 'flex-end' }}>
                  {[
                    ...(data.overallHistory || []).slice(-20).map(h => ({ ...h, type: 'actual' })),
                    ...(data.overall || []).slice(0, 10).map(f => ({ date: f.date, qty: f.predicted, type: 'forecast' })),
                  ].map((d, i) => {
                    const allVals = [
                      ...(data.overallHistory || []).slice(-20).map(h => h.qty),
                      ...(data.overall || []).slice(0, 10).map(f => f.predicted),
                    ];
                    const maxV = Math.max(...allVals, 1);
                    const h = Math.max((d.qty / maxV) * 120, 2);
                    return (
                      <div
                        key={i}
                        title={`${d.date}: ${d.qty} orders`}
                        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'default' }}
                      >
                        <div style={{
                          width: '70%',
                          height: h,
                          background: d.type === 'actual'
                            ? `linear-gradient(180deg, ${C.primary}cc, ${C.primary}66)`
                            : `linear-gradient(180deg, ${C.success}aa, ${C.success}44)`,
                          borderRadius: '2px 2px 0 0',
                          borderTop: d.type === 'forecast' ? `2px dashed ${C.success}` : 'none',
                          transition: 'height 0.5s ease',
                        }} />
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
                  {[
                    { color: C.primary, label: 'Historical (actual)' },
                    { color: C.success, label: 'Forecast (predicted)' },
                  ].map(({ color, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.textSoft }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: color, opacity: 0.7 }} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {!loading && !error && !data && (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', color: C.textSoft }}>
          <BarChart2 size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
          <p style={{ fontSize: 16, fontWeight: 600, color: C.text }}>No data yet</p>
          <p style={{ fontSize: 13 }}>Complete some orders and refresh to see your demand forecast.</p>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bellShake { from { transform: rotate(-10deg); } to { transform: rotate(10deg); } }
      `}</style>
    </div>
  );
};

export default ReportsContent;