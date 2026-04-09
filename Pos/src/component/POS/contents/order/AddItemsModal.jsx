// Pos/src/component/POS/contents/order/AddItemsModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, Minus, ShoppingCart, Sparkles } from 'lucide-react';
import { menuAPI, orderAPI } from '../../../../services/api';
import toast from 'react-hot-toast';
import FallbackMenudata from '../menu/data/Menudata.json';

const AddItemsModal = ({ isOpen, onClose, order, onItemsAdded }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Menu');
  const [cartItems, setCartItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'All Menu', 'Vegetarian', 'Non-Vegetarian', 'Main Course',
    'Appetizers', 'Beverages', 'Lunch',
  ];

  useEffect(() => {
    if (!isOpen) return;
    setCartItems([]);
    setSearchQuery('');
    setSelectedCategory('All Menu');
    fetchMenu();
  }, [isOpen]);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await menuAPI.getMenuItems();
      const items = (res.data?.items || []).map((item) => ({
        id: item._id,
        name: item.name,
        price: item.price,
        image: item.image || '',
        category: item.category,
        menuGroup: item.menuGroup,
        isVegetarian: item.category === 'Vegetarian' || item.category === 'Vegan',
      }));
      setMenuItems(items);
    } catch {
      setMenuItems(
        FallbackMenudata.menuItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image || '',
          category: item.category,
          isVegetarian: false,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchCat =
      selectedCategory === 'All Menu' ||
      (selectedCategory === 'Vegetarian' && item.isVegetarian) ||
      (selectedCategory === 'Non-Vegetarian' && !item.isVegetarian) ||
      item.category === selectedCategory ||
      item.menuGroup === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAdd = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleDecrement = (id) => {
    setCartItems((prev) =>
      prev.map((c) => c.id === id ? { ...c, qty: c.qty - 1 } : c).filter((c) => c.qty > 0)
    );
  };

  const cartTotal = cartItems.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cartItems.reduce((sum, c) => sum + c.qty, 0);

  const handleConfirm = async () => {
    if (!cartItems.length || isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Build updated items list: merge existing + new
      const existingItems = (order.items || []).map((item) => {
        if (typeof item === 'string') {
          const parts = item.split(' ×');
          return { name: parts[0]?.trim(), quantity: parseInt(parts[1]) || 1, price: 0 };
        }
        return { name: item.name, quantity: item.quantity || 1, price: item.price || 0 };
      });

      const newItems = cartItems.map((c) => ({ name: c.name, quantity: c.qty, price: c.price }));
      const allItems = [...existingItems, ...newItems];

      const newTotal = (order.totalPrice || 0) + cartTotal;

      await orderAPI.updateOrderStatus(order.id, {
        items: allItems,
        totalPrice: newTotal,
      });

      toast.success(`${cartCount} item${cartCount !== 1 ? 's' : ''} added to order!`, {
        icon: '✓',
        duration: 2000,
        position: 'top-center',
      });

      onItemsAdded?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add items. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.97 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="bg-white w-full sm:max-w-4xl sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: '90vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#487AA4] to-[#386184] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Add More Items</h2>
                <p className="text-white/70 text-xs">
                  {order?.kot || order?.id} · {order?.table}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1 px-4 py-3 border-b border-gray-100 overflow-x-auto bg-gray-50 flex-shrink-0 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#487AA4] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-white hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search menu items…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#487AA4]/30 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex flex-1 min-h-0">
            {/* Menu Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-40 gap-2 text-gray-400">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#487AA4]" />
                  <span className="text-sm">Loading menu…</span>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                  No items found
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredItems.map((item) => {
                    const inCart = cartItems.find((c) => c.id === item.id);
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        className={`bg-white rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${
                          inCart ? 'border-[#487AA4] shadow-md' : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                        }`}
                        onClick={() => handleAdd(item)}
                      >
                        <div className="aspect-video bg-gray-50 relative">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                          )}
                          {inCart && (
                            <div className="absolute top-1.5 right-1.5 bg-[#487AA4] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                              ×{inCart.qty}
                            </div>
                          )}
                        </div>
                        <div className="p-2.5">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-sm font-bold text-gray-800">Rs {item.price}</span>
                            {inCart ? (
                              <div
                                className="flex items-center gap-1.5 bg-[#487AA4]/10 rounded-lg px-1.5 py-0.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => handleDecrement(item.id)}
                                  className="w-5 h-5 flex items-center justify-center text-[#487AA4] hover:bg-[#487AA4]/20 rounded"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold text-[#487AA4] w-4 text-center">{inCart.qty}</span>
                                <button
                                  onClick={() => handleAdd(item)}
                                  className="w-5 h-5 flex items-center justify-center text-[#487AA4] hover:bg-[#487AA4]/20 rounded"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="w-6 h-6 bg-[#487AA4] rounded-lg flex items-center justify-center">
                                <Plus className="w-3.5 h-3.5 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cart Summary */}
            {cartItems.length > 0 && (
              <div className="w-64 border-l border-gray-100 bg-gray-50 flex flex-col flex-shrink-0 hidden sm:flex">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-[#487AA4]" />
                    <span className="text-sm font-semibold text-gray-900">
                      New Items ({cartCount})
                    </span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {cartItems.map((c) => (
                    <div key={c.id} className="bg-white rounded-lg p-2.5 border border-gray-100">
                      <p className="text-xs font-medium text-gray-900 truncate">{c.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-gray-500">×{c.qty}</span>
                        <span className="text-xs font-bold text-[#487AA4]">Rs {c.price * c.qty}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-500">Items total</span>
                    <span className="text-sm font-bold text-gray-900">Rs {cartTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="flex items-center gap-3">
              {cartItems.length > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#487AA4] rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {cartCount} item{cartCount !== 1 ? 's' : ''} · Rs {cartTotal.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Ready to add to order</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">Select items to add to this order</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: cartItems.length ? 1.02 : 1 }}
                whileTap={{ scale: cartItems.length ? 0.97 : 1 }}
                onClick={handleConfirm}
                disabled={!cartItems.length || isSubmitting}
                className="px-5 py-2 bg-[#487AA4] text-white rounded-lg text-sm font-semibold hover:bg-[#386184] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
                    Adding…
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add to Order
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddItemsModal;