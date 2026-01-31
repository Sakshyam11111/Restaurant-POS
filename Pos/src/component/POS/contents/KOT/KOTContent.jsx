import React, { useState } from 'react';

const KOTContent = () => {
  const [tables, setTables] = useState([
    { id: 1, kot: 'K2001', table: 'F1', date: '2025/12/15', time: '5 min ago', orderType: 'Dine In', waiter: 'Ram Shahi', status: 'pending' },
    { id: 2, kot: 'K2003', table: 'F1', date: '2025/12/15', time: '5 min ago', orderType: 'Dine In', waiter: 'Ram Shahi', status: 'pending' },
    { id: 3, kot: 'K2006', table: 'F1', date: '2025/12/15', time: '5 min ago', orderType: 'Dine In', waiter: 'Ram Shahi', status: 'pending' },
    { id: 4, kot: 'K2004', table: 'F1', date: '2025/12/15', time: '5 min ago', orderType: 'Dine In', waiter: 'Ram Shahi', status: 'pending' },
    { id: 5, kot: 'K2011', table: 'F1', date: '2025/12/15', time: '5 min ago', orderType: 'Dine In', waiter: 'Ram Shahi', status: 'pending' },
    { id: 6, kot: 'K3001', table: 'F1', date: '2025/12/15', time: '5 min ago', orderType: 'Dine In', waiter: 'Ram Shahi', status: 'pending' },
    { id: 7, kot: 'K2007', table: 'F1', date: '2025/12/15', time: '5 min ago', orderType: 'Dine In', waiter: 'Ram Shahi', status: 'pending' },
    { id: 8, kot: 'K3401', table: 'F1', date: '2025/12/15', time: '5 min ago', orderType: 'Dine In', waiter: 'Ram Shahi', status: 'pending' },
  ]);

  const handleCompleted = (id) => {
    setTables(tables.map(table => {
      if (table.id === id) {
        // Toggle: if already completed, set to pending; otherwise set to completed
        return { ...table, status: table.status === 'completed' ? 'pending' : 'completed' };
      }
      return table;
    }));
  };

  const handleCancel = (id) => {
    setTables(tables.map(table => {
      if (table.id === id) {
        // Toggle: if already cancelled, set to pending; otherwise set to cancelled
        return { ...table, status: table.status === 'cancelled' ? 'pending' : 'cancelled' };
      }
      return table;
    }));
  };

  const handlePrint = (id) => {
    console.log(`Print table ${id}`);
    // Add print functionality here
  };

  const getCardStyle = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-50 border-green-300';
      case 'cancelled':
        return 'bg-red-50 border-red-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return (
          <div className="absolute top-4 right-4">
            <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Completed
            </span>
          </div>
        );
      case 'cancelled':
        return (
          <div className="absolute top-4 right-4">
            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Cancelled
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <div 
            key={table.id} 
            className={`rounded-lg border p-6 shadow-sm relative transition-all duration-300 ${getCardStyle(table.status)}`}
          >
            {getStatusBadge(table.status)}
            
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
              Table {table.id}
            </h2>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date: <span className="text-gray-800">{table.date}</span></span>
                <span className="text-gray-600">Time: <span className="text-gray-800">{table.time}</span></span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">KOT: <span className="text-gray-800">{table.kot}</span></span>
                <span className="text-gray-600">Table: <span className="text-gray-800">{table.table}</span></span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order Type: <span className="text-gray-800">{table.orderType}</span></span>
                <span className="text-gray-600">Waiter: <span className="text-gray-800">{table.waiter}</span></span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleCompleted(table.id)}
                disabled={table.status === 'cancelled'}
                className={`flex-1 px-4 py-2 border rounded-md font-medium transition-colors ${
                  table.status === 'completed' 
                    ? 'bg-green-500 border-green-600 text-white hover:bg-green-600' 
                    : table.status === 'cancelled'
                    ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {table.status === 'completed' ? 'Complete' : 'Completed'}
              </button>
              <button
                onClick={() => handleCancel(table.id)}
                disabled={table.status === 'completed'}
                className={`flex-1 px-4 py-2 border rounded-md font-medium transition-colors ${
                  table.status === 'cancelled' 
                    ? 'bg-red-500 border-red-600 text-white hover:bg-red-600' 
                    : table.status === 'completed'
                    ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {table.status === 'cancelled' ? 'Cancel' : 'Cancel'}
              </button>
              <button
                onClick={() => handlePrint(table.id)}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                Print
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KOTContent;