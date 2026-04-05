import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Printer, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderAPI, tableAPI } from '../../../../../services/api';

import OrderItemsSection from './OrderItemsSection';
import CustomerAndPayment from './CustomerAndPayment';
import EstimateInvoice from './EstimateInvoice';

const extractTableId = (tableField) => {
  if (!tableField) return null;
  const str = String(tableField).trim();

  const hashMatch = str.match(/#(\d+)/);
  if (hashMatch) return hashMatch[1];

  if (/^\d+$/.test(str)) return str;

  return null;
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { order } = location.state || {};

  const [activeTab, setActiveTab] = useState('Split');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Cash');
  const [customerInfo, setCustomerInfo] = useState('');
  const [paymentAmounts, setPaymentAmounts] = useState({
    amount: '',
    tenderAmount: '',
    changeAmount: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

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

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0;
  const totalDue = subtotal - discount;

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
            <div class="totals-row"><span>Discount:</span><span>Rs ${discount.toFixed(2)}</span></div>
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
        try {
          await tableAPI.endDining(tableId);
        } catch (tableErr) {
          console.warn(`Could not free table ${tableId}:`, tableErr.message);
          toast(`Order paid but table #${tableId} may need manual reset`, { icon: '⚠️' });
        }
      } else {
        console.warn('Could not parse table ID from:', order.table);
        toast(`Order paid — please manually free the table`, { icon: '⚠️' });
      }

      toast.success('Payment confirmed! Table is now free.', { duration: 3000, icon: '✅' });
      setTimeout(() => navigate('/pos', { state: { servedOrderId: order.id } }), 1500);
    } catch (error) {
      console.error('Payment confirmation error:', error);
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
              onClick={handlePrintEstimate}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span className="font-medium">Print Estimate</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-2 bg-[#4A7BA7] text-white rounded-lg hover:bg-[#3d6a92] transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <OrderItemsSection
              orderItems={orderItems}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
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
              discount={discount}
              totalDue={totalDue}
              onConfirmPay={handleConfirmPay}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;