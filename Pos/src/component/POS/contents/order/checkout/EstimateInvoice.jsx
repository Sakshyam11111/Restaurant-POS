import React from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

const EstimateInvoice = ({
  order,
  orderItems,
  subtotal,
  discount = 0,
  discountMeta = {},
  totalDue,
  onConfirmPay,
  isProcessing = false,
  onAddDiscount,
}) => {
  const hasDiscount = discount > 0;

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

        {/* Order meta */}
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

        {/* Items */}
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

        {/* Totals */}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-gray-900">Rs {subtotal.toFixed(2)}</span>
          </div>

          {/* Discount row — show actual discount or an "Add discount" prompt */}
          {hasDiscount ? (
            <div className="flex justify-between text-sm">
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                Discount
                {discountMeta.type === 'percentage' && discountMeta.value
                  ? ` (${discountMeta.value}%)`
                  : ' (Flat)'}
                {discountMeta.reason ? `:` : ''}
              </span>
              <span className="text-emerald-700 font-semibold">– Rs {discount.toFixed(2)}</span>
            </div>
          ) : (
            onAddDiscount && (
              <button
                onClick={onAddDiscount}
                className="w-full flex items-center justify-between text-sm py-1 group"
              >
                <span className="text-gray-400 group-hover:text-emerald-600 transition-colors flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Add discount
                </span>
                <span className="text-gray-300 group-hover:text-emerald-500 transition-colors text-xs">+ Apply</span>
              </button>
            )
          )}

          {hasDiscount && discountMeta.reason && (
            <p className="text-xs text-gray-400 italic pl-5">"{discountMeta.reason}"</p>
          )}

          <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
            <span className="text-gray-900">Total Due</span>
            <span className={hasDiscount ? 'text-emerald-600' : 'text-[#4A7BA7]'}>
              Rs {totalDue.toFixed(2)}
            </span>
          </div>

          {hasDiscount && (
            <p className="text-xs text-emerald-600 text-right">
              You saved Rs {discount.toFixed(2)} 🎉
            </p>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="font-semibold text-gray-900 mb-2">Thank You !!!</p>
          <p className="text-sm text-gray-600">Thank you for your visit ! Visit again !!</p>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Total:</span>
          <span className={`text-lg font-bold ${hasDiscount ? 'text-emerald-600' : 'text-gray-900'}`}>
            {totalDue.toFixed(2)}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: isProcessing ? 1 : 1.02 }}
          whileTap={{ scale: isProcessing ? 1 : 0.98 }}
          onClick={onConfirmPay}
          disabled={isProcessing}
          className="w-full py-3 bg-[#4A7BA7] text-white rounded-lg font-semibold hover:bg-[#3d6a92] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </>
          ) : (
            'Confirm Pay'
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default EstimateInvoice;