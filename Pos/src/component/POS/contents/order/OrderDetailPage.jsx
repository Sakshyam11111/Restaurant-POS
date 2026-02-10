import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, Search, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { orderAPI } from '../../../../services/api';
import toast from 'react-hot-toast';
import menuItemsData from '../menu/data/Menudata.json';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('Dishes');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        setLoading(true);
        
        if (location.state?.order) {
          setOrder(location.state.order);
          setLoading(false);
          return;
        }

        if (id) {
          const response = await orderAPI.getOrderById(id);
          setOrder(response.data.order);
        }
      } catch (error) {
        console.error('Error loading order:', error);
        toast.error('Failed to load order details');
        navigate('/pos');
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [id, location.state, navigate]);

  const getMenuItemDetails = (itemName) => {
    const normalizedItemName = itemName.toLowerCase().trim();
    
    let menuItem = menuItemsData.menuItems.find(
      item => item.name.toLowerCase() === normalizedItemName
    );

    if (!menuItem) {
      menuItem = menuItemsData.menuItems.find(
        item => normalizedItemName.includes(item.name.toLowerCase()) ||
                item.name.toLowerCase().includes(normalizedItemName)
      );
    }

    return menuItem || {
      name: itemName,
      description: `Delicious ${itemName}`,
      image: menuItemsData.defaultImage,
      category: 'Special',
      tags: []
    };
  };

  const orderItems = order?.items?.map((item, index) => {
    let itemName, quantity;

    if (typeof item === 'string') {
      const parts = item.split(' ×');
      itemName = parts[0];
      quantity = parseInt(parts[1]) || 1;
    } else {
      itemName = item.name;
      quantity = item.quantity || 1;
    }
    
    return {
      id: index + 1,
      name: itemName,
      note: typeof item === 'object' ? (item.note || '') : '',
      qty: quantity,
      price: typeof item === 'object' ? (item.price || 0) : 0
    };
  }) || [];

  const menuItems = orderItems.map(item => {
    const menuDetails = getMenuItemDetails(item.name);
    return {
      id: item.id,
      name: item.name,
      description: menuDetails.description,
      price: item.price || menuDetails.price || 0,
      image: menuDetails.image,
      category: menuDetails.category,
      status: order?.status || 'Pending',
      tags: menuDetails.tags || []
    };
  });

  const total = order?.totalPrice || orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const itemCount = orderItems.reduce((sum, item) => sum + item.qty, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  };

  const orderItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#487AA4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/pos')}
            className="px-6 py-2 bg-[#4A7BA7] text-white rounded-lg hover:bg-[#3d6a92] transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white border-b border-gray-200 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/pos')}
              className="flex items-center gap-3 px-4 py-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium text-gray-900">{order.table}</span>
            </motion.button>
           
            <div className="flex bg-gray-100 rounded-xl p-1">
              {['Dishes', 'KOT', 'Activity'].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-2.5 rounded-lg font-medium relative ${
                    activeTab === tab
                      ? 'text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by KOT, Order ID, Table, or Waiter..."
                className="pl-10 pr-4 py-2.5 w-96 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </motion.div>
           
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              <span className="text-gray-700">{new Date().toLocaleDateString()}</span>
              <Calendar className="w-5 h-5 text-gray-600" />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/posmenu', { 
                state: { 
                  tableId: order.table,
                  orderType: order.type 
                } 
              })}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#4A7BA7] text-white rounded-xl hover:bg-[#3d6a92] transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Add Order</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="flex">
        <div className="flex-1 p-6 bg-gray-50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-gray-900">{order.type}</h1>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold text-gray-900">{order.table}</span>
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.3 }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'Preparing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'Ready' ? 'bg-green-100 text-green-700' :
                    order.status === 'Served' ? 'bg-gray-100 text-gray-700' :
                    'bg-red-100 text-red-700'
                  }`}
                >
                  {order.status}
                </motion.span>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 text-gray-500"
            >
              <Clock className="w-5 h-5" />
              <span className="text-sm">{order.time}</span>
            </motion.div>
          </motion.div>

          {activeTab === 'Dishes' && (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-3 gap-6"
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <motion.img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        e.target.src = menuItemsData.defaultImage;
                      }}
                    />
                    {item.category && (
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-700">
                        {item.category}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="px-3 py-1 bg-blue-50 text-[#4A7BA7] rounded-lg text-sm font-medium"
                      >
                        {item.status}
                      </motion.span>
                    </div>
                    <p className="text-gray-600 text-sm mb-5 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-semibold text-gray-900">
                        Rs {item.price}
                      </span>
                      <motion.button 
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-11 h-11 flex items-center justify-center bg-[#4A7BA7] text-white rounded-xl hover:bg-[#3d6a92] transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'KOT' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">KOT Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">KOT Number:</span>
                  <span className="font-medium text-gray-900">{order.kot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Waiter:</span>
                  <span className="font-medium text-gray-900">{order.waiter || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    order.status === 'Pending' ? 'text-yellow-600' :
                    order.status === 'Preparing' ? 'text-blue-600' :
                    order.status === 'Ready' ? 'text-green-600' :
                    'text-gray-600'
                  }`}>{order.status}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Activity' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Created</p>
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                </div>
                {order.status !== 'Pending' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Status Updated</p>
                      <p className="text-xs text-gray-500">Current: {order.status}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-96 bg-white border-l border-gray-200 flex flex-col"
        >
          <div className="p-6 border-b border-gray-200">
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-semibold text-gray-900 mb-1"
            >
              {order.kot}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[#4A7BA7] text-sm font-medium"
            >
              {order.table} - {itemCount} Items
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="px-6 pt-6 pb-4"
          >
            <div className="flex items-center gap-2">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-2 h-2 rounded-full ${
                  order.status === 'Pending' ? 'bg-yellow-500' :
                  order.status === 'Preparing' ? 'bg-blue-500' :
                  order.status === 'Ready' ? 'bg-green-500' :
                  'bg-gray-500'
                }`}
              />
              <span className="text-sm font-semibold text-gray-900">Order Items</span>
            </div>
          </motion.div>

          <div className="flex-1 overflow-auto px-6">
            <div className="space-y-1">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center text-sm font-semibold text-gray-700 pb-3"
              >
                <div className="flex-1">Items</div>
                <div className="w-20 text-center">Qty</div>
                <div className="w-24 text-right">Price</div>
              </motion.div>

              <AnimatePresence>
                {orderItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={orderItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ delay: index * 0.1 + 0.7 }}
                    className="py-4 border-b border-gray-100"
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">{item.name}</div>
                        {item.note && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-xs text-gray-500 italic"
                          >
                            Note: {item.note}
                          </motion.div>
                        )}
                      </div>
                      <div className="w-20 text-center text-gray-900 font-medium">{item.qty}</div>
                      <div className="w-24 text-right text-gray-900 font-medium">
                        {item.price > 0 ? `Rs ${item.price}` : '-'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="p-6 border-t border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: 'spring', bounce: 0.4 }}
                className="text-3xl font-bold text-gray-900"
              >
                Rs {total > 0 ? total.toFixed(2) : '0.00'}
              </motion.span>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-[#4A7BA7] text-white rounded-xl font-semibold hover:bg-[#3d6a92] transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Checkout</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetailPage;