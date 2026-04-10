import React, { useState, useEffect, useCallback } from 'react';
import { menuAPI } from '../../../services/api';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PRIORITY_COLORS = {
  critical: { bg: '#FCEBEB', text: '#A32D2D', dot: '#E24B4A' },
  high:     { bg: '#FAEEDA', text: '#854F0B', dot: '#EF9F27' },
  medium:   { bg: '#EAF3DE', text: '#3B6D11', dot: '#639922' },
  low:      { bg: '#F1EFE8', text: '#5F5E5A', dot: '#888780' },
};

const STOCK_LABELS = {
  out_of_stock: { label: 'Out of stock', color: '#A32D2D', bg: '#FCEBEB' },
  low_stock:    { label: 'Low stock',    color: '#854F0B', bg: '#FAEEDA' },
  sufficient:   { label: 'In stock',     color: '#3B6D11', bg: '#EAF3DE' },
  unknown:      { label: 'Not tracked',  color: '#5F5E5A', bg: '#F1EFE8' },
};

async function callClaude(menuItems) {
  const summary = menuItems.map(i =>
    `• ${i.name} (Category: ${i.category || 'N/A'}, Group: ${i.menuGroup || 'N/A'}${i.addOns ? `, AddOns: ${i.addOns}` : ''})`
  ).join('\n');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `You are a professional restaurant chef. Given menu items, identify ALL ingredients needed. Return ONLY valid JSON:
{"ingredients":[{"name":"ingredient (lowercase singular)","usedIn":["dish"],"priority":"critical|high|medium|low","estimatedQtyPerService":"e.g. 100g","aiReason":"why needed (max 6 words)","aiNote":"practical tip (max 15 words)"}],"summary":"one sentence"}
Priority: critical=>60% dishes, high=>40% or essential, medium=>2+ dishes, low=>1 dish. Be exhaustive.`,
      messages: [{ role: 'user', content: `Analyze these ${menuItems.length} menu items:\n\n${summary}` }]
    })
  });
  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

function crossRef(name, dbIngredients) {
  const n = name.toLowerCase().trim();
  const match = dbIngredients.find(d => {
    const dn = (d.ingredientName || '').toLowerCase().trim();
    return dn === n || dn.includes(n) || n.includes(dn);
  });
  if (!match) return { stockStatus: 'unknown', stockQuantity: null, reorderLevel: null, unit: '', supplier: '', costPerUnit: 0 };
  const qty = match.stockQuantity || 0;
  const reorder = match.reorderLevel || 0;
  let stockStatus = qty === 0 ? 'out_of_stock' : qty <= reorder ? 'low_stock' : 'sufficient';
  return { stockStatus, stockQuantity: qty, reorderLevel: reorder, unit: match.unit || '', supplier: match.supplier || '', costPerUnit: match.costPerUnit || 0 };
}

function Badge({ label, color, bg }) {
  return <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 6, background: bg, color, whiteSpace: 'nowrap' }}>{label}</span>;
}

function IngredientRow({ ing, maxFreq }) {
  const [open, setOpen] = React.useState(false);
  const pc = PRIORITY_COLORS[ing.priority] || PRIORITY_COLORS.low;
  const sc = STOCK_LABELS[ing.stockStatus] || STOCK_LABELS.unknown;
  const barPct = Math.round(((ing.usedIn?.length || 0) / Math.max(maxFreq, 1)) * 100);

  return (
    <div style={{ border: ing.alert ? '1px solid #F09595' : '0.5px solid #e5e7eb', borderRadius: 10, background: ing.alert ? '#FCEBEB' : '#fff', marginBottom: 5, overflow: 'hidden' }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', cursor: 'pointer' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: pc.dot, flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>{ing.name}</span>
        {ing.aiReason && <span style={{ fontSize: 11, color: '#6b7280', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ing.aiReason}</span>}
        <div style={{ width: 60, height: 4, background: '#e5e7eb', borderRadius: 3, flexShrink: 0 }}>
          <div style={{ width: `${barPct}%`, height: 4, borderRadius: 3, background: pc.dot }} />
        </div>
        <span style={{ fontSize: 11, color: '#6b7280', width: 48, textAlign: 'right' }}>{ing.usedIn?.length || 0} dishes</span>
        <Badge label={ing.priority} color={pc.text} bg={pc.bg} />
        <Badge label={sc.label} color={sc.color} bg={sc.bg} />
        {ing.alert && <span>⚠</span>}
        <span style={{ fontSize: 12, color: '#9ca3af' }}>{open ? '▴' : '▾'}</span>
      </div>
      {open && (
        <div style={{ padding: '0 14px 12px', borderTop: '0.5px solid #e5e7eb' }}>
          <div style={{ paddingTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4, marginTop: 0 }}>Used in dishes</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {(ing.usedIn || []).map(d => <span key={d} style={{ fontSize: 11, padding: '2px 7px', background: '#f3f4f6', borderRadius: 6 }}>{d}</span>)}
              </div>
              {ing.aiNote && <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8, fontStyle: 'italic' }}>💡 {ing.aiNote}</p>}
            </div>
            <div>
              <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4, marginTop: 0 }}>Stock info</p>
              {ing.stockQuantity !== null && ing.stockQuantity !== undefined ? (
                <div style={{ fontSize: 12, lineHeight: 1.9 }}>
                  <div>Qty: <strong>{ing.stockQuantity} {ing.unit}</strong></div>
                  <div>Reorder at: <strong>{ing.reorderLevel} {ing.unit}</strong></div>
                  {ing.supplier && <div>Supplier: <strong>{ing.supplier}</strong></div>}
                  {ing.costPerUnit > 0 && <div>Cost/unit: <strong>Rs {ing.costPerUnit}</strong></div>}
                </div>
              ) : <p style={{ fontSize: 12, color: '#9ca3af' }}>Not in ingredient database</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const IngredientRecommendations = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [dbIngredients, setDbIngredients] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [results, setResults] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [menuSearch, setMenuSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('All');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoadingMenu(true);
      try {
        const [menuRes, ingRes] = await Promise.all([
          menuAPI.getMenuItems(),
          api.get('/ingredients')
        ]);
        const items = menuRes?.data?.items || [];
        const ings = ingRes?.data?.data?.ingredients || [];
        setMenuItems(items);
        setDbIngredients(ings);
        setSelectedIds(items.map(i => i._id));
      } catch { toast.error('Failed to load data'); }
      setLoadingMenu(false);
    })();
  }, []);

  const groups = ['All', ...Array.from(new Set(menuItems.map(i => i.menuGroup).filter(Boolean)))];
  const filteredMenu = menuItems.filter(item => {
    const matchGroup = groupFilter === 'All' || item.menuGroup === groupFilter;
    const matchSearch = !menuSearch || item.name.toLowerCase().includes(menuSearch.toLowerCase());
    return matchGroup && matchSearch;
  });

  async function analyze() {
    if (selectedIds.length === 0) { setError('Select at least one menu item.'); return; }
    setError(''); setAnalyzing(true); setResults(null);
    const selected = menuItems.filter(i => selectedIds.includes(i._id));
    try {
      const parsed = await callClaude(selected);
      const enriched = (parsed.ingredients || []).map(ing => {
        const stock = crossRef(ing.name, dbIngredients);
        return { ...ing, ...stock, alert: (ing.priority === 'critical' || ing.priority === 'high') && ['out_of_stock','low_stock'].includes(stock.stockStatus) };
      }).sort((a, b) => {
        if (a.alert && !b.alert) return -1; if (!a.alert && b.alert) return 1;
        return ({'critical':0,'high':1,'medium':2,'low':3}[a.priority]??3) - ({'critical':0,'high':1,'medium':2,'low':3}[b.priority]??3);
      });
      setResults({ ingredients: enriched, summary: parsed.summary, stats: { total: enriched.length, alertCount: enriched.filter(i=>i.alert).length, critCount: enriched.filter(i=>i.priority==='critical').length, highCount: enriched.filter(i=>i.priority==='high').length, outCount: enriched.filter(i=>i.stockStatus==='out_of_stock').length, dishes: selected.length } });
    } catch (e) { setError('AI analysis failed. Check console.'); console.error(e); }
    setAnalyzing(false);
  }

  const displayed = (results?.ingredients || []).filter(ing => {
    const matchFilter = filter === 'all' ? true : filter === 'alerts' ? ing.alert : ing.priority === filter;
    return matchFilter && (!search || ing.name.toLowerCase().includes(search.toLowerCase()));
  });
  const maxFreq = displayed.length ? Math.max(...displayed.map(i => i.usedIn?.length || 0)) : 1;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: 24, fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: '#111827' }}>AI Ingredient Recommendations</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Claude analyzes your menu and cross-references live stock</p>
        </div>
      </div>

      {error && <div style={{ background: '#FCEBEB', color: '#A32D2D', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 14, border: '1px solid #F09595' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16, alignItems: 'start' }}>
        {/* Selector */}
        <div style={{ background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px', borderBottom: '0.5px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>Menu items ({selectedIds.length} selected)</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {['All','None'].map(label => <button key={label} onClick={() => label === 'All' ? setSelectedIds(menuItems.map(i=>i._id)) : setSelectedIds([])} style={{ fontSize: 11, padding: '2px 7px', border: '0.5px solid #d1d5db', borderRadius: 6, cursor: 'pointer', background: '#f3f4f6', color: '#6b7280' }}>{label}</button>)}
              </div>
            </div>
            <input type="text" placeholder="Search dishes…" value={menuSearch} onChange={e => setMenuSearch(e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none mb-2" />
            <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {groups.map(g => <button key={g} onClick={() => setGroupFilter(g)} style={{ fontSize: 11, padding: '2px 7px', border: '0.5px solid', borderColor: groupFilter===g ? '#185FA5' : '#d1d5db', borderRadius: 6, background: groupFilter===g ? '#E6F1FB' : '#fff', color: groupFilter===g ? '#185FA5' : '#6b7280', cursor: 'pointer' }}>{g}</button>)}
            </div>
          </div>
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {loadingMenu ? <div style={{ padding: '2rem', textAlign: 'center', fontSize: 13, color: '#6b7280' }}>Loading menu…</div> :
              filteredMenu.map(item => {
                const isSel = selectedIds.includes(item._id);
                return <div key={item._id} onClick={() => setSelectedIds(prev => isSel ? prev.filter(x=>x!==item._id) : [...prev, item._id])} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', cursor: 'pointer', borderBottom: '0.5px solid #e5e7eb', background: isSel ? '#E6F1FB' : 'transparent' }}>
                  <div style={{ width: 15, height: 15, borderRadius: 3, border: `1.5px solid ${isSel ? '#185FA5' : '#d1d5db'}`, background: isSel ? '#185FA5' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{isSel && <span style={{ color: '#fff', fontSize: 10 }}>✓</span>}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: isSel ? 500 : 400, color: isSel ? '#0C447C' : '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: isSel ? '#378ADD' : '#9ca3af' }}>{item.menuGroup || item.category} · Rs {item.price}</div>
                  </div>
                </div>;
              })
            }
          </div>
          <div style={{ padding: 12, borderTop: '0.5px solid #e5e7eb' }}>
            <button onClick={analyze} disabled={analyzing || selectedIds.length === 0} className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${analyzing || selectedIds.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#185FA5] text-white hover:bg-[#0C447C] cursor-pointer'}`}>
              {analyzing ? 'Analyzing with AI…' : `Analyze ${selectedIds.length} items with AI`}
            </button>
          </div>
        </div>

        {/* Results */}
        <div style={{ background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: 12, padding: '18px' }}>
          {!results && !analyzing && <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#9ca3af' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🧑‍🍳</div>
            <p style={{ fontSize: 14, fontWeight: 500, color: '#374151', margin: '0 0 6px' }}>Ready for AI analysis</p>
            <p style={{ fontSize: 13, margin: 0 }}>Select menu items and click "Analyze with AI" to get Claude-powered ingredient recommendations</p>
          </div>}
          {analyzing && <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #e5e7eb', borderTopColor: '#185FA5', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 14px' }} />
            <p style={{ fontSize: 13, color: '#6b7280' }}>Claude is analyzing {selectedIds.length} menu items…</p>
          </div>}
          {results && <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8, marginBottom: 14 }}>
              {[['Total ingredients', results.stats.total, null],['Critical', results.stats.critCount,'#A32D2D'],['Alerts', results.stats.alertCount, results.stats.alertCount>0?'#E24B4A':null],['Out of stock', results.stats.outCount, results.stats.outCount>0?'#A32D2D':null],['Dishes', results.stats.dishes, null]].map(([label,val,color]) =>
                <div key={label} style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 14px' }}>
                  <div style={{ fontSize: 20, fontWeight: 500, color: color || '#111827' }}>{val}</div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{label}</div>
                </div>
              )}
            </div>
            {results.summary && <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 12px', fontStyle: 'italic', padding: '8px 12px', background: '#f0f9ff', borderRadius: 8 }}>AI: {results.summary}</p>}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              {[['all',`All (${results.stats.total})`],['alerts',`Alerts (${results.stats.alertCount})`],['critical',`Critical (${results.stats.critCount})`],['high',`High (${results.stats.highCount})`]].map(([key,label]) =>
                <button key={key} onClick={() => setFilter(key)} style={{ fontSize: 12, padding: '4px 10px', border: '0.5px solid', borderColor: filter===key?'#185FA5':'#d1d5db', borderRadius: 6, background: filter===key?'#E6F1FB':'#fff', color: filter===key?'#185FA5':'#6b7280', cursor: 'pointer' }}>{label}</button>
              )}
              <input type="text" placeholder="Search ingredient…" value={search} onChange={e => setSearch(e.target.value)} style={{ marginLeft: 'auto', border: '0.5px solid #d1d5db', borderRadius: 6, padding: '4px 10px', fontSize: 12, outline: 'none', width: 150 }} />
            </div>
            {displayed.map(ing => <IngredientRow key={ing.name} ing={ing} maxFreq={maxFreq} />)}
            <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'right', marginTop: 8 }}>{displayed.length} ingredient{displayed.length!==1?'s':''} shown</p>
          </>}
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default IngredientRecommendations;