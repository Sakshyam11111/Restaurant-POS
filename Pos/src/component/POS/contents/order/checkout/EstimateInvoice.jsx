import React from 'react';
import { motion } from 'framer-motion';

const EstimateInvoice = ({ order, orderItems, subtotal, discount, totalDue, onConfirmPay }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm sticky top-6">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">User</h3>
        </div>
        <p className="text-sm text-gray-600">Kathmandu, Nepal</p>
      </div>

      <div className="px-6 py-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">ESTIMATE INVOICE</h4>

        <div className="space-y-2 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="text-gray-900">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="text-gray-900">{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID:</span>
            <span className="text-gray-900">{order.kot}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Table:</span>
            <span className="text-gray-900">{order.table}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order Type:</span>
            <span className="text-gray-900">{order.type}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-4">
          <h5 className="text-sm font-semibold text-gray-900 mb-3">Items</h5>
          <div className="space-y-2">
            {orderItems.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <div className="flex-1">
                  <span className="text-gray-900">{item.name}</span>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span>Qty: {item.quantity}</span>
                    <span>Price: Rs {item.price}</span>
                  </div>
                </div>
                <span className="text-gray-900 font-medium">Rs {item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-gray-900">Rs {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount:</span>
            <span className="text-gray-900">Rs {discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
            <span className="text-gray-900">Total Due</span>
            <span className="text-[#4A7BA7]">Rs {totalDue.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="font-semibold text-gray-900 mb-2">Thank You !!!</p>
          <p className="text-sm text-gray-600">Thank you for your visit ! Visit again !!</p>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Total:</span>
          <span className="text-lg font-bold text-gray-900">{totalDue.toFixed(2)}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConfirmPay}
          className="w-full py-3 bg-[#4A7BA7] text-white rounded-lg font-semibold hover:bg-[#3d6a92] transition-colors"
        >
          Confirm Pay
        </motion.button>
      </div>
    </div>
  );
};

export default EstimateInvoice;