import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Search, ArrowLeft, Plus, Minus, FileText, Edit2, X, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { orderAPI, menuAPI } from '../../../../services/api';
import { useOrders } from '../OrderContext';
import FallbackMenudata from '../menu/data/Menudata.json';
import RecommendationPanel from './RecommendationPanel';

const POSMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifyNewOrder } = useOrders();

  const navState = location.state || {};

  const [menuData, setMenuData] = useState(null);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Menu');
  const [searchQuery, setSearchQuery] = useState('');

  const [orderType, setOrderType] = useState(navState.orderType || 'Dine in');
  const [selectedWaiter, setSelectedWaiter] = useState('');
  const [selectedTable, setSelectedTable] = useState(
    navState.tableId ? String(navState.tableId) : ''
  );
  const [orderItems, setOrderItems] = useState([]);
  const [orderNumber, setOrderNumber] = useState('PR3004');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const aiDrawerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (aiDrawerRef.current && !aiDrawerRef.current.contains(e.target)) {
        setAiDrawerOpen(false);
      }
    };
    if (aiDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [aiDrawerOpen]);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoadingMenu(true);
      try {
        const res = await menuAPI.getMenuItems();
        const items = res.data?.items || [];

        const menuItems = items.map((item) => ({
          id:          item._id,
          name:        item.name,
          price:       item.price,
          currency:    'Rs.',
          image:       item.image || '',
          category:    item.category,
          menuGroup:   item.menuGroup,
          description: item.description || '',
          isVegetarian: item.category === 'Vegetarian' || item.category === 'Vegan',
          availableFor: ['Dine in', 'Takeaway', 'Delivery'],
        }));

        setMenuData({
          categories: [
            { id: 0, name: 'All Menu' },
            { id: 1, name: 'Vegetarian' },
            { id: 2, name: 'Non-Vegetarian' },
            { id: 3, name: 'Main Course' },
            { id: 4, name: 'Appetizers' },
            { id: 5, name: 'Beverages' },
            { id: 6, name: 'Lunch' },
          ],
          menuItems,
          waiters: FallbackMenudata.waiters || [{ id: 1, name: 'Ram Shahi' }],
          tables:  FallbackMenudata.tables  || [{ id: 1, name: 'T1' }],
        });
      } catch (err) {
        console.warn('Menu API unavailable, using static data:', err.message);
        setMenuData({
          ...FallbackMenudata,
          categories: [
            { id: 0, name: 'All Menu' },
            { id: 1, name: 'Vegetarian' },
            { id: 2, name: 'Non-Vegetarian' },
            { id: 3, name: 'Main Course' },
            { id: 4, name: 'Appetizers' },
            { id: 5, name: 'Beverages' },
            { id: 6, name: 'Lunch' },
          ],
        });
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    if (!menuData) return;
    if (!selectedWaiter && menuData.waiters?.length) setSelectedWaiter(menuData.waiters[0].name);
    if (!selectedTable && menuData.tables?.length)   setSelectedTable(String(menuData.tables[0].id));
  }, [menuData]);

  const handleAddItem = (item) => {
    setOrderItems((prev) => {
      const existing = prev.find((o) => o.id === item.id);
      if (existing) return prev.map((o) => o.id === item.id ? { ...o, quantity: o.quantity + 1 } : o);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleDecreaseQuantity = (id) => {
    setOrderItems((prev) =>
      prev
        .map((item) => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id) => setOrderItems((prev) => prev.filter((item) => item.id !== id));
  const handleClearAll = () => setOrderItems([]);

  const handlePlaceOrder = async () => {
    if (orderItems.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    const typeMap = { 'Dine in': 'Dine In', Takeaway: 'Take Away', Delivery: 'Delivery' };
    const payload = {
      table: selectedTable,
      type:  typeMap[orderType] || 'Dine In',
      items: orderItems.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price })),
      waiter: selectedWaiter,
    };
    try {
      const response = await orderAPI.createOrder(payload);
      const createdOrder = response.data?.order;
      if (createdOrder) {
        notifyNewOrder(createdOrder);
        setOrderNumber(createdOrder.kot || 'PR3004');
      }
      toast.success('Order placed successfully!', { duration: 2500, position: 'top-center', icon: '✓' });
      setOrderItems([]);
      setTimeout(() => navigate('/pos'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order.', { duration: 3000, position: 'top-center' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = (() => {
    if (!menuData) return [];
    let items = menuData.menuItems;

    if (selectedCategory === 'Vegetarian') {
      items = items.filter((i) => i.isVegetarian);
    } else if (selectedCategory === 'Non-Vegetarian') {
      items = items.filter((i) => !i.isVegetarian);
    } else if (selectedCategory !== 'All Menu') {
      items = items.filter((i) =>
        i.category === selectedCategory || i.menuGroup === selectedCategory
      );
    }

    if (searchQuery) {
      items = items.filter((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  })();

  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loadingMenu) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-sm text-gray-500">Loading menu…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Toaster />

      <div className="flex-shrink-0" ref={aiDrawerRef}>
        <header className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/pos')}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="h-6 w-px bg-gray-300" />

            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto hide-scrollbar">
              {[
                'All Menu',
                'Vegetarian',
                'Non-Vegetarian',
                'Main Course',
                'Appetizers',
                'Beverages',
                'Lunch'
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-72 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search items…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
            </div>

            <button
              onClick={() => setAiDrawerOpen((prev) => !prev)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 select-none ${
                aiDrawerOpen
                  ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white border-transparent shadow-md shadow-violet-200'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50'
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${aiDrawerOpen ? 'bg-white/20' : 'bg-gradient-to-br from-violet-500 to-blue-500'}`}>
                <Sparkles size={11} className={aiDrawerOpen ? 'text-white' : 'text-white'} />
              </div>
              AI Suggestions
              {orderItems.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${aiDrawerOpen ? 'bg-white/20 text-white' : 'bg-violet-100 text-violet-700'}`}>
                  {orderItems.length}
                </span>
              )}
              {aiDrawerOpen ? <ChevronUp size={14} className="ml-0.5" /> : <ChevronDown size={14} className="ml-0.5" />}
            </button>
          </div>
        </header>

        <div
          className={`overflow-hidden bg-white border-b border-gray-200 transition-all duration-300 ease-in-out ${
            aiDrawerOpen ? 'max-h-[340px] opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ boxShadow: aiDrawerOpen ? '0 4px 24px -4px rgba(109,40,217,0.12)' : 'none' }}
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-violet-500 to-blue-500 rounded flex items-center justify-center">
                  <Sparkles size={10} className="text-white" />
                </div>
                <span className="text-sm font-bold text-gray-800">AI-Powered Recommendations</span>
                <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                  Content-based filtering
                </span>
              </div>
              <button
                onClick={() => setAiDrawerOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
              >
                <X size={14} />
              </button>
            </div>

            <RecommendationPanel
              orderItems={orderItems}
              onAddItem={(item) => {
                handleAddItem(item);
                toast.success(`${item.name} added to order`, { duration: 1500, position: 'top-right', icon: '✓' });
              }}
              layout="horizontal"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {filteredItems.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              <p className="text-lg">No items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAddItem(item)}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <span className="text-4xl">🍽️</span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">{item.name}</h3>
                    <p className="text-base font-bold text-gray-900">Rs {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-96 bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
          <div className="p-5 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
              <span className="text-[#4682B4] font-semibold text-sm">{orderNumber}</span>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['Dine in', 'Takeaway', 'Delivery'].map((type) => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
                    orderType === type ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 py-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-600">Waiter</span>
              <select
                value={selectedWaiter}
                onChange={(e) => setSelectedWaiter(e.target.value)}
                className="text-xs font-semibold text-[#4682B4] bg-transparent border-0 focus:ring-0 cursor-pointer"
              >
                {(menuData?.waiters || []).map((w) => (
                  <option key={w.id} value={w.name}>{w.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-xs font-medium text-gray-600">Table</span>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="text-xs font-semibold text-[#4682B4] bg-transparent border-0 focus:ring-0 cursor-pointer"
              >
                {(menuData?.tables || []).map((t) => (
                  <option key={t.id} value={String(t.id)}>{t.name || t.id}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">Order Items</h3>
              {orderItems.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-[10px] text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {orderItems.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-3xl mb-2">🛒</div>
                <p className="text-xs text-gray-400 mb-3">No items added yet</p>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Click items from the menu or use
                  <button
                    onClick={() => setAiDrawerOpen(true)}
                    className="inline-flex items-center gap-1 ml-1 text-violet-600 font-semibold hover:underline"
                  >
                    <Sparkles size={9} />
                    AI Suggestions
                  </button>
                </p>
              </div>
            ) : (
              <div className="space-y-2 pb-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-2.5">
                    <div className="flex items-start justify-between mb-1.5">
                      <h4 className="font-medium text-gray-900 text-xs leading-tight flex-1 mr-2 truncate">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button className="text-gray-300 hover:text-[#4682B4]">
                          <FileText className="w-3 h-3" />
                        </button>
                        <button className="text-gray-300 hover:text-[#4682B4]">
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleRemoveItem(item.id)} className="text-gray-300 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-2 py-0.5">
                        <button
                          onClick={() => handleDecreaseQuantity(item.id)}
                          disabled={item.quantity <= 1}
                          className="w-4 h-4 flex items-center justify-center text-gray-500 disabled:opacity-30"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleAddItem(item)}
                          className="w-4 h-4 flex items-center justify-center text-[#4682B4]"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <span className="font-bold text-gray-900 text-xs">
                        Rs {item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {orderItems.length > 0 && !aiDrawerOpen && (
            <div className="mx-5 mb-3">
              <button
                onClick={() => setAiDrawerOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg text-xs font-semibold text-violet-700 transition-colors"
              >
                <Sparkles size={11} />
                View AI suggestions for your order
              </button>
            </div>
          )}

          <div className="p-5 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">Total</span>
              <span className="text-xl font-bold text-gray-900">Rs {totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting || orderItems.length === 0}
                className="flex-1 py-2.5 bg-[#4682B4] text-white rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#386184] transition-colors"
              >
                {isSubmitting ? 'Processing…' : 'Place Order'}
              </button>
              <button
                onClick={handleClearAll}
                disabled={orderItems.length === 0}
                className="px-4 py-2.5 bg-red-500 text-white rounded-lg font-semibold text-sm disabled:opacity-50 hover:bg-red-600 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSMenu;