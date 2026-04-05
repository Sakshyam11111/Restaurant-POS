import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { orderAPI, menuAPI } from '../../../../services/api';
import toast from 'react-hot-toast';
import menuItemsData from '../menu/data/Menudata.json';

import OrderDetailHeader from './orderdetail/OrderDetailHeader';
import OrderSummarySidebar from './orderdetail/OrderSummarySidebar';
import DishCard from './orderdetail/DishCard';
import OrderItemModal from './orderdetail/OrderItemModal';
import { Clock } from 'lucide-react';

// ── Build a price+meta lookup from the menu API response ─────────────────────
const buildMenuLookup = (apiItems) => {
  const map = {};
  apiItems.forEach((m) => {
    const key = (m.name || '').toLowerCase().trim();
    map[key] = {
      price:       m.price       || 0,
      image:       m.image       || '',
      description: m.description || '',
      category:    m.category    || 'Menu',
      tags:        m.tags        || [],
    };
  });
  return map;
};

// Exact then partial name match
const lookupByName = (map, rawName) => {
  if (!rawName) return null;
  const key = rawName.toLowerCase().trim();
  if (map[key]) return map[key];
  const partial = Object.keys(map).find(
    (k) => k.includes(key) || key.includes(k)
  );
  return partial ? map[partial] : null;
};

// Fallback: local Menudata.json (includes price for static menu)
const getLocalMeta = (itemName) => {
  if (!itemName) return null;
  const normalized = itemName.toLowerCase().trim();
  let found = menuItemsData.menuItems.find((m) => m.name.toLowerCase() === normalized);
  if (!found) {
    found = menuItemsData.menuItems.find(
      (m) =>
        normalized.includes(m.name.toLowerCase()) ||
        m.name.toLowerCase().includes(normalized)
    );
  }
  if (!found) return null;
  return {
    price:       found.price       || 0,
    image:       found.image       || '',
    description: found.description || '',
    category:    found.category    || 'Special',
    tags:        found.tags        || [],
  };
};

// ─────────────────────────────────────────────────────────────────────────────

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab]       = useState('Dishes');
  const [order, setOrder]               = useState(null);
  const [menuLookup, setMenuLookup]     = useState({});
  const [loading, setLoading]           = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemStatuses, setItemStatuses] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // Fetch order and menu in parallel
        const [orderResult, menuResult] = await Promise.allSettled([
          location.state?.order
            ? Promise.resolve({ data: { order: location.state.order } })
            : orderAPI.getOrderById(id),
          menuAPI.getMenuItems(),
        ]);

        if (orderResult.status === 'fulfilled') {
          const raw = orderResult.value.data;
          setOrder(raw?.order || raw);
        } else {
          throw new Error('Order not found');
        }

        if (menuResult.status === 'fulfilled') {
          const items = menuResult.value.data?.items || [];
          setMenuLookup(buildMenuLookup(items));
        }
        // if menu API fails, menuLookup stays {} → falls back to local JSON
      } catch (error) {
        console.error('Error loading order details:', error);
        toast.error('Failed to load order details');
        navigate('/pos');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, location.state, navigate]);

  // ── Parse raw order.items → unified objects ──────────────────────────────
  // Price priority:
  //   1. item.price from API object format   (most accurate — stored at order time)
  //   2. menu API lookup by name             (for string-format "Name ×qty" items)
  //   3. local Menudata.json lookup          (offline / static fallback)
  //   4. 0
  const menuItems = (order?.items || []).map((item, index) => {
    let name, qty, apiPrice, note;

    if (typeof item === 'string') {
      const parts = item.split(' ×');
      name     = parts[0]?.trim() || '';
      qty      = parseInt(parts[1]) || 1;
      apiPrice = 0;
      note     = '';
    } else {
      name     = (item.name    || '').trim();
      qty      = item.quantity || 1;
      apiPrice = item.price    || 0;
      note     = item.note     || '';
    }

    const fromAPI   = lookupByName(menuLookup, name);
    const fromLocal = getLocalMeta(name);

    const price =
      apiPrice > 0          ? apiPrice         :
      fromAPI?.price  > 0   ? fromAPI.price    :
      fromLocal?.price > 0  ? fromLocal.price  :
      0;

    const image       = fromAPI?.image       || fromLocal?.image       || '';
    const description = fromAPI?.description || fromLocal?.description || `Delicious ${name}`;
    const category    = fromAPI?.category    || fromLocal?.category    || 'Uncategorized';
    const tags        = fromAPI?.tags        || fromLocal?.tags        || [];
    const status      = itemStatuses[index + 1] || order?.status || 'Pending';

    return { id: index + 1, name, qty, price, note, status, image, description, category, tags };
  });

  const total     = menuItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = menuItems.reduce((sum, item) => sum + item.qty, 0);

  const openItemModal  = (item) => setSelectedItem(item);
  const closeItemModal = () => setSelectedItem(null);

  const handleItemStatusChange = (itemId, newStatus) => {
    setItemStatuses((prev) => ({ ...prev, [itemId]: newStatus }));
    toast.success(`Item status changed to ${newStatus}`, { duration: 2000, position: 'top-center' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#487AA4] mx-auto" />
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
                    order.status === 'Pending'   ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'Preparing' ? 'bg-blue-100   text-blue-700'   :
                    order.status === 'Ready'     ? 'bg-green-100  text-green-700'  :
                    order.status === 'Served'    ? 'bg-gray-100   text-gray-700'   :
                                                   'bg-red-100    text-red-700'
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
                  <span className={`font-medium ${
                    order.status === 'Pending'   ? 'text-yellow-600' :
                    order.status === 'Preparing' ? 'text-blue-600'   :
                    order.status === 'Ready'     ? 'text-green-600'  : 'text-gray-600'
                  }`}>{order.status}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Activity' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Created</p>
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                </div>
                {order.status !== 'Pending' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
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