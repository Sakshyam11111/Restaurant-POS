import React, { useState } from 'react';
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

import UnitMaster from './master/unitmaster';
import UnitMeasure from './master/UnitMeasure';
import Zone from './master/Zone';
import Table from './master/Table';
import MenuItems from './master/MenuItems';
import Employee from './master/Employee';
import Settings from './contents/Settings';
import Department from './master/Department';
import Designation from './master/Designation';
import Employeeshifts from './master/Employeeshifts';
import Employeeshiftsrotation from './master/Employeeshiftsrotation';
import Printtype from './master/Printtype';
import PrintSetting from './master/PrintSetting';
import TableContent from './contents/TableContent';

export default function Pos() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMasterOpen, setIsMasterOpen] = useState(true);
  const [activeStep, setActiveStep] = useState(1);

  const steps = {
    1: { id: 'home', component: HomeContent },
    2: { id: 'pos', component: POSContent },
    3: { id: 'tablecomponent', component: TableContent },
    4: { id: 'reports', component: ReportsContent },
    5: { id: 'unit-master', component: UnitMaster },
    6: { id: 'unit-measure', component: UnitMeasure },
    7: { id: 'zone', component: Zone },
    8: { id: 'table', component: Table },
    9: { id: 'menu-items', component: MenuItems },
    10: { id: 'employee', component: Employee },
    11: { id: 'department', component: Department },
    12: { id: 'designation', component: Designation },
    13: { id: 'employeeshifts', component: Employeeshifts },
    14: { id: 'employeeshiftsrotation', component: Employeeshiftsrotation },
    15: { id: 'printtype', component: Printtype },
    16: { id: 'printsetting', component: PrintSetting },
    17: { id: 'settings', component: Settings },
  };

  const handleMenuClick = (id) => {
    if (id === 'master') {
      setIsMasterOpen((prev) => !prev);
      return;
    }

    if (id === 'logout') {
      // Show toast instead of alert
      toast.success('Logged out successfully', {
        duration: 3000,
        position: 'top-center',
      });

      // Simulate logout delay then redirect
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 800);

      return;
    }

    const stepEntry = Object.entries(steps).find(([, item]) => item.id === id);
    if (stepEntry) {
      const [stepNumber] = stepEntry;
      setActiveStep(Number(stepNumber));
    }
  };

  const activeId = steps[activeStep]?.id || 'home';

  const collapsedMenuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'pos', icon: Package, label: 'POS' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
    { id: 'logout', icon: LogOut, label: 'Logout' },
  ];

  const expandedMenuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'pos', icon: Package, label: 'POS' },
    {
      id: 'master',
      icon: FolderOpen,
      label: 'Master',
      hasSubmenu: true,
      submenu: [
        { id: 'unit-master', label: 'Unit Master' },
        { id: 'unit-measure', label: 'Unit Measure' },
        { id: 'zone', label: 'Zone' },
        { id: 'table', label: 'Table' },
        { id: 'menu-items', label: 'Menu Items' },
        { id: 'employee', label: 'Employee' },
        { id: 'department', label: 'Department' },
        { id: 'designation', label: 'Designation' },
        { id: 'employeeshifts', label: 'Employee Shifts' },
        { id: 'employeeshiftsrotation', label: 'Employee Shifts Rotation' },
        { id: 'printtype', label: 'Print Type' },
        { id: 'printsetting', label: 'Print Setting' },
      ],
    },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  const SelectedContent = steps[activeStep]?.component || (() => (
    <div className="p-8 text-gray-500">
      <h2>Select an option from the menu</h2>
    </div>
  ));

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Add Toaster here (or in root App.jsx) */}
      <Toaster />

      {/* Collapsed Sidebar */}
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
                className={`p-3 rounded-xl transition-all duration-200 ${isActive && item.id !== 'logout'
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
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

      {/* Expanded Sidebar */}
      {isExpanded && (
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <img src={Logo} alt="Logo" className="h-16 object-contain" />
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              data-tooltip-id="sidebar-tooltip"
              data-tooltip-content="Collapse sidebar"
              data-tooltip-place="right"
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
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-colors ${isActive && !item.hasSubmenu
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    data-tooltip-id="sidebar-tooltip"
                    data-tooltip-content={item.label}
                    data-tooltip-place="right"
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
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${activeId === sub.id
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          data-tooltip-id="sidebar-tooltip"
                          data-tooltip-content={sub.label}
                          data-tooltip-place="right"
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
              data-tooltip-id="sidebar-tooltip"
              data-tooltip-content="Logout from system"
              data-tooltip-place="right"
            >
              <LogOut size={20} strokeWidth={2} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <SelectedContent />
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