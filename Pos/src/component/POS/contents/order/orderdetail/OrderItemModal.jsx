import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const OrderItemModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative p-6 pb-4">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-red-400 hover:text-red-500 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h2>
                <p className="text-sm text-gray-500">No Modifier</p>
                <p className="text-sm text-gray-500">No Note</p>
              </div>
              <div className="text-5xl">
                {item.image.includes('default') ? (
                  <span className="text-4xl">🍔</span>
                ) : (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 font-medium text-gray-600 text-left">Name</th>
                    <th className="py-3 px-4 font-medium text-gray-600 text-center">Qty</th>
                    <th className="py-3 px-4 font-medium text-gray-600 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="py-4 px-4 text-gray-900">{item.name}</td>
                    <td className="py-4 px-4 text-center text-gray-900">{item.qty}</td>
                    <td className="py-4 px-4 text-right text-gray-900">{item.price}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="bg-gray-100 rounded-xl p-1 flex gap-1">
              <button
                onClick={() => {
                  alert('Status changed to Pending');
                  onClose();
                }}
                className="flex-1 py-2.5 px-4 bg-white text-gray-700 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors"
              >
                Pending
              </button>

              <button
                onClick={() => {
                  alert('Status changed to Cancel');
                  onClose();
                }}
                className="flex-1 py-2.5 px-4 text-gray-500 rounded-lg text-sm font-medium hover:text-gray-700 hover:bg-gray-200/50 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  alert('Status changed to Completed');
                  onClose();
                }}
                className="flex-1 py-2.5 px-4 text-gray-500 rounded-lg text-sm font-medium hover:text-gray-700 hover:bg-gray-200/50 transition-colors"
              >
                Completed
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderItemModal;