import React, { useState } from 'react';
import POSContent from './POSContent'; 

const TableContent = () => {
  const [activeTab, setActiveTab] = useState('Order');

  if (activeTab === 'Table') {
    return <POSContent />;
  }

  if (activeTab === 'KOT') {
    return <KOTContent />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="inline-flex bg-gray-100 rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('Order')}
            className={`px-8 py-2.5 rounded-md font-medium text-sm transition-all ${
              activeTab === 'Order'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Order
          </button>
          <button
            onClick={() => setActiveTab('Table')}
            className={`px-8 py-2.5 rounded-md font-medium text-sm transition-all ${
              activeTab === 'Table'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setActiveTab('KOT')}
            className={`px-8 py-2.5 rounded-md font-medium text-sm transition-all ${
              activeTab === 'KOT'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            KOT
          </button>
        </div>

        <div className="flex items-center gap-3">
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {activeTab === 'Order' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Orders Overview</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-4">
                No active orders at the moment
              </p>
              <button className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                Create New Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Placeholder KOT content component (create a separate file later if needed)
const KOTContent = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Kitchen Order Tickets (KOT)</h2>
      
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
        <svg 
          className="w-16 h-16 mx-auto mb-6 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        
        <h3 className="text-xl font-medium text-gray-700 mb-3">
          No pending KOTs at the moment
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          When new orders are sent to the kitchen, their KOTs will appear here for tracking and preparation.
        </p>
        
        <button className="px-6 py-3 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white font-medium rounded-lg hover:brightness-105 transition">
          Refresh KOT List
        </button>
      </div>
    </div>
  );
};

export default TableContent;