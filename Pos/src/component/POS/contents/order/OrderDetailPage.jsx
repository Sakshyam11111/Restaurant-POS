import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { orderAPI } from '../../../../services/api';
import toast from 'react-hot-toast';
import menuItemsData from '../menu/data/Menudata.json';

import OrderDetailHeader from './orderdetail/OrderDetailHeader';
import OrderSummarySidebar from './orderdetail/OrderSummarySidebar';
import DishCard from './orderdetail/DishCard';
import OrderItemModal from './orderdetail/OrderItemModal';
import { Clock } from 'lucide-react';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('Dishes');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemStatuses, setItemStatuses] = useState({});

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        setLoading(true);

        if (location.state?.order) {
          setOrder(location.state.order);
          setLoading(false);
          return;
        }

        if (id) {
          const response = await orderAPI.getOrderById(id);
          setOrder(response.data.order);
        }
      } catch (error) {
        console.error('Error loading order:', error);
        toast.error('Failed to load order details');
        navigate('/pos');
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [id, location.state, navigate]);

  const getMenuItemDetails = (itemName) => {
    if (!itemName) return null;
    const normalized = itemName.toLowerCase().trim();

    let menuItem = menuItemsData.menuItems.find(
      (item) => item.name.toLowerCase() === normalized
    );

    if (!menuItem) {
      menuItem = menuItemsData.menuItems.find(
        (item) =>
          normalized.includes(item.name.toLowerCase()) ||
          item.name.toLowerCase().includes(normalized)
      );
    }

    if (!menuItem) {
      return {
        name: itemName,
        description: `Delicious ${itemName}`,
        price: 0,
        image: menuItemsData.defaultImage || '/images/default-dish.jpg',
        category: 'Special',
        tags: [],
      };
    }

    return menuItem;
  };

  const orderItems = order?.items?.map((item, index) => {
    let itemName = '';
    let quantity = 1;
    let orderPrice = 0;
    let note = '';

    if (typeof item === 'string') {
      const parts = item.split(' ×');
      itemName = parts[0]?.trim() || '';
      quantity = parseInt(parts[1]) || 1;
    } else if (item && typeof item === 'object') {
      itemName = item.name || '';
      quantity = item.quantity || 1;
      orderPrice = item.price || 0;
      note = item.note || '';
    }

    return {
      id: index + 1,
      name: itemName,
      note,
      qty: quantity,
      priceFromOrder: orderPrice,
    };
  }) || [];

  const menuItems = orderItems.map((item) => {
    const menuDetails = getMenuItemDetails(item.name);
    let finalPrice = 0;

    if (menuDetails?.price && menuDetails.price > 0) {
      finalPrice = menuDetails.price;
    } else if (item.priceFromOrder > 0) {
      finalPrice = item.priceFromOrder;
    }

    const itemStatus = itemStatuses[item.id] || order?.status || 'Pending';

    return {
      id: item.id,
      name: item.name,
      description: menuDetails?.description || `Delicious ${item.name}`,
      price: finalPrice,
      image: menuDetails?.image || menuItemsData.defaultImage,
      category: menuDetails?.category || 'Uncategorized',
      status: itemStatus,
      note: item.note,
      tags: menuDetails?.tags || [],
      qty: item.qty,
      priceFromOrder: item.priceFromOrder,
    };
  });

  const total = menuItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = menuItems.reduce((sum, item) => sum + item.qty, 0);

  const openItemModal = (item) => setSelectedItem(item);
  const closeItemModal = () => setSelectedItem(null);

  const handleItemStatusChange = (itemId, newStatus) => {
    setItemStatuses(prev => ({
      ...prev,
      [itemId]: newStatus
    }));
    
    toast.success(`Item status changed to ${newStatus}`, {
      duration: 2000,
      position: 'top-center',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#487AA4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/pos')}
            className="px-6 py-2 bg-[#4A7BA7] text-white rounded-lg hover:bg-[#3d6a92] transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OrderDetailHeader
        order={order}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navigate={navigate}
      />

      <div className="flex">
        <div className="flex-1 p-6 bg-gray-50">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-gray-900">{order.type}</h1>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold text-gray-900">{order.table}</span>
                <span
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    order.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : order.status === 'Preparing'
                      ? 'bg-blue-100 text-blue-700'
                      : order.status === 'Ready'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'Served'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-5 h-5" />
              <span className="text-sm">{order.time}</span>
            </div>
          </div>

          {activeTab === 'Dishes' && (
            <div className="grid grid-cols-3 gap-6">
              {menuItems.map((item, index) => (
                <DishCard
                  key={item.id}
                  item={item}
                  index={index}
                  onClick={() => openItemModal(item)}
                />
              ))}
            </div>
          )}

          {activeTab === 'KOT' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">KOT Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">KOT Number:</span>
                  <span className="font-medium text-gray-900">{order.kot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Waiter:</span>
                  <span className="font-medium text-gray-900">{order.waiter || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium ${
                      order.status === 'Pending'
                        ? 'text-yellow-600'
                        : order.status === 'Preparing'
                        ? 'text-blue-600'
                        : order.status === 'Ready'
                        ? 'text-green-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Activity' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Created</p>
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                </div>
                {order.status !== 'Pending' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Status Updated</p>
                      <p className="text-xs text-gray-500">Current: {order.status}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <OrderSummarySidebar
          order={order}
          menuItems={menuItems}
          total={total}
          itemCount={itemCount}
          navigate={navigate}
        />
      </div>

      <OrderItemModal
        item={selectedItem}
        onClose={closeItemModal}
        onStatusChange={handleItemStatusChange}
      />
    </div>
  );
};

export default OrderDetailPage;