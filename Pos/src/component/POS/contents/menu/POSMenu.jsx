import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  Search,
  List,
} from 'lucide-react';

import Menudata from '../menu/data/Menudata.json';
import Sidebar from './Sidebar';

const POSMenu = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMasterOpen, setIsMasterOpen] = useState(true);

  const [menuData, setMenuData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Menu');
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderType, setOrderType] = useState('Dine in');
  const [selectedWaiter, setSelectedWaiter] = useState('Ram Shahi');
  const [selectedTable, setSelectedTable] = useState('F1');
  const [orderItems, setOrderItems] = useState([]);
  const [orderNumber, setOrderNumber] = useState('PR3004');

  useEffect(() => {
    setMenuData(Menudata);
  }, []);

  const handleMenuClick = (id) => {
    if (id === 'master') {
      setIsMasterOpen((prev) => !prev);
      return;
    }

    if (id === 'logout') {
      toast.success('Logged out successfully', { duration: 3000, position: 'top-center' });
      setTimeout(() => navigate('/', { replace: true }), 800);
      return;
    }

    const routes = {
      'home': '/pos',
      'pos': '/pos',
      'reports': '/pos',
      'settings': '/pos',
      'unit-master': '/pos',
      'unit-measure': '/pos',
      'zone': '/pos',
      'table': '/pos',
      'menu-items': '/pos',
      'employee': '/pos',
      'department': '/pos',
      'designation': '/pos',
      'employeeshifts': '/pos',
      'employeeshiftsrotation': '/pos',
      'printtype': '/pos',
      'printsetting': '/pos',
    };

    if (routes[id]) {
      navigate(routes[id]);
    }
  };

  const handleAddItem = (item) => {
    const existing = orderItems.find((o) => o.id === item.id);
    if (existing) {
      setOrderItems(
        orderItems.map((o) =>
          o.id === item.id ? { ...o, quantity: o.quantity + 1 } : o
        )
      );
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
  };

  const handleClearAll = () => setOrderItems([]);

  const getFilteredItems = () => {
    if (!menuData) return [];

    let filtered = menuData.menuItems;

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All Menu') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (selectedSubCategory) {
      filtered = filtered.filter((item) => item.category === selectedSubCategory);
    }

    return filtered;
  };

  if (!menuData) {
    return <div className="flex items-center justify-center h-screen">Loading menu...</div>;
  }

  const filteredItems = getFilteredItems();

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Toaster />

      <Sidebar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isMasterOpen={isMasterOpen}
        setIsMasterOpen={setIsMasterOpen}
        handleMenuClick={handleMenuClick}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 overflow-x-auto">
          <div className="flex gap-2 flex-wrap">
            {menuData.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setSelectedSubCategory(null);
                }}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors text-sm ${
                  selectedCategory === cat.name
                    ? 'bg-[#386890] text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="p-6 border-b border-gray-200">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search for Items"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#386890]"
                  />
                </div>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100">
                  <List size={24} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleAddItem(item)}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                      ) : (
                        <span className="text-5xl">🍽️</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 text-base">{item.name}</h3>
                      <p className="text-base font-bold text-gray-900">
                        {item.currency} {item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <span className="text-lg font-semibold text-[#386890]">{orderNumber}</span>
              </div>

              <div className="flex gap-2 mb-6">
                {['Dine in', 'Takeaway', 'Delivery'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`flex-1 py-2.5 px-3 rounded-lg font-medium transition-colors text-sm ${
                      orderType === type
                        ? 'bg-blue-50 text-[#386890] border border-blue-200'
                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Waiter</span>
                  <select
                    value={selectedWaiter}
                    onChange={(e) => setSelectedWaiter(e.target.value)}
                    className="text-[#386890] font-medium text-sm border-0 focus:ring-0 cursor-pointer bg-transparent"
                  >
                    {menuData.waiters.map((waiter) => (
                      <option key={waiter.id} value={waiter.name}>
                        {waiter.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Table</span>
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    className="text-[#386890] font-medium text-sm border-0 focus:ring-0 cursor-pointer bg-transparent"
                  >
                    {menuData.tables.map((table) => (
                      <option key={table.id} value={table.id}>
                        {table.id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-base">Order Items</h3>
                {orderItems.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-sm text-[#386890] hover:text-blue-700 font-medium"
                  >
                    Clear All Items
                  </button>
                )}
              </div>

              {orderItems.length === 0 ? (
                <div className="text-center text-gray-400 mt-12">
                  <p className="text-sm">No items added yet</p>
                  <p className="text-xs mt-1">Click on menu items to add</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.currency} {item.price} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900 whitespace-nowrap ml-3 text-sm">
                        {item.currency} {item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {orderItems.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-semibold text-gray-700">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    Rs. {orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                  </span>
                </div>
                <button className="w-full py-3.5 bg-[#386890] text-white rounded-lg font-semibold">
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSMenu;