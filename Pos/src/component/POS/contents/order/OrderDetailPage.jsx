import React, { useState } from 'react';
import { Plus, ChevronLeft, Search, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const OrderDetailPage = () => {
  const [activeTab, setActiveTab] = useState('Dishes');

  const orderItems = [
    { id: 1, name: 'Burger', note: 'Note: No onion', qty: 1, price: 120 },
    { id: 2, name: 'Coffee', note: '', qty: 1, price: 80 },
    { id: 3, name: 'Pizza', note: '', qty: 1, price: 220 }
  ];
  
  const menuItems = [
    {
      id: 1,
      name: 'Burger',
      description: 'A delicious beef patty served in a toasted bun, topped with cheese, lettuce, tomatoes, and our signature sauce.',
      price: 120,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      status: 'Pending'
    },
    {
      id: 2,
      name: 'Coffee',
      description: 'A rich espresso topped with steamed milk and froth, perfect for a comforting pick-me-up any time of day.',
      price: 80,
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      status: 'Pending'
    },
    {
      id: 3,
      name: 'Pizza',
      description: 'A classic pizza topped with fresh mozzarella, tomatoes, and basil, drizzled with olive oil for a burst of flavor.',
      price: 220,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      status: 'Pending'
    }
  ];
  
  const total = orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
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
            <Link to="/pos">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-4 py-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium text-gray-900">Table 1</span>
              </motion.button>
            </Link>
           
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
              <span className="text-gray-700">2025/12/16</span>
              <Calendar className="w-5 h-5 text-gray-600" />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
              <h1 className="text-2xl font-semibold text-gray-900">Dine In</h1>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold text-gray-900">Table 1</span>
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.3 }}
                  className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium"
                >
                  Active
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
              <span className="text-sm">Last update: 2 min ago</span>
            </motion.div>
          </motion.div>

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
                <div className="relative h-56 overflow-hidden">
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
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
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                    {item.description}
                  </p>
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
              Order #001
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[#4A7BA7] text-sm font-medium"
            >
              Table 1 - {itemCount} Items
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
                className="w-2 h-2 bg-[#4A7BA7] rounded-full"
              />
              <span className="text-sm font-semibold text-gray-900">Pending Items</span>
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
                    className="py-4"
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">{item.name}</div>
                        {item.note && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-xs text-gray-500"
                          >
                            {item.note}
                          </motion.div>
                        )}
                      </div>
                      <div className="w-20 text-center text-gray-900 font-medium">{item.qty}</div>
                      <div className="w-24 text-right text-gray-900 font-medium">{item.price}</div>
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
                {total.toFixed(2)}
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