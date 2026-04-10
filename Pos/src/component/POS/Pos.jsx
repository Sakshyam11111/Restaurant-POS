import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  Home,
  Package,
  FolderOpen,
  BarChart3,
  LogOut,
  Menu,
  ChevronDown,
  Settings as SettingsIcon,
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import Logo from '../../assets/Logo.webp';
import HomeContent from './contents/HomeContent';
import POSContent from './contents/POSContent';
import ReportsContent from './contents/ReportsContent';
import POSMenu from './contents/menu/POSMenu';

import Zone from './master/Zone';
import Table from './master/Table';
import Employee from './master/Employee';
import Settings from './contents/Settings';
import Department from './master/Department';
import Designation from './master/Designation';
import Employeeshifts from './master/Employeeshifts';
import Employeeshiftsrotation from './master/Employeeshiftsrotation';
import Printtype from './master/Printtype';
import PrintSetting from './master/PrintSetting';
import Ingredient from './master/Ingredient';
import TableContent from './contents/order/TableContent';
import OrderDetailPage from './contents/order/OrderDetailPage';
import MenuItems from './master/menuitems/MenuItems';
import { orderAPI, menuAPI } from '../../services/api';
import IngredientRecommendations from './contents/Ingredientrecommendations';

export const DATE_RANGES = [
  { key: 'today',       label: 'Today' },
  { key: 'yesterday',   label: 'Yesterday' },
  { key: 'this_week',   label: 'This Week' },
  { key: 'this_month',  label: 'This Month' },
  { key: 'last_6month', label: 'Last 6 Months' },
  { key: 'last_year',   label: 'Last Year' },
];

export const getDateRange = (rangeKey) => {
  const now = new Date();
  const toISO = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day   = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  switch (rangeKey) {
    case 'today': {
      const d = toISO(now);
      return { startDate: d, endDate: d };
    }
    case 'yesterday': {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      const d = toISO(y);
      return { startDate: d, endDate: d };
    }
    case 'this_week': {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      return { startDate: toISO(start), endDate: toISO(now) };
    }
    case 'this_month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: toISO(start), endDate: toISO(now) };
    }
    case 'last_6month': {
      const start = new Date(now);
      start.setMonth(start.getMonth() - 6);
      start.setDate(1);
      return { startDate: toISO(start), endDate: toISO(now) };
    }
    case 'last_year': {
      const start = new Date(now);
      start.setFullYear(start.getFullYear() - 1);
      start.setDate(1);
      return { startDate: toISO(start), endDate: toISO(now) };
    }
    default: {
      const d = toISO(now);
      return { startDate: d, endDate: d };
    }
  }
};

const isOrderInRange = (order, startDate, endDate) => {
  if (!order.createdAt) return false;
  const orderDate = new Date(order.createdAt);
  const year  = orderDate.getFullYear();
  const month = String(orderDate.getMonth() + 1).padStart(2, '0');
  const day   = String(orderDate.getDate()).padStart(2, '0');
  const orderISO = `${year}-${month}-${day}`;
  return orderISO >= startDate && orderISO <= endDate;
};

const buildDashboardData = async (rangeKey = 'today') => {
  const { startDate, endDate } = getDateRange(rangeKey);

  const [ordersRes, menuRes] = await Promise.allSettled([
    orderAPI.getOrders({ startDate, endDate }),
    menuAPI.getMenuItems(),
  ]);

  const allOrders = ordersRes.status === 'fulfilled'
    ? (ordersRes.value.data?.orders || [])
    : [];

  const orders = allOrders.filter((o) => isOrderInRange(o, startDate, endDate));

  const menuItems = menuRes.status === 'fulfilled'
    ? (menuRes.value.data?.items || [])
    : [];

  const menuPriceMap = {};
  menuItems.forEach((m) => {
    const key = (m.name || '').toLowerCase().trim();
    menuPriceMap[key] = { price: m.price || 0, category: m.category || 'Menu' };
  });

  const lookupMenu = (rawName) => {
    const key = (rawName || '').toLowerCase().trim();
    if (menuPriceMap[key]) return menuPriceMap[key];
    const partial = Object.keys(menuPriceMap).find(
      (k) => k.includes(key) || key.includes(k)
    );
    return partial ? menuPriceMap[partial] : null;
  };

  const completedOrders = orders.filter((o) => o.status === 'Served');
  const pendingOrders   = orders.filter((o) => ['Pending', 'Preparing', 'Ready'].includes(o.status));
  const cancelledOrders = orders.filter((o) => o.status === 'Cancelled');
  const totalRevenue    = completedOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const typeCounts = { 'Dine In': 0, 'Take Away': 0, Delivery: 0 };
  orders.forEach((o) => {
    const t = o.type || 'Dine In';
    if (typeCounts[t] !== undefined) typeCounts[t]++;
    else typeCounts[t] = 1;
  });
  const totalOrders = orders.length || 1;
  const categoryData = [
    { name: 'Dine-In',  value: Math.round((typeCounts['Dine In']  / totalOrders) * 100), color: '#4682B4' },
    { name: 'Takeaway', value: Math.round((typeCounts['Take Away'] / totalOrders) * 100), color: '#8B5CF6' },
    { name: 'Delivery', value: Math.round((typeCounts['Delivery']  / totalOrders) * 100), color: '#10B981' },
  ];
  const pctSum = categoryData.reduce((s, c) => s + c.value, 0);
  if (pctSum !== 100 && categoryData[0]) categoryData[0].value += (100 - pctSum);

  const itemMap = {};
  orders.forEach((o) => {
    (o.items || []).forEach((item) => {
      const name = typeof item === 'string' ? item.split(' ×')[0].trim() : (item.name || '').trim();
      const qty  = typeof item === 'string'
        ? parseInt(item.split(' ×')[1]) || 1
        : item.quantity || 1;

      let price = 0;
      if (typeof item === 'object' && item.price > 0) {
        price = item.price;
      } else {
        const found = lookupMenu(name);
        if (found) price = found.price;
      }

      const menuInfo = lookupMenu(name);
      const category = menuInfo?.category || 'Menu';

      if (!itemMap[name]) itemMap[name] = { name, price, qty: 0, revenue: 0, category };
      itemMap[name].qty     += qty;
      itemMap[name].revenue += price * qty;
      if (price > 0 && itemMap[name].price === 0) itemMap[name].price = price;
    });
  });
  const topSellingItems = Object.values(itemMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const recentTransactions = completedOrders
    .slice(-10)
    .reverse()
    .map((o) => ({
      name:    o.table ? `Table ${o.table}` : 'Guest',
      orderId: o.kot || o.id,
      payment: 'Cash',
      amount:  o.totalPrice || 0,
      time:    o.createdAt
        ? new Date(o.createdAt).toLocaleString('en-US', {
            month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })
        : '—',
      status: 'success',
    }));

  const monthlyRevenue = buildRevenueChart(orders, rangeKey);

  return {
    totalSalesToday:   orders.length,
    completedOrders:   completedOrders.length,
    cancelledOrders:   cancelledOrders.length,
    pendingOrders:     pendingOrders.length,
    todaysRevenue:     totalRevenue,
    monthlyRevenue,
    topSellingItems,
    recentTransactions,
    categoryData,
    rangeKey,
    startDate,
    endDate,
  };
};

const buildRevenueChart = (orders, rangeKey) => {
  const completedOrders = orders.filter((o) => o.status === 'Served');

  if (rangeKey === 'today' || rangeKey === 'yesterday') {
    const buckets = Array.from({ length: 24 }, (_, h) => ({
      month: `${h.toString().padStart(2, '0')}:00`,
      value: 0,
    }));
    completedOrders.forEach((o) => {
      if (o.createdAt) {
        const h = new Date(o.createdAt).getHours();
        buckets[h].value += o.totalPrice || 0;
      }
    });
    return buckets;
  }

  if (rangeKey === 'this_week') {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const buckets = days.map((d) => ({ month: d, value: 0 }));
    completedOrders.forEach((o) => {
      if (o.createdAt) {
        const dow = new Date(o.createdAt).getDay();
        buckets[dow].value += o.totalPrice || 0;
      }
    });
    return buckets;
  }

  if (rangeKey === 'this_month') {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const buckets = Array.from({ length: daysInMonth }, (_, i) => ({
      month: String(i + 1),
      value: 0,
    }));
    completedOrders.forEach((o) => {
      if (o.createdAt) {
        const day = new Date(o.createdAt).getDate() - 1;
        if (day >= 0 && day < daysInMonth) buckets[day].value += o.totalPrice || 0;
      }
    });
    return buckets;
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const numMonths = rangeKey === 'last_6month' ? 6 : 12;
  const now = new Date();
  const buckets = [];
  for (let i = numMonths - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      month:  monthNames[d.getMonth()],
      value:  0,
      _year:  d.getFullYear(),
      _month: d.getMonth(),
    });
  }
  completedOrders.forEach((o) => {
    if (o.createdAt) {
      const d      = new Date(o.createdAt);
      const bucket = buckets.find((b) => b._year === d.getFullYear() && b._month === d.getMonth());
      if (bucket) bucket.value += o.totalPrice || 0;
    }
  });
  return buckets;
};

export default function Pos() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded]       = useState(true);
  const [isMasterOpen, setIsMasterOpen]   = useState(true);
  const [activeStep, setActiveStep]       = useState(1);

  const [dashboardData, setDashboardData]           = useState(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [dashboardRange, setDashboardRange]         = useState('today');

  const loadDashboard = useCallback(async (rangeKey) => {
    setIsLoadingDashboard(true);
    try {
      const data = await buildDashboardData(rangeKey);
      setDashboardData(data);
    } catch (err) {
      console.warn('Dashboard fetch failed:', err.message);
      setDashboardData(null);
    } finally {
      setIsLoadingDashboard(false);
    }
  }, []);

  const handleRangeChange = useCallback((rangeKey) => {
    setDashboardRange(rangeKey);
    loadDashboard(rangeKey);
  }, [loadDashboard]);

  useEffect(() => {
    if (activeStep === 1) loadDashboard(dashboardRange);
  }, [activeStep]);

  const steps = {
    1:  { id: 'home',                    component: HomeContent },
    2:  { id: 'pos',                     component: POSContent },
    3:  { id: 'tablecomponent',          component: TableContent },
    4:  { id: 'orderdetail',             component: OrderDetailPage },
    5:  { id: 'reports',                 component: ReportsContent },
    6:  { id: 'zone',                    component: Zone },
    7:  { id: 'table',                   component: Table },
    8:  { id: 'menu-items',              component: MenuItems },
    9:  { id: 'employee',                component: Employee },
    10: { id: 'department',              component: Department },
    11: { id: 'designation',             component: Designation },
    12: { id: 'employeeshifts',          component: Employeeshifts },
    13: { id: 'employeeshiftsrotation',  component: Employeeshiftsrotation },
    14: { id: 'printtype',               component: Printtype },
    15: { id: 'printsetting',            component: PrintSetting },
    16: { id: 'settings',                component: Settings },
    17: { id: 'posmenu',                 component: POSMenu },
    18: { id: 'ingredient',              component: Ingredient },
    19: { id: 'ingredient-ai',           component: IngredientRecommendations },
  };

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
    const stepEntry = Object.entries(steps).find(([, item]) => item.id === id);
    if (stepEntry) {
      const [stepNumber] = stepEntry;
      setActiveStep(Number(stepNumber));
    }
  };

  const navigateToStep = (id) => handleMenuClick(id);
  const activeId = steps[activeStep]?.id || 'home';

  const collapsedMenuItems = [
    { id: 'home',     icon: Home,         label: 'Home' },
    { id: 'pos',      icon: Package,      label: 'POS' },
    { id: 'reports',  icon: BarChart3,    label: 'Reports' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
    { id: 'logout',   icon: LogOut,       label: 'Logout' },
  ];

  const expandedMenuItems = [
    { id: 'home',    icon: Home,        label: 'Home' },
    { id: 'pos',     icon: Package,     label: 'POS' },
    {
      id: 'master',
      icon: FolderOpen,
      label: 'Master',
      hasSubmenu: true,
      submenu: [
        { id: 'zone',                   label: 'Zone' },
        { id: 'table',                  label: 'Table' },
        { id: 'menu-items',             label: 'Menu Items' },
        { id: 'ingredient',             label: 'Ingredient' },
        { id: 'ingredient-ai',          label: 'AI Ingredient Planner' },
        { id: 'employee',               label: 'Employee' },
        { id: 'department',             label: 'Department' },
        { id: 'designation',            label: 'Designation' },
        { id: 'employeeshifts',         label: 'Employee Shifts' },
        { id: 'employeeshiftsrotation', label: 'Employee Shifts Rotation' },
        { id: 'printtype',              label: 'Print Type' },
        { id: 'printsetting',           label: 'Print Setting' },
      ],
    },
    { id: 'reports',  icon: BarChart3,    label: 'Reports' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  const renderContent = () => {
    const step = steps[activeStep];
    if (!step) return (
      <div className="p-8 text-gray-500">
        <h2>Select an option from the menu</h2>
      </div>
    );

    if (step.id === 'home') {
      return (
        <HomeContent
          dashboardData={dashboardData}
          isLoadingDashboard={isLoadingDashboard}
          onRefresh={() => loadDashboard(dashboardRange)}
          navigateToStep={navigateToStep}
          dashboardRange={dashboardRange}
          onRangeChange={handleRangeChange}
        />
      );
    }

    const SelectedContent = step.component;
    return <SelectedContent navigateToStep={navigateToStep} />;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster />

      {!isExpanded && (
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-8">
          <div className="mb-4">
            <img src={Logo} alt="Logo" className="w-12 h-12 object-contain" />
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="p-3 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            data-tooltip-id="sidebar-tooltip"
            data-tooltip-content="Expand sidebar"
            data-tooltip-place="right"
          >
            <Menu size={24} strokeWidth={2} />
          </button>
          {collapsedMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  isActive && item.id !== 'logout'
                    ? 'bg-blue-50 text-[#386184] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                } ${item.id === 'logout' ? 'mt-auto' : ''}`}
                data-tooltip-id="sidebar-tooltip"
                data-tooltip-content={item.label}
                data-tooltip-place="right"
              >
                <Icon size={24} strokeWidth={2} />
              </button>
            );
          })}
        </div>
      )}

      {isExpanded && (
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <img src={Logo} alt="Logo" className="h-16 object-contain" />
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
          <nav className="flex-1 px-3 py-6 overflow-y-auto">
            {expandedMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeId === item.id;
              return (
                <div key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-colors ${
                      isActive && !item.hasSubmenu
                        ? 'bg-blue-50 text-[#386184] font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} strokeWidth={2} />
                      <span>{item.label}</span>
                    </div>
                    {item.hasSubmenu && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${isMasterOpen ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>
                  {item.hasSubmenu && isMasterOpen && (
                    <div className="ml-9 space-y-1 mt-1 mb-3">
                      {item.submenu.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleMenuClick(sub.id)}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                            activeId === sub.id
                              ? 'bg-blue-50 text-[#386184] font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => handleMenuClick('logout')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut size={20} strokeWidth={2} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto min-h-0 bg-gray-50">
        {renderContent()}
      </div>

      <Tooltip
        id="sidebar-tooltip"
        place="right"
        delayShow={200}
        effect="solid"
        className="!bg-gray-800 !text-white !text-sm !py-1.5 !px-3 !rounded !shadow-lg"
      />
    </div>
  );
}