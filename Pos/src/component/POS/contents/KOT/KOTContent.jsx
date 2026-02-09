import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { orderAPI } from '../../../../services/api';
import { useOrders } from '../../contents/OrderContext';
import { Printer, CheckCircle, XCircle, Clock, RefreshCw, Bell } from 'lucide-react';

const KOTContent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { shouldRefreshKOT, resetRefreshFlags, newOrderNotification } = useOrders();

  useEffect(() => {
    loadOrders();
    const interval = setInterval(() => loadOrders(true), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (shouldRefreshKOT) {
      loadOrders(true);
      resetRefreshFlags();
      toast.success('New order received!', {
        icon: '🔔',
        duration: 3000,
        position: 'top-right',
      });
    }
  }, [shouldRefreshKOT, resetRefreshFlags]);

  const loadOrders = async (isAutoRefresh = false) => {
    try {
      if (!isAutoRefresh) setLoading(true);
      else setRefreshing(true);

      const response = await orderAPI.getOrders({});
      const activeOrders = (response.data?.orders || []).filter((order) =>
        ['Pending', 'Preparing', 'Ready'].includes(order.status)
      );
      setOrders(activeOrders);
    } catch (error) {
      console.error('Error loading KOT orders:', error);
      if (!isAutoRefresh) toast.error('Failed to load KOT orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCompleted = async (orderId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Ready' ? 'Served' : 'Ready';
      await orderAPI.updateOrderStatus(orderId, { status: newStatus });

      toast.success(
        newStatus === 'Served' ? 'Order marked as served!' : 'Order marked as ready!',
        { duration: 2000 }
      );

      if (newStatus === 'Served') {
        setOrders(orders.filter((order) => order.id !== orderId));
      } else {
        loadOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleCancel = (orderId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 p-1">
          <div className="font-medium text-gray-800">
            Are you sure you want to cancel this order?
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition"
            >
              No
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await orderAPI.updateOrderStatus(orderId, { status: 'Cancelled' });
                  toast.success('Order cancelled successfully');
                  setOrders(orders.filter((order) => order.id !== orderId));
                } catch (error) {
                  console.error('Error cancelling order:', error);
                  toast.error('Failed to cancel order');
                }
              }}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: 'top-center',
        style: {
          border: '1px solid #f87171',
          padding: '16px',
          background: '#fff',
          borderRadius: '8px',
          maxWidth: '380px',
        },
      }
    );
  };

  const handlePrint = (order) => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>KOT - ${order.kot}</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 20px; max-width: 300px; }
            h1 { text-align: center; font-size: 24px; margin-bottom: 10px; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .header { border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
            .info { margin: 5px 0; font-size: 14px; display: flex; justify-content: space-between; }
            .items { margin: 15px 0; border-top: 2px dashed #000; border-bottom: 2px dashed #000; padding: 10px 0; }
            .item { margin: 8px 0; font-size: 16px; font-weight: bold; }
            .footer { text-align: center; margin-top: 15px; font-size: 12px; border-top: 2px solid #000; padding-top: 10px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1>KITCHEN ORDER TICKET</h1>
          <div class="header">
            <div class="info"><strong>KOT:</strong><span>${order.kot}</span></div>
            <div class="info"><strong>Table:</strong><span>${order.table}</span></div>
            <div class="info"><strong>Type:</strong><span>${order.type}</span></div>
            <div class="info"><strong>Waiter:</strong><span>${order.waiter || 'N/A'}</span></div>
            <div class="info"><strong>Time:</strong><span>${new Date().toLocaleTimeString()}</span></div>
          </div>
          <div class="items">
            <h3 style="margin: 0 0 10px 0;">ORDER ITEMS:</h3>
            ${order.items.map((item) => `<div class="item">• ${item}</div>`).join('')}
          </div>
          <div class="footer">
            <p><strong>*** PLEASE PREPARE ***</strong></p>
            <p>${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
    toast.success('KOT sent to printer');
  };

  const getCardStyle = (status) => {
    switch (status) {
      case 'Ready':
        return 'bg-green-50 border-green-300';
      case 'Preparing':
        return 'bg-blue-50 border-blue-300';
      default:
        return 'bg-yellow-50 border-yellow-300';
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: {
        bg: 'bg-yellow-500',
        icon: <Clock className="w-4 h-4" />,
        text: 'Pending',
        pulse: true,
      },
      Preparing: {
        bg: 'bg-blue-500',
        icon: <RefreshCw className="w-4 h-4" />,
        text: 'Preparing',
        pulse: false,
      },
      Ready: {
        bg: 'bg-green-500',
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Ready',
        pulse: false,
      },
    };

    const badge = badges[status];
    if (!badge) return null;

    return (
      <div className="absolute top-4 right-4">
        <span
          className={`${badge.bg} text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm ${
            badge.pulse ? 'animate-pulse' : ''
          }`}
        >
          {badge.icon}
          {badge.text}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#487AA4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading KOT orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Kitchen Order Tickets
            {newOrderNotification && <Bell className="w-6 h-6 text-red-500 animate-bounce" />}
          </h1>
          <p className="text-gray-600 mt-1">
            Active orders: <span className="font-semibold">{orders.length}</span>
          </p>
        </div>

        <button
          onClick={() => loadOrders()}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Orders</h3>
          <p className="text-gray-600">All orders have been completed or there are no pending orders.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-lg border-2 p-6 shadow-sm relative transition-all duration-300 hover:shadow-md ${getCardStyle(
                  order.status
                )}`}
              >
                {getStatusBadge(order.status)}

                <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">{order.kot}</h2>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Table:</span>
                    <span className="text-gray-800 font-medium">{order.table}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="text-gray-800 font-medium">{order.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Waiter:</span>
                    <span className="text-gray-800 font-medium">{order.waiter || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time:</span>
                    <span className="text-gray-800 font-medium">{order.time}</span>
                  </div>

                  <div className="mt-4 pt-4 border-t-2 border-gray-300">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Items:</p>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="text-sm text-gray-800 font-medium bg-white px-2 py-1 rounded"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleCompleted(order.id, order.status)}
                    className={`px-3 py-2 border rounded-md font-medium transition-colors text-sm ${
                      order.status === 'Ready'
                        ? 'bg-green-500 border-green-600 text-white hover:bg-green-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-green-50'
                    }`}
                    title={order.status === 'Ready' ? 'Mark as Served' : 'Mark as Ready'}
                  >
                    <CheckCircle className="w-4 h-4 mx-auto" />
                  </button>

                  <button
                    onClick={() => handleCancel(order.id)}
                    className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors font-medium text-sm"
                    title="Cancel Order"
                  >
                    <XCircle className="w-4 h-4 mx-auto" />
                  </button>

                  <button
                    onClick={() => handlePrint(order)}
                    className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm"
                    title="Print KOT"
                  >
                    <Printer className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default KOTContent;