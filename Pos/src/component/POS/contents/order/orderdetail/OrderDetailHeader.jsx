import { motion } from 'framer-motion';
import { ChevronLeft, Search, Calendar, Plus } from 'lucide-react';

const OrderDetailHeader = ({ order, activeTab, setActiveTab, navigate }) => {
  return (
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
                  activeTab === tab ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
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
            onClick={() =>
              navigate('/posmenu', {
                state: { tableId: order.table, orderType: order.type },
              })
            }
            className="flex items-center gap-2 px-6 py-2.5 bg-[#4A7BA7] text-white rounded-xl hover:bg-[#3d6a92] transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Add Order</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetailHeader;