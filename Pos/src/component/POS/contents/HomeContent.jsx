import React from 'react';
import { motion } from 'framer-motion';
import {
  Home, CheckCircle, ShoppingBag, Clock, DollarSign,
  ArrowUpRight, ArrowDownRight, TrendingUp, RefreshCw, Calendar
} from 'lucide-react';
const DATE_RANGES = [
  { key: 'today',       label: 'Today' },
  { key: 'yesterday',   label: 'Yesterday' },
  { key: 'this_week',   label: 'This Week' },
  { key: 'this_month',  label: 'This Month' },
  { key: 'last_6month', label: 'Last 6 Months' },
  { key: 'last_year',   label: 'Last Year' },
];

const HomeContent = ({
  dashboardData,
  isLoadingDashboard,
  onRefresh,
  dashboardRange = 'today',
  onRangeChange,
}) => {
  const data = dashboardData || {};

  // ── Label shown inside chart ──────────────────────────────────────────────
  const chartLabel = {
    today:       'Hourly Revenue (Today)',
    yesterday:   'Hourly Revenue (Yesterday)',
    this_week:   'Daily Revenue (This Week)',
    this_month:  'Daily Revenue (This Month)',
    last_6month: 'Monthly Revenue (Last 6 Months)',
    last_year:   'Monthly Revenue (Last Year)',
  }[dashboardRange] || 'Revenue';

  const statsCards = [
    {
      title: 'Total Sales',
      value: data.totalSalesToday ?? '—',
      change: '+5% from prev period',
      isPositive: true,
      icon: Home,
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Completed Orders',
      value: data.completedOrders ?? '—',
      change: '+3% from prev period',
      isPositive: true,
      icon: CheckCircle,
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Cancelled Orders',
      value: data.cancelledOrders ?? '—',
      change: '-2% from prev period',
      isPositive: false,
      icon: ShoppingBag,
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Pending Orders',
      value: data.pendingOrders ?? '—',
      change: '+15% from prev period',
      isPositive: true,
      icon: Clock,
      bgColor: 'bg-violet-50',
    },
    {
      title: 'Revenue',
      value: data.todaysRevenue != null
        ? `Rs. ${Number(data.todaysRevenue).toLocaleString()}`
        : 'Rs. —',
      change: '+12% from prev period',
      isPositive: true,
      icon: DollarSign,
      bgColor: 'bg-teal-50',
    },
  ];

  const monthlyRevenue = data.monthlyRevenue || [
    { month: 'Jan', value: 35 }, { month: 'Feb', value: 55 },
    { month: 'Mar', value: 40 }, { month: 'Apr', value: 50 },
    { month: 'May', value: 60 }, { month: 'Jun', value: 30 },
    { month: 'Jul', value: 95 }, { month: 'Aug', value: 52 },
    { month: 'Sep', value: 58 }, { month: 'Oct', value: 42 },
    { month: 'Nov', value: 70 }, { month: 'Dec', value: 72 },
  ];

  const maxValue = Math.max(...monthlyRevenue.map((m) => m.value), 1);
  const topSellingItems    = data.topSellingItems    || [];
  const recentTransactions = data.recentTransactions || [];

  const categoryData = data.categoryData || [
    { name: 'Dine-In',     value: 40, color: '#4682B4' },
    { name: 'Takeaway',    value: 15, color: '#8B5CF6' },
    { name: 'Delivery',    value: 25, color: '#10B981' },
    { name: 'Reservation', value: 20, color: '#F59E0B' },
  ];

  const total = categoryData.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;
  const topCategory = categoryData.reduce(
    (prev, curr) => curr.value > prev.value ? curr : prev,
    categoryData[0] || { name: '—', value: 0 }
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
    }),
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  if (isLoadingDashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#487AA4] mx-auto" />
          <p className="mt-4 text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* ── Date range dropdown ─────────────────────────────────────── */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <select
                value={dashboardRange}
                onChange={(e) => onRangeChange?.(e.target.value)}
                className="text-sm font-medium text-gray-700 bg-transparent border-0 outline-none cursor-pointer pr-1"
              >
                {DATE_RANGES.map((range) => (
                  <option key={range.key} value={range.key}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ── Refresh ─────────────────────────────────────────────────── */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            )}
          </div>
        </div>

        {/* ── Stats Cards ────────────────────────────────────────────────── */}
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
                      {stat.isPositive
                        ? <ArrowUpRight className="w-3.5 h-3.5" />
                        : <ArrowDownRight className="w-3.5 h-3.5" />}
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

        {/* ── Charts Section ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue chart */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-2xl p-7 shadow-sm border border-slate-200/60"
            variants={chartVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{chartLabel}</h2>
                <p className="text-sm text-slate-500 mt-1">Revenue trends for selected period</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">
                  Rs. {Number(data.todaysRevenue || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Bar chart – auto-hides labels for dense datasets */}
            <div className="h-72 flex items-end justify-between gap-1">
              {monthlyRevenue.map((item, index) => {
                const showLabel = monthlyRevenue.length <= 16
                  || index % Math.ceil(monthlyRevenue.length / 16) === 0;
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2 group"
                    title={`${item.month}: Rs. ${item.value.toLocaleString()}`}
                  >
                    <div className="w-full flex items-end justify-center relative" style={{ height: '240px' }}>
                      <motion.div
                        className="w-full rounded-t-lg bg-gradient-to-t from-[#487AA4] to-[#6ba3cc] group-hover:from-[#386184] group-hover:to-[#487AA4] transition-colors cursor-pointer min-h-[2px]"
                        style={{ height: `${Math.max((item.value / maxValue) * 100, item.value > 0 ? 1 : 0)}%` }}
                        initial={{ scaleY: 0, originY: 1 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: index * 0.02, duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                    {showLabel && (
                      <span className="text-[10px] text-slate-500 group-hover:text-slate-700 transition-colors truncate w-full text-center">
                        {item.month}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Donut chart */}
          <motion.div
            className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200/60 flex flex-col"
            variants={chartVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Order Distribution</h2>
              <p className="text-sm text-slate-500 mt-1">By service type</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <div className="relative w-44 h-44">
                <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                  {categoryData.map((category, index) => {
                    const angle = (category.value / total) * 360;
                    const startAngle = currentAngle;
                    const endAngle   = currentAngle + angle;
                    currentAngle += angle;

                    const outerRadius = 90, innerRadius = 55;
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad   = (endAngle   * Math.PI) / 180;

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
                        transition={{ duration: 1.5, delay: index * 0.2, ease: 'easeOut' }}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs font-medium text-slate-500 mb-1">Top</div>
                    <div className="text-base font-semibold text-[#4682B4]">{topCategory.name}</div>
                    <div className="text-sm text-slate-600 mt-0.5">{topCategory.value}%</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center gap-2.5 group cursor-pointer">
                    <div
                      className="w-3 h-3 rounded-full ring-2 ring-offset-2 ring-transparent group-hover:ring-slate-200 transition-all shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-slate-700 truncate">{category.name}</span>
                      <span className="text-xs text-slate-500">{category.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom tables ──────────────────────────────────────────────── */}
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
                <p className="text-sm text-slate-500 mt-1">Best performers this period</p>
              </div>
              <button className="group flex items-center gap-1.5 text-sm font-medium text-[#4682B4] hover:text-[#3a6a94] transition-colors">
                View All
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            {topSellingItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <ShoppingBag className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm">No sales data for this period</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-7 px-7">
                <table className="w-full min-w-[520px]">
                  <thead>
                    <tr className="border-b border-slate-200">
                      {['Items', 'Category', 'Price', 'Qty', 'Revenue'].map((h) => (
                        <th
                          key={h}
                          className={`text-xs font-semibold text-slate-600 uppercase tracking-wider pb-4 ${
                            ['Price', 'Qty', 'Revenue'].includes(h) ? 'text-right' : 'text-left'
                          }`}
                        >
                          {h}
                        </th>
                      ))}
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
                        <td className="py-4 text-sm text-slate-600">{item.category}</td>
                        <td className="py-4 text-right text-sm font-medium text-slate-900">Rs. {item.price}</td>
                        <td className="py-4 text-right text-sm font-medium text-slate-900">{item.qty}</td>
                        <td className="py-4 text-right text-sm font-semibold text-[#4682B4]">
                          Rs. {Number(item.revenue).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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

            {recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <DollarSign className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm">No transactions for this period</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.slice(0, 5).map((transaction, index) => (
                  <motion.div
                    key={index}
                    className="group flex items-center justify-between p-4 rounded-xl hover:bg-slate-50/50 transition-all cursor-pointer border border-transparent hover:border-slate-200/60"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.6 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        transaction.status === 'success' || transaction.status === 'Served'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-rose-50 text-rose-600'
                      }`}>
                        {transaction.status === 'success' || transaction.status === 'Served'
                          ? <CheckCircle className="w-5 h-5" strokeWidth={2.5} />
                          : <span className="text-xl font-bold">×</span>}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-[#4682B4] transition-colors">
                          {transaction.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          <span className="font-medium text-slate-600">{transaction.orderId}</span>
                          {transaction.payment && (
                            <>
                              <span className="mx-1.5">•</span>
                              {transaction.payment}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        NPR {Number(transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{transaction.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default HomeContent;