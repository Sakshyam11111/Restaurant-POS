import React from 'react';
import {
  Home,
  Package,
  FolderOpen,
  BarChart3,
  LogOut,
  Menu as MenuIcon,
  ChevronDown,
  Settings as SettingsIcon,
} from 'lucide-react';
import Logo from '../../../../assets/Logo.webp';

const Sidebar = ({
  isExpanded,
  setIsExpanded,
  isMasterOpen,
  setIsMasterOpen,
  handleMenuClick,
}) => {
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

  return (
    <>
      {!isExpanded && (
        <div className="hidden md:flex md:w-20 bg-white border-r border-gray-200 flex-col items-center py-6 space-y-8 h-screen">
          <div className="mb-4">
            <img src={Logo} alt="Logo" className="w-12 h-12 object-contain" />
          </div>

          <button
            onClick={() => setIsExpanded(true)}
            className="p-3 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Expand sidebar"
          >
            <MenuIcon size={24} strokeWidth={2} />
          </button>

          {collapsedMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`p-3 rounded-xl transition-all duration-200 text-gray-500 hover:text-gray-700 hover:bg-gray-100 ${
                  item.id === 'logout' ? 'mt-auto' : ''
                }`}
                title={item.label}
              >
                <Icon size={24} strokeWidth={2} />
              </button>
            );
          })}
        </div>
      )}

      {isExpanded && (
        <div className="w-full md:w-72 bg-white border-r border-gray-200 flex flex-col h-screen">
          <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between">
            <img src={Logo} alt="Logo" className="h-14 md:h-16 object-contain" />
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Collapse sidebar"
            >
              <MenuIcon size={20} />
            </button>
          </div>

          <nav className="flex-1 px-2 md:px-3 py-4 md:py-6 overflow-y-auto">
            {expandedMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className="w-full flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 rounded-xl mb-1 transition-colors text-gray-700 hover:bg-gray-100 text-sm md:text-base"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <Icon size={20} strokeWidth={2} />
                      <span>{item.label}</span>
                    </div>
                    {item.hasSubmenu && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          isMasterOpen ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {item.hasSubmenu && isMasterOpen && (
                    <div className="ml-8 md:ml-9 space-y-1 mt-1 mb-3">
                      {item.submenu.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleMenuClick(sub.id)}
                          className="w-full text-left px-3 md:px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
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

          <div className="p-3 md:p-4 border-t border-gray-100">
            <button
              onClick={() => handleMenuClick('logout')}
              className="w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors text-sm md:text-base"
            >
              <LogOut size={20} strokeWidth={2} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;