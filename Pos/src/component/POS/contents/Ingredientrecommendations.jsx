import React, { useState, useEffect, useCallback } from 'react';
import { Package, Search, RefreshCw, ChevronDown, AlertTriangle, TrendingUp, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import { menuAPI } from '../../../services/api';
import IngredientRecommendationPanel from './menuitems/IngredientRecommendationPanel';

const IngredientRecommendations = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [menuSearch, setMenuSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('All');
  const [selectMode, setSelectMode] = useState('all');

  const loadMenu = useCallback(async () => {
    setLoadingMenu(true);
    try {
      const res = await menuAPI.getMenuItems();
      const items = res.data?.items || [];
      setMenuItems(items);
      setSelectedIds(items.map(i => i._id));
    } catch (err) {
      toast.error('Failed to load menu items');
    } finally {
      setLoadingMenu(false);
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const groups = ['All', ...Array.from(new Set(menuItems.map(i => i.menuGroup).filter(Boolean)))];

  const filteredMenu = menuItems.filter(item => {
    const matchGroup = groupFilter === 'All' || item.menuGroup === groupFilter;
    const matchSearch = !menuSearch || item.name.toLowerCase().includes(menuSearch.toLowerCase());
    return matchGroup && matchSearch;
  });

  const toggleItem = (id) => {
    setSelectMode('custom');
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectMode('all');
    setSelectedIds(menuItems.map(i => i._id));
  };

  const selectNone = () => {
    setSelectMode('custom');
    setSelectedIds([]);
  };

  const selectFiltered = () => {
    setSelectMode('custom');
    setSelectedIds(filteredMenu.map(i => i._id));
  };

  const selectedCount = selectedIds.length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background-tertiary)', padding: '24px', fontFamily: 'var(--font-sans)' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: 'var(--color-text-primary)', margin: 0 }}>
            Ingredient recommendations
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>
            Select menu items to see which ingredients you need and check stock levels.
          </p>
        </div>
        <button
          onClick={loadMenu}
          disabled={loadingMenu}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', fontSize: 13,
            background: 'var(--color-background-primary)',
            border: '0.5px solid var(--color-border-secondary)',
            borderRadius: 8, cursor: 'pointer',
            color: 'var(--color-text-secondary)',
          }}
        >
          <RefreshCw size={14} style={{ animation: loadingMenu ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, alignItems: 'start' }}>

        {/* Menu item selector */}
        <div style={{
          background: 'var(--color-background-primary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                Menu items ({selectedCount} selected)
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={selectAll} style={smallBtn}>All</button>
                <button onClick={selectFiltered} style={smallBtn}>Filtered</button>
                <button onClick={selectNone} style={smallBtn}>None</button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--color-background-secondary)', borderRadius: 6, padding: '5px 10px', marginBottom: 8 }}>
              <Search size={13} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search dishes…"
                value={menuSearch}
                onChange={e => setMenuSearch(e.target.value)}
                style={{ border: 'none', background: 'none', outline: 'none', fontSize: 12, color: 'var(--color-text-primary)', width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {groups.map(g => (
                <button
                  key={g}
                  onClick={() => setGroupFilter(g)}
                  style={{
                    fontSize: 11, padding: '2px 8px',
                    border: '0.5px solid',
                    borderColor: groupFilter === g ? '#185FA5' : 'var(--color-border-secondary)',
                    borderRadius: 6,
                    background: groupFilter === g ? '#E6F1FB' : 'var(--color-background-primary)',
                    color: groupFilter === g ? '#185FA5' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div style={{ maxHeight: 560, overflowY: 'auto' }}>
            {loadingMenu ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 13 }}>
                Loading menu…
              </div>
            ) : filteredMenu.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 13 }}>
                No items match.
              </div>
            ) : (
              filteredMenu.map(item => {
                const isSelected = selectedIds.includes(item._id);
                return (
                  <div
                    key={item._id}
                    onClick={() => toggleItem(item._id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 16px',
                      cursor: 'pointer',
                      borderBottom: '0.5px solid var(--color-border-tertiary)',
                      background: isSelected ? '#E6F1FB' : 'transparent',
                      transition: 'background 0.1s',
                    }}
                  >
                    <div style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                      border: `1.5px solid ${isSelected ? '#185FA5' : 'var(--color-border-secondary)'}`,
                      background: isSelected ? '#185FA5' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isSelected && <span style={{ color: '#fff', fontSize: 10, lineHeight: 1 }}>✓</span>}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: isSelected ? 500 : 400, color: isSelected ? '#0C447C' : 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 11, color: isSelected ? '#378ADD' : 'var(--color-text-secondary)' }}>
                        {item.menuGroup || item.category} · Rs {item.price}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recommendations panel */}
        <div style={{
          background: 'var(--color-background-primary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 12,
          padding: '20px 20px',
        }}>
          <IngredientRecommendationPanel selectedMenuItemIds={selectedIds} />
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const smallBtn = {
  fontSize: 11, padding: '2px 8px',
  border: '0.5px solid var(--color-border-secondary)',
  borderRadius: 6, cursor: 'pointer',
  background: 'var(--color-background-secondary)',
  color: 'var(--color-text-secondary)',
};

export default IngredientRecommendations;