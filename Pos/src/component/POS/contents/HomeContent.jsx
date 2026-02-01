import React from 'react';
import { motion } from 'framer-motion';
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                    <p className={`text-xs sm:text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <motion.div
            className="lg:col-span-2 bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100"
            variants={chartVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Revenue</h2>
            <div className="h-64 sm:h-72 flex items-end justify-between gap-1.5 sm:gap-2">
              {monthlyRevenue.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2">
                  <div className="w-full flex items-end justify-center" style={{ height: '220px' }}>
                    <motion.div
                      className={`w-full rounded-t ${
                        data.month === 'Jul' ? 'bg-[#4682B4]' : 'bg-blue-200'
                      }`}
                      style={{ height: `${(data.value / maxValue) * 100}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.value / maxValue) * 100}%` }}
                      transition={{ duration: 1.2, delay: index * 0.08, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{data.month}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100"
            variants={chartVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Sales by Category</h2>
            <div className="flex flex-col items-center">
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 mb-6">
                <svg viewBox="0 0 200 200" className="transform -rotate-90 w-full h-full">
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
                      <motion.path
                        key={index}
                        d={`M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`}
                        fill={category.color}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Top</div>
                    <div className="text-base sm:text-lg font-bold text-red-500">Dine In</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Top Selling Items</h2>
              <button className="text-sm text-[#4682B4] hover:text-blue-700">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
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
                    <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
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
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <button className="text-sm text-[#4682B4] hover:text-blue-700">View Log</button>
            </div>
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                >
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
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;