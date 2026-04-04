import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Search, Trash2, ArrowLeft, Plus, Minus, ChefHat, FileText, Edit2, X } from 'lucide-react';
import { orderAPI, menuAPI } from '../../../../services/api';
import { useOrders } from '../OrderContext';
import FallbackMenudata from '../menu/data/Menudata.json';

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
  const [selectedTable, setSelectedTable] = useState(navState.tableId ? String(navState.tableId) : '');
  const [orderItems, setOrderItems] = useState([]);

  const [orderNumber, setOrderNumber] = useState('PR3004');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoadingMenu(true);
      try {
        const res = await menuAPI.getMenuItems();
        const items = res.data?.items || [];

        const categories = [
          { id: 0, name: 'All Menu', icon: 'grid' },
          { id: 1, name: 'Vegetarian', icon: 'leaf' },
          { id: 2, name: 'Non-Vegetarian', icon: 'meat' },
          ...Array.from(new Set(items.map((i) => i.category).filter(Boolean))).map((cat, idx) => ({
            id: idx + 3,
            name: cat,
            icon: cat.toLowerCase(),
          })),
        ];

        const menuItems = items.map((item) => ({
          id: item._id,
          name: item.name,
          price: item.price,
          currency: 'Rs.',
          image: item.image || '',
          category: item.category,
          description: item.description || '',
          isVegetarian: item.isVegetarian || false,
          availableFor: ['Dine in', 'Takeaway', 'Delivery'],
        }));

        setMenuData({
          categories,
          menuItems,
          waiters: FallbackMenudata.waiters || [{ id: 1, name: 'Ram Shahi' }],
          tables: FallbackMenudata.tables || [{ id: 1, name: 'F1' }],
        });
      } catch (err) {
        console.warn('Menu API unavailable, using static data:', err.message);
        setMenuData({
          ...FallbackMenudata,
          categories: [
            { id: 0, name: 'All Menu', icon: 'grid' },
            { id: 1, name: 'Vegetarian', icon: 'leaf' },
            { id: 2, name: 'Non-Vegetarian', icon: 'meat' },
            ...(FallbackMenudata.categories || []).filter(c => c.id !== 0),
          ]
        });
      } finally {
        setLoadingMenu(false);
      }
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    if (!menuData) return;
    if (!selectedWaiter && menuData.waiters?.length) {
      setSelectedWaiter(menuData.waiters[0].name);
    }
    if (!selectedTable && menuData.tables?.length) {
      setSelectedTable(String(menuData.tables[0].id));
    }
  }, [menuData]);

  const handleAddItem = (item) => {
    setOrderItems((prev) => {
      const existing = prev.find((o) => o.id === item.id);
      if (existing) {
        return prev.map((o) => o.id === item.id ? { ...o, quantity: o.quantity + 1 } : o);
      }
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
      type: typeMap[orderType] || 'Dine In',
      items: orderItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      waiter: selectedWaiter,
    };

    try {
      const response = await orderAPI.createOrder(payload);
      const createdOrder = response.data?.order;

      if (createdOrder) {
        notifyNewOrder(createdOrder);
        setOrderNumber(createdOrder.kot || createdOrder.orderNumber || 'PR3004');
      }

      toast.success('Order placed successfully!', {
        duration: 2500,
        position: 'top-center',
        icon: '✓',
      });

      setOrderItems([]);
      setTimeout(() => navigate('/pos'), 1000);
    } catch (err) {
      console.error('Place order error:', err);
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.', {
        duration: 3000,
        position: 'top-center',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = (() => {
    if (!menuData) return [];
    let items = menuData.menuItems;
    
    if (selectedCategory === 'Vegetarian') {
      items = items.filter((item) => item.isVegetarian);
    } else if (selectedCategory === 'Non-Vegetarian') {
      items = items.filter((item) => !item.isVegetarian);
    } else if (selectedCategory !== 'All Menu') {
      items = items.filter((item) => item.category === selectedCategory);
    }
    
    if (searchQuery) {
      items = items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    return items;
  })();

  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loadingMenu) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-sm text-gray-500">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Toaster />

      {/* Single Header */}
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
          
          {/* Category Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {['All Menu', 'Vegetarian', 'Non-Vegetarian'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
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

        {/* Search */}
        <div className="w-80 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {filteredItems.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              <p className="text-lg">No items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
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
                    <h3 className="font-medium text-gray-900 text-sm mb-1">{item.name}</h3>
                    <p className="text-base font-bold text-gray-900">
                      {item.currency} {item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Details Sidebar - Styled like reference image */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Order Details Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
              <span className="text-[#4682B4] font-semibold">{orderNumber}</span>
            </div>

            {/* Order Type Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['Dine in', 'Takeaway', 'Delivery'].map((type) => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    orderType === type
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Waiter & Table */}
          <div className="px-6 py-4 space-y-3 border-b border-gray-200">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">Waiter</span>
              <select
                value={selectedWaiter}
                onChange={(e) => setSelectedWaiter(e.target.value)}
                className="text-sm font-semibold bg-[#4682B4] bg-transparent border-0 focus:ring-0 cursor-pointer"
              >
                {menuData.waiters.map((waiter) => (
                  <option key={waiter.id} value={waiter.name}>{waiter.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-700">Table</span>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="text-sm font-semibold text-[#4682B4] bg-transparent border-0 focus:ring-0 cursor-pointer"
              >
                {menuData.tables.map((table) => (
                  <option key={table.id} value={String(table.id)}>
                    {table.name || table.id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Order Items */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Order Items</h3>
              {orderItems.length > 0 && (
                <button 
                  onClick={handleClearAll} 
                  className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                >
                  Clear All items
                </button>
              )}
            </div>

            {orderItems.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <p className="text-sm">No items added</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-[#4682B4]">
                          <FileText className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-[#4682B4]">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
                        <button
                          onClick={() => handleDecreaseQuantity(item.id)}
                          className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleAddItem(item)}
                          className="w-6 h-6 flex items-center justify-center text-[#4682B4] hover:text-blue-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-bold text-gray-900">
                        {item.currency} {item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-semibold text-gray-700">Total</span>
              <span className="text-2xl font-bold text-gray-900">Rs {totalAmount}</span>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting || orderItems.length === 0}
                className="flex-1 py-3 bg-[#4682B4] text-white rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-900 transition-colors"
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
              <button
                onClick={handleClearAll}
                disabled={orderItems.length === 0}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold text-sm disabled:opacity-50 hover:bg-red-600 transition-colors"
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