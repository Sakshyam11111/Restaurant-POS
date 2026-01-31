import React from 'react';
import { Home, CheckCircle, ShoppingBag, Clock, DollarSign } from 'lucide-react';

const HomeContent = () => {
  const statsCards = [
    {
      title: 'Total Sales',
      value: '1,245',
      change: '+5% from last month',
      isPositive: true,
      icon: Home,
      bgColor: 'bg-[#4682B4]'
    },
    {
      title: 'Completed Orders',
      value: '1,200',
      change: '+3% from last month',
      isPositive: true,
      icon: CheckCircle,
      bgColor: 'bg-[#4682B4]'
    },
    {
      title: 'Total Expenses',
      value: 'Rs. 2.4M',
      change: '-2% from last month',
      isPositive: false,
      icon: ShoppingBag,
      bgColor: 'bg-[#4682B4]'
    },
    {
      title: 'Pending Orders',
      value: '24',
      change: '+15% from last month',
      isPositive: true,
      icon: Clock,
      bgColor: 'bg-[#4682B4]'
    },
    {
      title: 'Total Income',
      value: 'Rs. 4.5M',
      change: '+12% from last month',
      isPositive: true,
      icon: DollarSign,
      bgColor: 'bg-[#4682B4]'
    }
  ];

  const monthlyRevenue = [
    { month: 'Jan', value: 35 },
    { month: 'Feb', value: 55 },
    { month: 'Mar', value: 40 },
    { month: 'Apr', value: 50 },
    { month: 'May', value: 60 },
    { month: 'Jun', value: 30 },
    { month: 'Jul', value: 95 },
    { month: 'Aug', value: 52 },
    { month: 'Sep', value: 58 },
    { month: 'Oct', value: 42 },
    { month: 'Nov', value: 70 },
    { month: 'Dec', value: 72 }
  ];

  const maxValue = Math.max(...monthlyRevenue.map(m => m.value));

  const topSellingItems = [
    { name: 'Spicy Chicken Momos', category: 'Appetizer', price: 250, qty: 450, revenue: 112500 },
    { name: 'Classic Burger', category: 'Main Course', price: 450, qty: 320, revenue: 144000 },
    { name: 'Pepperoni Pizza', category: 'Main Course', price: 800, qty: 210, revenue: 168000 },
    { name: 'Mango Lassi', category: 'Beverage', price: 180, qty: 560, revenue: 100800 }
  ];

  const recentTransactions = [
    { name: 'Aarav Shrestha', orderId: 'ORD-209', payment: 'QR Payment', amount: 1250, time: 'Today, 10:40 AM', status: 'success' },
    { name: 'Sita Gurung', orderId: 'ORD-208', payment: 'Cash', amount: 1250, time: 'Today, 10:30 AM', status: 'success' },
    { name: 'Table 4 (Guest)', orderId: 'ORD-208', payment: 'Card', amount: 1100, time: 'Today, 10:45 AM', status: 'failed' }
  ];

  const categoryData = [
    { name: 'Dine-In', value: 40, color: '#EF4444' },
    { name: 'Takeaway', value: 15, color: '#8B4513' },
    { name: 'Delivery', value: 25, color: '#F59E0B' },
    { name: 'Reservation', value: 20, color: '#10B981' }
  ];

  const total = categoryData.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                    <p className={`text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} w-12 h-12 rounded-full flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Monthly Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Revenue</h2>
            <div className="h-64 flex items-end justify-between gap-2">
              {monthlyRevenue.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                    <div
                      className={`w-full rounded-t transition-all ${
                        data.month === 'Jul' ? 'bg-[#4682B4]' : 'bg-blue-200'
                      }`}
                      style={{ height: `${(data.value / maxValue) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sales by Category Donut Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Sales by Category</h2>
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-6">
                <svg viewBox="0 0 200 200" className="transform -rotate-90">
                  {categoryData.map((category, index) => {
                    const percentage = (category.value / total) * 100;
                    const angle = (percentage / 100) * 360;
                    const startAngle = currentAngle;
                    currentAngle += angle;
                    
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (currentAngle * Math.PI) / 180;
                    
                    const innerRadius = 60;
                    const outerRadius = 90;
                    
                    const x1 = 100 + outerRadius * Math.cos(startRad);
                    const y1 = 100 + outerRadius * Math.sin(startRad);
                    const x2 = 100 + outerRadius * Math.cos(endRad);
                    const y2 = 100 + outerRadius * Math.sin(endRad);
                    const x3 = 100 + innerRadius * Math.cos(endRad);
                    const y3 = 100 + innerRadius * Math.sin(endRad);
                    const x4 = 100 + innerRadius * Math.cos(startRad);
                    const y4 = 100 + innerRadius * Math.sin(startRad);
                    
                    const largeArc = angle > 180 ? 1 : 0;
                    
                    return (
                      <path
                        key={index}
                        d={`M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`}
                        fill={category.color}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Top</div>
                    <div className="text-lg font-bold text-red-500">Dine In</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 w-full">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Items */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Top Selling Items</h2>
              <button className="text-sm text-[#4682B4] hover:text-blue-700">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-sm font-medium text-gray-600 pb-3">Items</th>
                    <th className="text-left text-sm font-medium text-gray-600 pb-3">Categories</th>
                    <th className="text-left text-sm font-medium text-gray-600 pb-3">Price</th>
                    <th className="text-left text-sm font-medium text-gray-600 pb-3">Qty</th>
                    <th className="text-left text-sm font-medium text-gray-600 pb-3">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellingItems.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-0">
                      <td className="py-4 text-sm text-gray-900">{item.name}</td>
                      <td className="py-4 text-sm text-gray-600">{item.category}</td>
                      <td className="py-4 text-sm text-gray-900">{item.price}</td>
                      <td className="py-4 text-sm text-gray-900">{item.qty}</td>
                      <td className="py-4 text-sm font-medium text-[#4682B4]">
                        {item.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <button className="text-sm text-[#4682B4] hover:text-blue-700">View Log</button>
            </div>
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                      }`}
                    >
                      {transaction.status === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <span className="text-red-600 text-xl">×</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.name}</p>
                      <p className="text-xs text-gray-500">
                        Order # {transaction.orderId} • {transaction.payment}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      NRP {transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;