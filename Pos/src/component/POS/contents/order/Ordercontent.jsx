import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { orderAPI } from '../../../../services/api';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ChefHat,
  Eye,
  Trash2
} from 'lucide-react';

const OrderContent = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const statusOptions = ['All', 'Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'];

  useEffect(() => {
    loadOrders();
  }, [selectedDate, selectedStatus]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (selectedDate) {
        params.date = selectedDate;
      }
      
      if (selectedStatus !== 'All') {
        params.status = selectedStatus;
      }

      const response = await orderAPI.getOrders(params);
      console.log('Orders loaded:', response);
      
      setOrders(response.data?.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      loadOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await orderAPI.deleteOrder(orderId);
      toast.success('Order deleted successfully');
      loadOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  const handleViewDetails = (order) => {
    navigate(`/order/${order.id}`, { 
      state: { order } 
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Preparing': 'bg-blue-100 text-blue-800 border-blue-300',
      'Ready': 'bg-green-100 text-green-800 border-green-300',
      'Served': 'bg-gray-100 text-gray-800 border-gray-300',
      'Cancelled': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': <Clock className="w-4 h-4" />,
      'Preparing': <ChefHat className="w-4 h-4" />,
      'Ready': <AlertCircle className="w-4 h-4" />,
      'Served': <CheckCircle className="w-4 h-4" />,
      'Cancelled': <XCircle className="w-4 h-4" />
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  const getOrderTypeColor = (type) => {
    const colors = {
      'Dine In': 'bg-purple-100 text-purple-700',
      'Take Away': 'bg-orange-100 text-orange-700',
      'Delivery': 'bg-cyan-100 text-cyan-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#487AA4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#487AA4] focus:border-[#487AA4] outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <div className="flex gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? 'bg-[#487AA4] text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={loadOrders}
          className="ml-auto px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
          <p className="text-gray-600">
            {selectedStatus === 'All' 
              ? 'No orders for the selected date.' 
              : `No ${selectedStatus.toLowerCase()} orders found.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewDetails(order)}
            >
              <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{order.kot}</h3>
                    <p className="text-sm text-gray-500">{order.table}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getOrderTypeColor(order.type)}`}>
                    {order.type}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{order.time}</span>
                  {order.waiter && (
                    <>
                      <span>•</span>
                      <span>{order.waiter}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-semibold">{order.status}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Total:</span>
                  <span className="text-lg font-bold text-gray-900">
                    Rs. {order.totalPrice || 0}
                  </span>
                </div>

                <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  
                  {order.status !== 'Served' && order.status !== 'Cancelled' && (
                    <div className="flex-1 relative group">
                      <button className="w-full px-3 py-2 bg-[#487AA4] text-white rounded-lg text-sm font-medium hover:bg-[#3d6a92] transition-colors">
                        Update
                      </button>
                      <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        {['Preparing', 'Ready', 'Served'].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(order.id, status)}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderContent;