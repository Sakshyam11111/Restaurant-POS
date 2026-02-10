import { motion, AnimatePresence } from 'framer-motion';

const OrderSummarySidebar = ({ order, menuItems, total, itemCount, navigate }) => {
  const orderItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  const handleCheckout = () => {
    const orderWithPrices = {
      ...order,
      items: menuItems.map(item => ({
        name: item.name,
        quantity: item.qty,
        price: item.price,
        note: item.note
      })),
      totalPrice: total
    };
    
    navigate('/checkout', { state: { order: orderWithPrices } });
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col relative">
      <div className="sticky top-0 bg-white z-20 border-b border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">{order.kot}</h2>
          <p className="text-[#4A7BA7] text-sm font-medium">
            {order.table} - {itemCount} Items
          </p>
        </div>

        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                order.status === 'Pending'
                  ? 'bg-yellow-500'
                  : order.status === 'Preparing'
                  ? 'bg-blue-500'
                  : order.status === 'Ready'
                  ? 'bg-green-500'
                  : 'bg-gray-500'
              }`}
            />
            <span className="text-sm font-semibold text-gray-900">Order Items</span>
          </div>
        </div>

        <div className="px-6 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center text-sm font-semibold text-gray-700">
            <div className="flex-1">Items</div>
            <div className="w-20 text-center">Qty</div>
            <div className="w-24 text-right">Price</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-6">
          <AnimatePresence>
            {menuItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={orderItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ delay: index * 0.1 + 0.7 }}
                className="py-4 border-b border-gray-100 last:border-b-0"
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
                  <div className="w-24 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-gray-900 font-medium">
                        {item.price > 0 ? `Rs ${item.price}` : '—'}
                      </span>
                      {item.priceFromOrder > 0 && item.price !== item.priceFromOrder && (
                        <span className="text-xs text-gray-500 line-through">
                          Rs {item.priceFromOrder}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-gray-900">
            Rs {total > 0 ? total.toFixed(2) : '0.00'}
          </span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full py-3.5 bg-[#4A7BA7] text-white rounded-xl font-semibold hover:bg-[#3d6a92] transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <span>Checkout</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default OrderSummarySidebar;