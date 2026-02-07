import React from 'react';
import { motion } from 'framer-motion';
import { Home, CheckCircle, ShoppingBag, Clock, DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

const HomeContent = () => {
  const statsCards = [
    {
      title: 'Total Sales',
      value: '1,245',
      change: '+5% from last month',
      isPositive: true,
      icon: Home,
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Completed Orders',
      value: '1,200',
      change: '+3% from last month',
      isPositive: true,
      icon: CheckCircle,
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Total Expenses',
      value: 'Rs. 2.4M',
      change: '-2% from last month',
      isPositive: false,
      icon: ShoppingBag,
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Pending Orders',
      value: '24',
      change: '+15% from last month',
      isPositive: true,
      icon: Clock,
      bgColor: 'bg-violet-50'
    },
    {
      title: 'Total Income',
      value: 'Rs. 4.5M',
      change: '+12% from last month',
      isPositive: true,
      icon: DollarSign,
      bgColor: 'bg-teal-50'
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
    { name: 'Dine-In', value: 40, color: '#4682B4' },
    { name: 'Takeaway', value: 15, color: '#8B5CF6' },
    { name: 'Delivery', value: 25, color: '#10B981' },
    { name: 'Reservation', value: 20, color: '#F59E0B' }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md hover:border-slate-300/60 transition-all duration-300 cursor-pointer overflow-hidden"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                whileHover={{ y: -2 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-slate-700" strokeWidth={2} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${stat.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {stat.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      <span>{stat.change.split(' ')[0]}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">{stat.value}</h3>
                  <p className="text-xs text-slate-400 mt-2">{stat.change.split(' ').slice(1).join(' ')}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Revenue Chart */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-2xl p-7 shadow-sm border border-slate-200/60"
            variants={chartVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Monthly Revenue</h2>
                <p className="text-sm text-slate-500 mt-1">Revenue trends across the year</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">+23% YoY</span>
              </div>
            </div>
            <div className="h-72 flex items-end justify-between gap-3">
              {monthlyRevenue.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="w-full flex items-end justify-center relative" style={{ height: '240px' }}>
                    <motion.div
                      className={`w-full rounded-t-lg relative overflow-hidden ${
                        data.month === 'Jul' ? 'bg-gradient-to-t from-[#4682B4] to-[#5a9fd4]' : 'bg-gradient-to-t from-slate-200 to-slate-100'
                      }`}
                      style={{ height: `${(data.value / maxValue) * 100}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.value / maxValue) * 100}%` }}
                      transition={{ duration: 1.2, delay: index * 0.08, ease: "easeOut" }}
                      whileHover={{ 
                        backgroundColor: data.month === 'Jul' ? '#4682B4' : '#cbd5e1',
                        transition: { duration: 0.2 }
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.value}K
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-500 group-hover:text-slate-900 transition-colors">{data.month}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sales by Category */}
          <motion.div
            className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200/60"
            variants={chartVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900">Sales by Category</h2>
              <p className="text-sm text-slate-500 mt-1">Order distribution</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-52 h-52 mb-8">
                <svg viewBox="0 0 200 200" className="transform -rotate-90 w-full h-full drop-shadow-sm">
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
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs font-medium text-slate-500 mb-1">Top Category</div>
                    <div className="text-lg font-semibold text-[#4682B4]">Dine-In</div>
                    <div className="text-sm text-slate-600 mt-0.5">40%</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center gap-2.5 group cursor-pointer">
                    <div
                      className="w-3 h-3 rounded-full ring-2 ring-offset-2 ring-transparent group-hover:ring-slate-200 transition-all"
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{category.name}</span>
                      <span className="text-xs text-slate-500">{category.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Items */}
          <motion.div
            className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200/60"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Top Selling Items</h2>
                <p className="text-sm text-slate-500 mt-1">Best performers this month</p>
              </div>
              <button className="group flex items-center gap-1.5 text-sm font-medium text-[#4682B4] hover:text-[#3a6a94] transition-colors">
                View All
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
            <div className="overflow-x-auto -mx-7 px-7">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider pb-4">Items</th>
                    <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider pb-4">Category</th>
                    <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider pb-4">Price</th>
                    <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider pb-4">Qty</th>
                    <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider pb-4">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellingItems.map((item, index) => (
                    <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#4682B4] opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="text-sm font-medium text-slate-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-slate-600">{item.category}</span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-sm font-medium text-slate-900">₹{item.price}</span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-sm font-medium text-slate-900">{item.qty}</span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-sm font-semibold text-[#4682B4]">
                          ₹{item.revenue.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200/60"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Recent Transactions</h2>
                <p className="text-sm text-slate-500 mt-1">Latest payment activity</p>
              </div>
              <button className="group flex items-center gap-1.5 text-sm font-medium text-[#4682B4] hover:text-[#3a6a94] transition-colors">
                View Log
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={index}
                  className="group flex items-center justify-between p-4 rounded-xl hover:bg-slate-50/50 transition-all cursor-pointer border border-transparent hover:border-slate-200/60"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        transaction.status === 'success' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {transaction.status === 'success' ? (
                        <CheckCircle className="w-5 h-5" strokeWidth={2.5} />
                      ) : (
                        <span className="text-xl font-bold">×</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-[#4682B4] transition-colors">
                        {transaction.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-600">{transaction.orderId}</span>
                        <span className="mx-1.5">•</span>
                        {transaction.payment}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      NPR {transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{transaction.time}</p>
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