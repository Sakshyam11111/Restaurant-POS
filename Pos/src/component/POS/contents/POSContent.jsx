import React, { useState } from 'react';
import TableContent from './order/TableContent';
import KOTContent from './KOT/KOTContent';


const POSContent = () => {
  const [activeTab, setActiveTab] = useState('Table');
  const [activeFloor, setActiveFloor] = useState('First Floor');
  const [activeFilter, setActiveFilter] = useState('All');

  const tables = [
    { id: 1, status: 'available' },
    { id: 2, status: 'reserved' },
    { id: 3, status: 'reserved' },
    { id: 4, status: 'on-dine' },
    { id: 5, status: 'on-dine' },
    { id: 6, status: 'reserved' },
    { id: 7, status: 'available' },
    { id: 8, status: 'on-dine' },
    { id: 9, status: 'on-dine' },
    { id: 10, status: 'on-dine' },
    { id: 11, status: 'available' },
    { id: 12, status: 'available' },
    { id: 13, status: 'available' },
    { id: 14, status: 'available' },
    { id: 15, status: 'on-dine' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-blue-400',
      reserved: 'bg-green-400',
      'on-dine': 'bg-red-400',
      split: 'bg-orange-400',
      merge: 'bg-cyan-400',
    };
    return colors[status] || 'bg-gray-400';
  };

  const filters = [
    'All', 'Reservation', 'On Dine', 'Takeaway',
    'Delivery', 'Split Table', 'Table Transfer'
  ];

  if (activeTab === 'Order') {
    return <TableContent />;
  }

  if (activeTab === 'KOT') {
    return <KOTContent />;
  }
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-gray-50 px-6 py-2 flex items-center justify-between">
        <div className="inline-flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('Order')}
            className={`px-8 py-2.5 rounded-md font-medium transition-all ${activeTab === 'Order'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            Order
          </button>
          <button
            onClick={() => setActiveTab('Table')}
            className={`px-8 py-2.5 rounded-md font-medium transition-all ${activeTab === 'Table'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            Table
          </button>
          <button
            onClick={() => setActiveTab('KOT')}
            className={`px-8 py-2.5 rounded-md font-medium transition-all ${activeTab === 'KOT'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            KOT
          </button>
        </div>
      </div>

      <div className="bg-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`
                px-5 py-2 text-sm font-medium rounded border
                ${activeFilter === filter
                  ? 'bg-gradient-to-r from-[#487AA4] to-[#386184] border-[#487AA4] text-white'
                  : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'}
              `}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            className={`
              px-5 py-2 text-sm font-medium rounded border
              ${activeFloor === 'First Floor'
                ? 'bg-gradient-to-r from-[#487AA4] to-[#386184] text-white'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}
            `}
            onClick={() => setActiveFloor('First Floor')}
          >
            First Floor
          </button>
          <button
            className={`
              px-5 py-2 text-sm font-medium rounded border
              ${activeFloor === 'Second Floor'
                ? 'bg-gradient-to-r from-[#487AA4] to-[#386184] text-white'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}
            `}
            onClick={() => setActiveFloor('Second Floor')}
          >
            Second Floor
          </button>
          <button className="p-2 bg-white border border-gray-300 rounded hover:border-gray-400">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-6 py-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-400" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <span>On Dine</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-400" />
          <span>Split</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400" />
          <span>Merge Table</span>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-8 max-w-7xl mx-auto">
          {tables.map((table) => (
            <button
              key={table.id}
              className={`
                relative w-36 h-36 rounded-full flex items-center justify-center 
                text-white font-semibold text-base shadow-md
                hover:scale-105 hover:shadow-lg transition-all duration-200
                ${getStatusColor(table.status)}
              `}
            >
              Table #{table.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default POSContent;