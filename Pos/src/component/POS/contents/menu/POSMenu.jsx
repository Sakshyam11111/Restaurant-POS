import React, { useState, useEffect } from 'react';
import { X, Search, Grid, List } from 'lucide-react';
import Menudata from '../menu/data/Menudata.json'

const POSMenu = () => {
  const [menuData, setMenuData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Menu');
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderType, setOrderType] = useState('Dine in');
  const [selectedWaiter, setSelectedWaiter] = useState('Ram Shahi');
  const [selectedTable, setSelectedTable] = useState('T1');
  const [orderItems, setOrderItems] = useState([]);
  const [orderNumber, setOrderNumber] = useState('PR3004');

  useEffect(() => {
    setMenuData(Menudata);
    
  }, []);

  const handleAddItem = (item) => {
    const existingItem = orderItems.find((orderItem) => orderItem.id === item.id);
    if (existingItem) {
      setOrderItems(
        orderItems.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        )
      );
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
  };

  const handleClearAll = () => {
    setOrderItems([]);
  };

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
    return (
      <div className="flex items-center justify-center h-screen">
        Loading menu...
      </div>
    );
  }

  const filteredItems = getFilteredItems();

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col p-6">
        <div className="flex items-center gap-4 mb-6">
          <button className="p-3 bg-[#4682B4] text-white rounded-lg hover:bg-[#4682B4]">
            <Grid size={24} />
          </button>
          <button className="p-3 hover:bg-gray-200 rounded-lg">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </button>
          <button className="p-3 hover:bg-gray-200 rounded-lg">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
          <button className="p-3 hover:bg-gray-200 rounded-lg">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for Items"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4682B4]"
            />
          </div>
          <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100">
            <List size={24} />
          </button>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {menuData.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.name);
                setSelectedSubCategory(null);
              }}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedCategory === category.name
                  ? 'bg-[#4682B4] text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>


        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleAddItem(item)}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                  {item.image ? (
                    <img
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  ) : (
                    <span className="text-4xl">🍽️</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 mb-1 truncate">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-1 line-clamp-2">{item.description}</p>
                  <p className="text-lg font-bold text-gray-900">
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
            <span className="text-lg font-semibold text-[#4682B4]">{orderNumber}</span>
          </div>

          <div className="flex gap-2 mb-4">
            {['Dine in', 'Takeaway', 'Delivery'].map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                  orderType === type
                    ? 'bg-blue-50 text-[#4682B4] border border-blue-200'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="mb-3">
            <label className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span className="font-medium">Waiter</span>
              <select
                value={selectedWaiter}
                onChange={(e) => setSelectedWaiter(e.target.value)}
                className="text-gray-800 font-medium border-0 focus:ring-0 cursor-pointer"
              >
                {menuData.waiters.map((waiter) => (
                  <option key={waiter.id} value={waiter.name}>
                    {waiter.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label className="flex items-center justify-between text-sm text-gray-600">
              <span className="font-medium">Table</span>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="text-gray-800 font-medium border-0 focus:ring-0 cursor-pointer"
              >
                {menuData.tables.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.id}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Order Items</h3>
            {orderItems.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All Items
              </button>
            )}
          </div>

          {orderItems.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              <p>No items added yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orderItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 truncate">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      {item.currency} {item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 whitespace-nowrap ml-3">
                    {item.currency} {item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {orderItems.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-800">Total</span>
              <span className="text-2xl font-bold text-gray-900">
                Rs. {orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
              </span>
            </div>
            <button className="w-full py-3 bg-[#4682B4] text-white rounded-lg font-semibold hover:bg-[#3a6d9a] transition-colors">
              Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default POSMenu;