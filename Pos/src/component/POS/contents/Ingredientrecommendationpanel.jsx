// Pos/src/component/POS/master/menuitems/IngredientRecommendationPanel.jsx
// Ingredient recommendation panel — shows which ingredients are needed
// for the current menu, cross-referenced against live stock levels.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AlertTriangle, Package, TrendingUp, RefreshCw, ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import api from '../../../../services/api';

// ── Constants ─────────────────────────────────────────────────────────────────
const PRIORITY_CONFIG = {
  high:   { label: 'Critical', bg: '#FCEBEB', color: '#A32D2D', dot: '#E24B4A' },
  medium: { label: 'Moderate', bg: '#FAEEDA', color: '#854F0B', dot: '#EF9F27' },
  low:    { label: 'Per-dish', bg: '#EAF3DE', color: '#3B6D11', dot: '#639922' },
};

const STOCK_CONFIG = {
  out_of_stock: { label: 'Out of stock', bg: '#FCEBEB', color: '#A32D2D' },
  low_stock:    { label: 'Low stock',    bg: '#FAEEDA', color: '#854F0B' },
  sufficient:   { label: 'Sufficient',   bg: '#EAF3DE', color: '#3B6D11' },
  unknown:      { label: 'Not tracked',  bg: '#F1EFE8', color: '#5F5E5A' },
};

// ── Sub-components ────────────────────────────────────────────────────────────
const Badge = ({ config }) => (
  <span style={{
    fontSize: 11, fontWeight: 500,
    padding: '2px 8px',
    borderRadius: 6,
    background: config.bg,
    color: config.color,
    whiteSpace: 'nowrap',
  }}>
    {config.label}
  </span>
);

const IngredientRow = ({ ing, maxFreq }) => {
  const [expanded, setExpanded] = useState(false);
  const pCfg  = PRIORITY_CONFIG[ing.priority]  || PRIORITY_CONFIG.low;
  const sCfg  = STOCK_CONFIG[ing.stockStatus]  || STOCK_CONFIG.unknown;
  const barPct = Math.round((ing.frequency / maxFreq) * 100);

  return (
    <div style={{
      border: ing.alert ? '1px solid #F09595' : '0.5px solid var(--color-border-tertiary)',
      borderRadius: 10,
      background: ing.alert ? '#FCEBEB' : 'var(--color-background-primary)',
      marginBottom: 6,
      overflow: 'hidden',
    }}>
      {/* Main row */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        {/* Priority dot */}
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: pCfg.dot, flexShrink: 0 }} />

        {/* Name */}
        <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', textTransform: 'capitalize' }}>
          {ing.name}
        </span>

        {/* Bar */}
        <div style={{ width: 80, height: 5, background: 'var(--color-border-tertiary)', borderRadius: 3, flexShrink: 0 }}>
          <div style={{ width: `${barPct}%`, height: 5, borderRadius: 3, background: pCfg.dot }} />
        </div>

        {/* Dish count */}
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', minWidth: 52, textAlign: 'right', flexShrink: 0 }}>
          {ing.usedInDishes.length}/{ing.totalDishes} dishes
        </span>

        {/* Priority badge */}
        <Badge config={pCfg} />

        {/* Stock badge */}
        <Badge config={sCfg} />

        {/* Alert icon */}
        {ing.alert && <AlertTriangle size={14} style={{ color: '#E24B4A', flexShrink: 0 }} />}

        {/* Expand toggle */}
        {expanded
          ? <ChevronUp  size={14} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
          : <ChevronDown size={14} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
        }
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: '0 14px 12px', borderTop: '0.5px solid var(--color-border-tertiary)' }}>
          <div style={{ paddingTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {/* Dishes using this ingredient */}
            <div>
              <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Used in</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {ing.usedInDishes.map(dish => (
                  <span key={dish} style={{
                    fontSize: 11, padding: '2px 7px',
                    background: 'var(--color-background-secondary)',
                    borderRadius: 6,
                    color: 'var(--color-text-primary)',
                  }}>
                    {dish}
                  </span>
                ))}
              </div>
            </div>
            {/* Stock info */}
            <div>
              <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Stock info</p>
              {ing.stockQuantity !== null ? (
                <div style={{ fontSize: 12, color: 'var(--color-text-primary)', lineHeight: 1.8 }}>
                  <div>Qty: <strong>{ing.stockQuantity} {ing.unit}</strong></div>
                  <div>Reorder at: <strong>{ing.reorderLevel} {ing.unit}</strong></div>
                  {ing.supplier && <div>Supplier: <strong>{ing.supplier}</strong></div>}
                  {ing.costPerUnit > 0 && <div>Cost/unit: <strong>Rs {ing.costPerUnit}</strong></div>}
                </div>
              ) : (
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Not in ingredient database yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value, color }) => (
  <div style={{
    background: 'var(--color-background-secondary)',
    borderRadius: 8,
    padding: '10px 14px',
  }}>
    <div style={{ fontSize: 22, fontWeight: 500, color: color || 'var(--color-text-primary)' }}>{value}</div>
    <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>{label}</div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const IngredientRecommendationPanel = ({ selectedMenuItemIds = [] }) => {
  const [data,        setData]        = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [filter,      setFilter]      = useState('all');     // 'all' | 'high' | 'medium' | 'low' | 'alerts'
  const [search,      setSearch]      = useState('');
  const debounceRef = useRef(null);

  const fetchData = useCallback(async (ids) => {
    setLoading(true);
    setError(null);
    try {
      const params = ids.length ? `?itemIds=${ids.join(',')}` : '';
      const res = await api.get(`/ingredient-recommendations${params}`);
      setData(res.data?.data || null);
    } catch (err) {
      console.error('Ingredient recommendation fetch failed:', err);
      setError('Could not load ingredient recommendations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchData(selectedMenuItemIds), 400);
    return () => clearTimeout(debounceRef.current);
  }, [selectedMenuItemIds, fetchData]);

  // ── Derived display list ──────────────────────────────────────────────────
  const displayed = (data?.ingredients || []).filter(ing => {
    const matchFilter =
      filter === 'all'    ? true :
      filter === 'alerts' ? ing.alert :
      ing.priority === filter;
    const matchSearch = !search || ing.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const maxFreq = displayed.length ? Math.max(...displayed.map(i => i.frequency)) : 1;
  const summary = data?.summary || {};

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: 'var(--font-sans)', padding: '0 0 1rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Package size={18} style={{ color: '#185FA5' }} />
          <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>
            Ingredient recommendations
          </span>
          {selectedMenuItemIds.length > 0 && (
            <span style={{
              fontSize: 11, padding: '2px 8px',
              background: '#E6F1FB', color: '#185FA5',
              borderRadius: 6, fontWeight: 500,
            }}>
              {selectedMenuItemIds.length} dish{selectedMenuItemIds.length > 1 ? 'es' : ''} selected
            </span>
          )}
        </div>
        <button
          onClick={() => fetchData(selectedMenuItemIds)}
          disabled={loading}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: 4 }}
          title="Refresh"
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
        </button>
      </div>

      {/* Summary cards */}
      {summary.totalIngredients > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
          <SummaryCard label="Total ingredients"  value={summary.totalIngredients} />
          <SummaryCard label="Critical"           value={summary.highPriority}     color="#A32D2D" />
          <SummaryCard label="Stock alerts"       value={summary.alertCount}       color={summary.alertCount > 0 ? '#E24B4A' : undefined} />
          <SummaryCard label="Not tracked"        value={summary.totalIngredients - (summary.outOfStock + summary.lowStock + (summary.totalIngredients - summary.alertCount - summary.sharedIngredients))} />
        </div>
      )}

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {[
          { key: 'all',    label: `All (${summary.totalIngredients || 0})` },
          { key: 'alerts', label: `⚠ Alerts (${summary.alertCount || 0})`, accent: true },
          { key: 'high',   label: `Critical (${summary.highPriority || 0})` },
          { key: 'medium', label: `Moderate (${summary.mediumPriority || 0})` },
          { key: 'low',    label: `Per-dish (${summary.lowPriority || 0})` },
        ].map(({ key, label, accent }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              fontSize: 12, padding: '4px 10px',
              border: '0.5px solid',
              borderColor: filter === key ? (accent ? '#E24B4A' : '#185FA5') : 'var(--color-border-secondary)',
              borderRadius: 6,
              background: filter === key ? (accent ? '#FCEBEB' : '#E6F1FB') : 'var(--color-background-primary)',
              color: filter === key ? (accent ? '#A32D2D' : '#185FA5') : 'var(--color-text-secondary)',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}

        {/* Search */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: 'var(--color-background-secondary)', borderRadius: 6, padding: '4px 10px' }}>
          <Search size={13} style={{ color: 'var(--color-text-secondary)' }} />
          <input
            type="text"
            placeholder="Search ingredient…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              border: 'none', background: 'none', outline: 'none',
              fontSize: 12, color: 'var(--color-text-primary)', width: 140,
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <X size={12} style={{ color: 'var(--color-text-secondary)' }} />
            </button>
          )}
        </div>
      </div>

      {/* Column headers */}
      {displayed.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', marginBottom: 6 }}>
          <span style={{ flex: 1, fontSize: 11, color: 'var(--color-text-secondary)', paddingLeft: 18 }}>Ingredient</span>
          <span style={{ width: 80, fontSize: 11, color: 'var(--color-text-secondary)' }}>Usage</span>
          <span style={{ width: 52, fontSize: 11, color: 'var(--color-text-secondary)', textAlign: 'right' }}>Dishes</span>
          <span style={{ width: 64, fontSize: 11, color: 'var(--color-text-secondary)' }}>Priority</span>
          <span style={{ width: 80, fontSize: 11, color: 'var(--color-text-secondary)' }}>Stock</span>
          <span style={{ width: 14 }} />
          <span style={{ width: 14 }} />
        </div>
      )}

      {/* Body */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)', fontSize: 13 }}>
          Analysing your menu…
        </div>
      )}

      {!loading && error && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#A32D2D', fontSize: 13 }}>{error}</div>
      )}

      {!loading && !error && displayed.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)', fontSize: 13 }}>
          {data ? 'No ingredients match current filters.' : 'Select menu items to analyse ingredients.'}
        </div>
      )}

      {!loading && !error && displayed.length > 0 && (
        <div>
          {displayed.map(ing => (
            <IngredientRow key={ing.name} ing={ing} maxFreq={maxFreq} />
          ))}
          <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', textAlign: 'right', marginTop: 8 }}>
            {displayed.length} ingredient{displayed.length !== 1 ? 's' : ''} shown
            {selectedMenuItemIds.length === 0 ? ' (entire menu)' : ''}
          </p>
        </div>
      )}

      {/* Spin keyframe */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default IngredientRecommendationPanel;