import React from 'react';

const OrderItemsSection = ({ orderItems, activeTab, setActiveTab }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex gap-4">
          {['Split', 'Complimentary'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-50 text-[#4A7BA7] border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}

          <button className="ml-auto px-6 py-2 bg-[#4A7BA7] text-white rounded-lg hover:bg-[#3d6a92] transition-colors font-medium flex items-center gap-2">
            <span className="text-lg">+</span>
            Add Item
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">S.N.</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Item</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Qty</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Rate</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Discount</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Item Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orderItems.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-center">{item.quantity}</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">Rs {item.price}</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">Rs 0.00</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                  Rs {item.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderItemsSection;