import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Printer, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderAPI } from '../../../../../services/api';

import OrderItemsSection from './OrderItemsSection';
import CustomerAndPayment from './CustomerAndPayment';
import EstimateInvoice from './EstimateInvoice';

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
    changeAmount: ''
  });

  if (!order) {
    navigate('/pos');
    return null;
  }

  const orderItems = order?.items?.map((item, index) => {
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

    return {
      id: index + 1,
      name: itemName,
      quantity,
      price
    };
  }) || [];

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
            body { font-family: 'Arial', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; font-size: 28px; color: #333; }
            .order-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #f5f5f5; padding: 20px; border-radius: 8px; }
            .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
            .info-label { font-weight: bold; color: #555; }
            .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            .items-table th { background: #333; color: white; padding: 12px; text-align: left; font-weight: bold; }
            .items-table td { padding: 12px; border-bottom: 1px solid #ddd; }
            .items-table tr:hover { background: #f9f9f9; }
            .totals { margin-top: 30px; float: right; width: 300px; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .total-due { font-size: 24px; font-weight: bold; color: #333; border-top: 2px solid #333; margin-top: 10px; padding-top: 10px; }
            .footer { clear: both; text-align: center; margin-top: 60px; padding-top: 20px; border-top: 2px solid #333; color: #666; }
            @media print { body { margin: 0; padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ESTIMATE INVOICE</h1>
            <p style="margin: 10px 0; color: #666;">Thank you for your visit!</p>
          </div>

          <div class="order-info">
            <div>
              <div class="info-row"><span class="info-label">Date:</span><span>${new Date().toLocaleDateString()}</span></div>
              <div class="info-row"><span class="info-label">Time:</span><span>${new Date().toLocaleTimeString()}</span></div>
              <div class="info-row"><span class="info-label">Order ID:</span><span>${order.kot}</span></div>
            </div>
            <div>
              <div class="info-row"><span class="info-label">Table:</span><span>${order.table}</span></div>
              <div class="info-row"><span class="info-label">Order Type:</span><span>${order.type}</span></div>
              <div class="info-row"><span class="info-label">Location:</span><span>Kathmandu, Nepal</span></div>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>S.N.</th><th>Item</th><th>Qty</th><th>Rate</th><th>Discount</th><th>Item Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItems.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>Rs ${item.price}</td>
                  <td>Rs 0.00</td>
                  <td>Rs ${item.price * item.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row"><span>Subtotal:</span><span>Rs ${subtotal.toFixed(2)}</span></div>
            <div class="totals-row"><span>Discount:</span><span>Rs ${discount.toFixed(2)}</span></div>
            <div class="totals-row total-due"><span>Total Due:</span><span>Rs ${totalDue.toFixed(2)}</span></div>
          </div>

          <div class="footer">
            <p><strong>Thank You !!!</strong></p>
            <p>Thank you for your visit! Visit again!!</p>
            <p style="margin-top: 20px; font-size: 12px;">Printed on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
    
    toast.success('Preparing invoice for print...');
  };

  const handleConfirmPay = async () => {
    try {
      await orderAPI.updateOrderStatus(order.id, { status: 'Served' });
      toast.success('Payment confirmed! Order completed.', { duration: 3000, icon: '✅' });
      setTimeout(() => navigate('/pos'), 1500);
    } catch (error) {
      console.error('Payment confirmation error:', error);
      toast.error('Failed to confirm payment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Checkout - {order.table}</span>
            </motion.button>
          </div>

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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;