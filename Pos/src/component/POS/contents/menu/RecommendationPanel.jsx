import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, ChevronRight, RefreshCw, Zap, TrendingUp, Star } from 'lucide-react';
import api from '../../../../services/api';

const MATCH_CONFIG = {
  similar: {
    label: 'Similar',
    color: 'bg-violet-100 text-violet-700',
    icon: Star,
    dotColor: 'bg-violet-400',
    border: 'border-violet-100',
  },
  complement: {
    label: 'Pairs Well',
    color: 'bg-emerald-100 text-emerald-700',
    icon: Zap,
    dotColor: 'bg-emerald-400',
    border: 'border-emerald-100',
  },
  popular: {
    label: 'Popular',
    color: 'bg-amber-100 text-amber-700',
    icon: TrendingUp,
    dotColor: 'bg-amber-400',
    border: 'border-amber-100',
  },
  collaborative: {
    label: 'Often together',
    color: 'bg-teal-100 text-teal-700',
    icon: TrendingUp,
    dotColor: 'bg-teal-400',
    border: 'border-teal-100',
  },
};

const HorizontalCard = ({ item, onAdd, adding }) => {
  const config = MATCH_CONFIG[item.matchType] || MATCH_CONFIG.popular;
  const Icon = config.icon;

  return (
    <div
      className={`
        group flex-shrink-0 w-52 bg-white rounded-xl border ${config.border}
        shadow-sm hover:shadow-md hover:border-gray-200
        transition-all duration-200 overflow-hidden
        ${adding ? 'opacity-60 pointer-events-none' : ''}
      `}
    >
      <div className="relative h-28 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <span className="text-4xl select-none">🍽️</span>
        )}
        <span className={`absolute top-1.5 left-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${config.color}`}>
          <Icon size={9} />
          {config.label}
        </span>
      </div>

      <div className="p-2.5">
        <p className="text-xs font-semibold text-gray-800 truncate leading-tight mb-0.5">
          {item.name}
        </p>
        <p className="text-[10px] text-gray-400 truncate mb-2 leading-tight">
          {item.reason}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900">
            Rs {item.price?.toLocaleString() || '—'}
          </span>
          <button
            onClick={() => onAdd(item)}
            disabled={adding}
            className="
              flex items-center gap-1 px-2.5 py-1
              bg-[#4682B4] hover:bg-[#386184]
              text-white rounded-lg text-[10px] font-semibold
              transition-colors duration-150 disabled:opacity-50
            "
          >
            {adding ? <RefreshCw size={9} className="animate-spin" /> : <>Add <ChevronRight size={9} /></>}
          </button>
        </div>
        <div className="mt-2 h-0.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${config.dotColor}`}
            style={{ width: `${Math.round((item.score || 0) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const VerticalCard = ({ item, onAdd, adding }) => {
  const config = MATCH_CONFIG[item.matchType] || MATCH_CONFIG.popular;
  const Icon = config.icon;

  return (
    <div
      className={`
        group relative bg-white rounded-xl border border-gray-100
        shadow-sm hover:shadow-md hover:border-gray-200
        transition-all duration-200 overflow-hidden
        ${adding ? 'opacity-60 pointer-events-none' : ''}
      `}
    >
      <div className="relative h-20 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <span className="text-3xl select-none">🍽️</span>
        )}
        <span className={`absolute top-1.5 left-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${config.color}`}>
          <Icon size={9} />
          {config.label}
        </span>
      </div>
      <div className="p-2.5">
        <p className="text-xs font-semibold text-gray-800 truncate leading-tight mb-0.5">{item.name}</p>
        <p className="text-[10px] text-gray-400 truncate mb-2 leading-tight">{item.reason}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900">Rs {item.price?.toLocaleString() || '—'}</span>
          <button
            onClick={() => onAdd(item)}
            disabled={adding}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#4682B4] hover:bg-[#386184] text-white rounded-lg text-[10px] font-semibold transition-colors duration-150 disabled:opacity-50"
          >
            {adding ? <RefreshCw size={9} className="animate-spin" /> : <>Add <ChevronRight size={9} /></>}
          </button>
        </div>
        <div className="mt-2 h-0.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${config.dotColor}`}
            style={{ width: `${Math.round((item.score || 0) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const ModeTab = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`
      px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all
      ${active
        ? 'bg-[#4682B4] text-white shadow-sm'
        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
    `}
  >
    {children}
  </button>
);

const RecommendationPanel = ({ orderItems = [], onAddItem, layout = 'vertical', className = '' }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('both');
  const [addingId, setAddingId] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const debounceRef = useRef(null);
  const isHorizontal = layout === 'horizontal';

  const fetchRecommendations = useCallback(async (cartItems, currentMode) => {
    setLoading(true);
    setError(null);
    try {
      const ids = cartItems.map((i) => i.id).filter(Boolean).join(',');
      const params = new URLSearchParams({ limit: isHorizontal ? 8 : 5, mode: currentMode });
      if (ids) params.set('itemIds', ids);

      const response = await api.get(`/recommendations?${params}`);
      const recs = response.data?.data?.recommendations || [];
      setRecommendations(recs);
      setHasLoaded(true);
    } catch (err) {
      console.error('Recommendation fetch failed:', err);
      setError('Could not load suggestions');
    } finally {
      setLoading(false);
    }
  }, [isHorizontal]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchRecommendations(orderItems, mode);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [orderItems, mode, fetchRecommendations]);

  const handleAdd = async (item) => {
    if (addingId) return;
    setAddingId(String(item._id));
    onAddItem?.({
      id:          String(item._id),
      name:        item.name,
      price:       item.price,
      image:       item.image || '',
      currency:    'Rs.',
      category:    item.category,
      description: item.reason,
    });
    await new Promise((r) => setTimeout(r, 500));
    setAddingId(null);
  };

  const isEmpty = orderItems.length === 0 && hasLoaded && !loading;

  if (isHorizontal) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1 p-1 bg-gray-50 rounded-lg">
            <ModeTab active={mode === 'both'}          onClick={() => setMode('both')}>      ✨ Smart    </ModeTab>
            <ModeTab active={mode === 'similar'}       onClick={() => setMode('similar')}>   🎯 Similar  </ModeTab>
            <ModeTab active={mode === 'complement'}    onClick={() => setMode('complement')}> 🍷 Pair     </ModeTab>
            <ModeTab active={mode === 'collaborative'} onClick={() => setMode('collaborative')}>👥 Together</ModeTab>
          </div>
          <button
            onClick={() => fetchRecommendations(orderItems, mode)}
            disabled={loading}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Refresh suggestions"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="relative">
          {loading && (
            <div className="flex items-center justify-center h-36 gap-2">
              <div className="w-5 h-5 border-2 border-[#4682B4] border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] text-gray-400">Finding suggestions…</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center justify-center h-36 flex-col gap-2">
              <p className="text-[11px] text-gray-400">{error}</p>
              <button onClick={() => fetchRecommendations(orderItems, mode)} className="text-[10px] text-[#4682B4] hover:underline">
                Try again
              </button>
            </div>
          )}

          {!loading && !error && isEmpty && (
            <div className="flex items-center justify-center h-36 flex-col gap-2 px-4">
              <div className="text-3xl">🛒</div>
              <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                Add items to your order and we'll suggest perfect pairings
              </p>
            </div>
          )}

          {!loading && !error && !isEmpty && recommendations.length === 0 && hasLoaded && (
            <div className="flex items-center justify-center h-36">
              <p className="text-[11px] text-gray-400">No suggestions available right now</p>
            </div>
          )}

          {!loading && !error && recommendations.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-200">
              {recommendations.map((item) => (
                <HorizontalCard
                  key={String(item._id)}
                  item={item}
                  onAdd={handleAdd}
                  adding={addingId === String(item._id)}
                />
              ))}
            </div>
          )}
        </div>

        {recommendations.length > 0 && !loading && (
          <p className="text-[9px] text-gray-300 mt-2">
            Powered by content-based filtering · {recommendations.length} suggestion{recommendations.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-gradient-to-br from-violet-500 to-blue-500 rounded-md flex items-center justify-center">
            <Sparkles size={10} className="text-white" />
          </div>
          <span className="text-xs font-bold text-gray-800">AI Suggestions</span>
          {recommendations.length > 0 && (
            <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">
              {recommendations.length}
            </span>
          )}
        </div>
        <button
          onClick={() => fetchRecommendations(orderItems, mode)}
          disabled={loading}
          className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          title="Refresh suggestions"
        >
          <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex gap-1 mb-3 p-1 bg-gray-50 rounded-lg">
        <ModeTab active={mode === 'both'}          onClick={() => setMode('both')}>      ✨ Smart    </ModeTab>
        <ModeTab active={mode === 'similar'}       onClick={() => setMode('similar')}>   🎯 Similar  </ModeTab>
        <ModeTab active={mode === 'complement'}    onClick={() => setMode('complement')}> 🍷 Pair     </ModeTab>
        <ModeTab active={mode === 'collaborative'} onClick={() => setMode('collaborative')}>👥 Together</ModeTab>
      </div>

      <div className="flex-1 min-h-0">
        {loading && (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <div className="w-6 h-6 border-2 border-[#4682B4] border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] text-gray-400">Finding suggestions…</p>
          </div>
        )}
        {!loading && error && (
          <div className="text-center py-6">
            <p className="text-[11px] text-gray-400 mb-2">{error}</p>
            <button onClick={() => fetchRecommendations(orderItems, mode)} className="text-[10px] text-[#4682B4] hover:underline">
              Try again
            </button>
          </div>
        )}
        {!loading && !error && isEmpty && (
          <div className="text-center py-6 px-2">
            <div className="text-2xl mb-2">🛒</div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Add items to your order and we'll suggest perfect pairings
            </p>
          </div>
        )}
        {!loading && !error && !isEmpty && recommendations.length === 0 && hasLoaded && (
          <div className="text-center py-6">
            <p className="text-[11px] text-gray-400">No suggestions available right now</p>
          </div>
        )}
        {!loading && !error && recommendations.length > 0 && (
          <div className="space-y-2 overflow-y-auto pr-0.5" style={{ maxHeight: '420px' }}>
            {recommendations.map((item) => (
              <VerticalCard
                key={String(item._id)}
                item={item}
                onAdd={handleAdd}
                adding={addingId === String(item._id)}
              />
            ))}
          </div>
        )}
      </div>

      {recommendations.length > 0 && !loading && (
        <p className="text-[9px] text-gray-300 text-center mt-3 leading-relaxed">
          Powered by content-based filtering
        </p>
      )}
    </div>
  );
};

export default RecommendationPanel;