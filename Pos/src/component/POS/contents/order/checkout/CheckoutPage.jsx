import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Printer, Download, PlusCircle, Tag, X, Percent, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderAPI, tableAPI } from '../../../../../services/api';

import OrderItemsSection from './OrderItemsSection';
import CustomerAndPayment from './CustomerAndPayment';
import EstimateInvoice from './EstimateInvoice';
import AddItemsModal from '../AddItemsModal';

const extractTableId = (tableField) => {
  if (!tableField) return null;
  const str = String(tableField).trim();
  const hashMatch = str.match(/#(\d+)/);
  if (hashMatch) return hashMatch[1];
  if (/^\d+$/.test(str)) return str;
  return null;
};

const DiscountModal = ({ isOpen, onClose, subtotal, currentDiscount, onApply }) => {
  const [discountType, setDiscountType] = useState(currentDiscount.type || 'percentage');
  const [discountValue, setDiscountValue] = useState(
    currentDiscount.value > 0 ? String(currentDiscount.value) : ''
  );
  const [reason, setReason] = useState(currentDiscount.reason || '');

  const computedDiscount = (() => {
    const val = parseFloat(discountValue) || 0;
    if (discountType === 'percentage') return (subtotal * Math.min(val, 100)) / 100;
    return Math.min(val, subtotal);
  })();

  const afterDiscount = subtotal - computedDiscount;

  const handleApply = () => {
    const val = parseFloat(discountValue) || 0;
    if (val <= 0) { toast.error('Please enter a valid discount value'); return; }
    if (discountType === 'percentage' && val > 100) { toast.error('Percentage cannot exceed 100%'); return; }
    if (discountType === 'flat' && val > subtotal) { toast.error('Flat discount cannot exceed order total'); return; }
    onApply({ type: discountType, value: val, reason, amount: computedDiscount });
    toast.success('Discount applied!', { icon: '🎉', duration: 1800 });
    onClose();
  };

  const handleRemove = () => {
    onApply({ type: 'percentage', value: 0, reason: '', amount: 0 });
    toast('Discount removed', { icon: '✕', duration: 1500 });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 340 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-[#4A7BA7] to-[#386184] px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Apply Discount</h3>
                  <p className="text-white/70 text-xs mt-0.5">
                    Order subtotal: Rs {subtotal.toLocaleString()}
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
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                {[
                  { key: 'percentage', label: 'Percentage', Icon: Percent },
                  { key: 'flat',       label: 'Flat Amount', Icon: DollarSign },
                ].map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    onClick={() => { setDiscountType(key); setDiscountValue(''); }}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      discountType === key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount (Rs)'}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm select-none">
                  {discountType === 'percentage' ? '%' : 'Rs'}
                </span>
                <input
                  type="number"
                  min="0"
                  max={discountType === 'percentage' ? 100 : subtotal}
                  step={discountType === 'percentage' ? '0.5' : '1'}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === 'percentage' ? '0 – 100' : '0'}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A7BA7] focus:border-[#4A7BA7] outline-none text-lg font-semibold text-gray-900"
                  autoFocus
                />
              </div>

              {discountType === 'percentage' && (
                <div className="flex gap-2 mt-2">
                  {[5, 10, 15, 20, 25].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setDiscountValue(String(pct))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        discountValue === String(pct)
                          ? 'bg-[#4A7BA7] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-[#4A7BA7]/10 hover:text-[#4A7BA7]'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Loyalty discount, Manager override…"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A7BA7] focus:border-[#4A7BA7] outline-none text-sm"
              />
            </div>

            {computedDiscount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#4A7BA7]/5 border border-[#4A7BA7]/20 rounded-xl p-4 space-y-2"
              >
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-[#4A7BA7] font-medium">
                  <span>
                    Discount
                    {discountType === 'percentage' && discountValue
                      ? ` (${parseFloat(discountValue).toFixed(1)}%)`
                      : ''}
                  </span>
                  <span>– Rs {computedDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 border-t border-[#4A7BA7]/20 pt-2">
                  <span>Total Due</span>
                  <span className="text-[#4A7BA7]">Rs {afterDiscount.toFixed(2)}</span>
                </div>
              </motion.div>
            )}

            <div className="flex gap-3 pt-1">
              {currentDiscount.value > 0 && (
                <button
                  onClick={handleRemove}
                  className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Remove
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!discountValue || parseFloat(discountValue) <= 0}
                className="flex-1 py-2.5 bg-[#4A7BA7] text-white rounded-xl text-sm font-semibold hover:bg-[#386184] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Apply Discount
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { order: initialOrder } = location.state || {};

  const [order, setOrder]           = useState(initialOrder);
  const [activeTab, setActiveTab]   = useState('Split');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Cash');
  const [customerInfo, setCustomerInfo] = useState('');
  const [paymentAmounts, setPaymentAmounts] = useState({ amount: '', tenderAmount: '', changeAmount: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddItems, setShowAddItems] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [discount, setDiscount] = useState({ type: 'percentage', value: 0, reason: '', amount: 0 });

  if (!order) {
    navigate('/pos');
    return null;
  }

  const orderItems = (order?.items || []).map((item, index) => {
    let itemName, quantity, price;
    if (typeof item === 'string') {
      const parts = item.split(' ×');
      itemName = parts[0];
      quantity = parseInt(parts[1]) || 1;
      price = 0;
    } else {
      itemName = item.name;
      quantity = item.quantity || 1;
      price = item.price || 0;
    }
    return { id: index + 1, name: itemName, quantity, price };
  });

  const subtotal    = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmt = discount.amount || 0;
  const totalDue    = subtotal - discountAmt;

  const handleItemsAdded = async () => {
    try {
      const res = await orderAPI.getOrderById(order.id);
      const raw = res.data;
      setOrder(raw?.order || raw);
      toast.success('Order updated!', { duration: 1500, position: 'top-center' });
    } catch {
      toast('Please refresh to see updated items', { icon: 'ℹ️' });
    }
  };

  const handlePrintEstimate = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Estimate Invoice - ${order.table}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; font-size: 28px; }
            .order-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #f5f5f5; padding: 20px; border-radius: 8px; }
            .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
            .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            .items-table th { background: #333; color: white; padding: 12px; text-align: left; }
            .items-table td { padding: 12px; border-bottom: 1px solid #ddd; }
            .totals { margin-top: 30px; float: right; width: 300px; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .discount-row { color: #4A7BA7; font-weight: 600; }
            .total-due { font-size: 24px; font-weight: bold; border-top: 2px solid #333; margin-top: 10px; padding-top: 10px; }
            .footer { clear: both; text-align: center; margin-top: 60px; padding-top: 20px; border-top: 2px solid #333; }
            @media print { body { margin: 0; padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header"><h1>ESTIMATE INVOICE</h1></div>
          <div class="order-info">
            <div>
              <div class="info-row"><strong>Date:</strong><span>${new Date().toLocaleDateString()}</span></div>
              <div class="info-row"><strong>Time:</strong><span>${new Date().toLocaleTimeString()}</span></div>
              <div class="info-row"><strong>Order ID:</strong><span>${order.kot}</span></div>
            </div>
            <div>
              <div class="info-row"><strong>Table:</strong><span>${order.table}</span></div>
              <div class="info-row"><strong>Type:</strong><span>${order.type}</span></div>
            </div>
          </div>
          <table class="items-table">
            <thead>
              <tr><th>S.N.</th><th>Item</th><th>Qty</th><th>Rate</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${orderItems.map((item, i) => `
                <tr>
                  <td>${i + 1}</td><td>${item.name}</td><td>${item.quantity}</td>
                  <td>Rs ${item.price}</td><td>Rs ${item.price * item.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="totals">
            <div class="totals-row"><span>Subtotal:</span><span>Rs ${subtotal.toFixed(2)}</span></div>
            ${discountAmt > 0 ? `
            <div class="totals-row discount-row">
              <span>Discount${discount.type === 'percentage' ? ` (${discount.value}%)` : ' (Flat)'}${discount.reason ? ` – ${discount.reason}` : ''}:</span>
              <span>– Rs ${discountAmt.toFixed(2)}</span>
            </div>` : ''}
            <div class="totals-row total-due"><span>Total Due:</span><span>Rs ${totalDue.toFixed(2)}</span></div>
          </div>
          <div class="footer"><p><strong>Thank You!!!</strong></p></div>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
    toast.success('Preparing invoice for print...');
  };

  const handleConfirmPay = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await orderAPI.updateOrderStatus(order.id, { status: 'Served' });
      const tableId = extractTableId(order.table);
      if (tableId) {
        try { await tableAPI.endDining(tableId); }
        catch { toast(`Order paid but table #${tableId} may need manual reset`, { icon: '⚠️' }); }
      } else {
        toast(`Order paid — please manually free the table`, { icon: '⚠️' });
      }
      toast.success('Payment confirmed! Table is now free.', { duration: 3000, icon: '✅' });
      setTimeout(() => navigate('/pos', { state: { servedOrderId: order.id } }), 1500);
    } catch {
      toast.error('Failed to confirm payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Checkout — {order.table}</span>
          </motion.button>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDiscount(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all border ${
                discountAmt > 0
                  ? 'bg-[#4A7BA7]/10 border-[#4A7BA7]/30 text-[#4A7BA7] hover:bg-[#4A7BA7]/20'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Tag className="w-4 h-4" />
              {discountAmt > 0
                ? `Discount (${discount.type === 'percentage' ? `${discount.value}%` : `Rs ${discountAmt.toFixed(0)}`})`
                : 'Add Discount'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddItems(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#4A7BA7] text-white rounded-lg hover:bg-[#386184] transition-colors font-medium text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Items</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrintEstimate}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Estimate</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2 bg-[#4A7BA7] text-white rounded-lg hover:bg-[#386184] transition-colors font-medium text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {discountAmt > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#4A7BA7]/10 border-b border-[#4A7BA7]/20 px-6 py-2.5"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#4A7BA7] text-sm">
                <Tag className="w-4 h-4" />
                <span className="font-medium">
                  Discount applied:&nbsp;
                  {discount.type === 'percentage'
                    ? `${discount.value}% off`
                    : `Rs ${discountAmt.toFixed(2)} flat`}
                  {discount.reason ? ` — ${discount.reason}` : ''}
                </span>
                <span className="font-bold text-[#4A7BA7]">
                  (– Rs {discountAmt.toFixed(2)})
                </span>
              </div>
              <button
                onClick={() => setDiscount({ type: 'percentage', value: 0, reason: '', amount: 0 })}
                className="text-[#4A7BA7] hover:text-[#386184] transition-colors p-1 rounded-lg hover:bg-[#4A7BA7]/20"
                title="Remove discount"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <OrderItemsSection
              orderItems={orderItems}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onAddItems={() => setShowAddItems(true)}
            />
            <CustomerAndPayment
              customerInfo={customerInfo}
              setCustomerInfo={setCustomerInfo}
              selectedPaymentMethod={selectedPaymentMethod}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
              paymentAmounts={paymentAmounts}
              setPaymentAmounts={setPaymentAmounts}
            />
          </div>

          <div className="lg:col-span-1">
            <EstimateInvoice
              order={order}
              orderItems={orderItems}
              subtotal={subtotal}
              discount={discountAmt}
              discountMeta={discount}
              totalDue={totalDue}
              onConfirmPay={handleConfirmPay}
              isProcessing={isProcessing}
              onAddDiscount={() => setShowDiscount(true)}
            />
          </div>
        </div>
      </div>

      <DiscountModal
        isOpen={showDiscount}
        onClose={() => setShowDiscount(false)}
        subtotal={subtotal}
        currentDiscount={discount}
        onApply={setDiscount}
      />

      <AddItemsModal
        isOpen={showAddItems}
        onClose={() => setShowAddItems(false)}
        order={order}
        onItemsAdded={handleItemsAdded}
      />
    </div>
  );
};

export default CheckoutPage;