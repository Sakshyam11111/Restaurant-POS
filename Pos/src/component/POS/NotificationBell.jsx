import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Bell } from 'lucide-react';

const POLL_INTERVAL = 2 * 60 * 1000; // 2 minutes

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [unread, setUnread] = useState(0);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const [rushRes, ingRes] = await Promise.allSettled([
        api.get('/orders/rush-hours'),
        api.get('/ingredients'),
      ]);

      const newAlerts = [];

      // Rush hour alerts
      if (rushRes.status === 'fulfilled') {
        const d = rushRes.value.data?.data;
        if (d?.isCurrentlyCritical) {
          newAlerts.push({
            id: 'rush-critical',
            type: 'rush',
            level: 'red',
            title: 'Critical rush hour now',
            sub: `${d.currentHour?.label} — ${d.currentHour?.pct}% of peak load`,
            time: 'Now',
          });
        } else if (d?.isCurrentlyRush) {
          newAlerts.push({
            id: 'rush-active',
            type: 'rush',
            level: 'amber',
            title: 'Rush hour in progress',
            sub: `${d.currentHour?.label} — higher than average orders`,
            time: 'Now',
          });
        } else if (d?.upcomingRush?.length > 0) {
          const next = d.upcomingRush[0];
          const hoursAway = next.hour - new Date().getHours();
          newAlerts.push({
            id: 'rush-upcoming',
            type: 'rush',
            level: 'blue',
            title: `Upcoming rush at ${next.label}`,
            sub: `${hoursAway}h away — prep kitchen now`,
            time: `${hoursAway}h`,
          });
        }
      }

      // Ingredient stock alerts
      if (ingRes.status === 'fulfilled') {
        const ingredients = ingRes.value.data?.data?.ingredients || [];
        const outOfStock = ingredients.filter(i => i.stockQuantity === 0);
        const lowStock = ingredients.filter(
          i => i.stockQuantity > 0 && i.stockQuantity <= (i.reorderLevel || 0)
        );
        if (outOfStock.length > 0) {
          newAlerts.push({
            id: 'stock-out',
            type: 'stock',
            level: 'red',
            title: `${outOfStock.length} ingredient${outOfStock.length > 1 ? 's' : ''} out of stock`,
            sub: outOfStock.slice(0, 3).map(i => i.ingredientName).join(', '),
            time: 'Stock',
          });
        }
        if (lowStock.length > 0) {
          newAlerts.push({
            id: 'stock-low',
            type: 'stock',
            level: 'amber',
            title: `${lowStock.length} ingredient${lowStock.length > 1 ? 's' : ''} running low`,
            sub: lowStock.slice(0, 3).map(i => i.ingredientName).join(', '),
            time: 'Stock',
          });
        }
        if (outOfStock.length === 0 && lowStock.length === 0 && ingredients.length > 0) {
          newAlerts.push({
            id: 'stock-ok',
            type: 'stock',
            level: 'green',
            title: 'All ingredients in stock',
            sub: `${ingredients.length} items tracked`,
            time: 'Stock',
          });
        }
      }

      setAlerts(newAlerts);
      const urgentCount = newAlerts.filter(
        a => a.level === 'red' || a.level === 'amber'
      ).length;
      setUnread(urgentCount);

      // Auto-toast for critical alerts
      const critical = newAlerts.find(a => a.id === 'rush-critical');
      if (critical) {
        toast.error(critical.title, { duration: 5000, position: 'top-right' });
      }
    } catch (e) {
      console.warn('Notification fetch failed:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayed = tab === 'all' ? alerts : alerts.filter(a => a.type === tab);
  const markAllRead = () => setUnread(0);

  const DOT_COLORS = {
    red: '#E24B4A', amber: '#EF9F27',
    blue: '#185FA5', green: '#1D9E75', gray: '#888780',
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => { setOpen(o => !o); if (!open) setUnread(0); }}
        style={{
          position: 'relative', background: 'none', border: 'none',
          cursor: 'pointer', padding: 6, borderRadius: 8,
          color: 'var(--color-text-secondary)',
        }}
      >
        <Bell size={20} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            background: '#E24B4A', color: '#fff',
            fontSize: 9, fontWeight: 600,
            borderRadius: 99, minWidth: 14, height: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 3px', border: '1.5px solid var(--color-background-primary)',
          }}>{unread}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 6px)',
          width: 300, zIndex: 999,
          background: 'var(--color-background-primary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 10, overflow: 'hidden',
        }}>
          <div style={{ display:'flex', alignItems:'center',
            justifyContent:'space-between', padding:'.75rem 1rem',
            borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
            <span style={{ fontSize:13, fontWeight:500 }}>Alerts & notifications</span>
            <button onClick={markAllRead} style={{ fontSize:11, color:'#185FA5',
              background:'none', border:'none', cursor:'pointer' }}>
              Mark all read
            </button>
          </div>

          <div style={{ display:'flex', gap:1, padding:'.5rem 1rem .25rem',
            borderBottom:'0.5px solid var(--color-border-tertiary)',
            background:'var(--color-background-secondary)' }}>
            {['all','stock','rush','orders'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                fontSize:11, fontWeight:500, padding:'4px 10px',
                borderRadius:6, cursor:'pointer', border:'none',
                background: tab===t ? 'var(--color-background-primary)' : 'none',
                color: tab===t ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                outline: tab===t ? '0.5px solid var(--color-border-tertiary)' : 'none',
              }}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
            ))}
          </div>

          {loading ? (
            <div style={{ padding:'1.5rem', textAlign:'center',
              fontSize:12, color:'var(--color-text-secondary)' }}>
              Loading...
            </div>
          ) : displayed.length === 0 ? (
            <div style={{ padding:'2rem', textAlign:'center',
              fontSize:12, color:'var(--color-text-secondary)' }}>
              No alerts right now
            </div>
          ) : displayed.map(alert => (
            <div key={alert.id} style={{
              display:'flex', alignItems:'flex-start', gap:'.6rem',
              padding:'.6rem 1rem',
              borderBottom:'0.5px solid var(--color-border-tertiary)',
            }}>
              <span style={{
                width:8, height:8, borderRadius:'50%', flexShrink:0, marginTop:4,
                background: DOT_COLORS[alert.level] || DOT_COLORS.gray,
              }} />
              <div style={{ flex:1 }}>
                <p style={{ fontSize:12, fontWeight:500, lineHeight:1.4,
                  color:'var(--color-text-primary)', marginBottom:2 }}>
                  {alert.title}
                </p>
                <p style={{ fontSize:11, color:'var(--color-text-secondary)',
                  lineHeight:1.4 }}>{alert.sub}</p>
              </div>
              <span style={{ fontSize:10, color:'var(--color-text-secondary)',
                flexShrink:0, marginTop:2 }}>{alert.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}