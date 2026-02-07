import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import KOTContent from './KOT/KOTContent';
import OrderContent from './order/OrderContent';
import { tableAPI } from '../../../services/api';
import ReservationModal from './tableform/ReservationModal';
import { User, Users, Clock, Utensils } from 'lucide-react';

const POSContent = () => {
  const [activeTab, setActiveTab] = useState('Table');
  const navigate = useNavigate();
  const [activeFloor, setActiveFloor] = useState('First Floor');
  const [activeFilter, setActiveFilter] = useState('All');
  const [openTableMenu, setOpenTableMenu] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef(null);

  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedTableForReservation, setSelectedTableForReservation] = useState(null);
  const [reservationData, setReservationData] = useState({
    guestName: '',
    guestPhone: '',
    partySize: 1,
    reservationTime: '',
  });

  useEffect(() => {
    loadTables();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadTables();
    }, 30000);
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      clearInterval(interval);
    };
  }, [activeFloor]);

  const removeDuplicateTables = (tablesArray) => {
    const seen = new Set();
    return tablesArray.filter(table => {
      const duplicate = seen.has(table.tableId);
      seen.add(table.tableId);
      return !duplicate;
    });
  };

  const loadTables = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const response = await tableAPI.getAllTables(activeFloor, {
        signal: abortControllerRef.current.signal
      });

      console.log('Tables loaded:', response.data.tables);

      if (response.data.tables.length === 0) {
        await tableAPI.initializeTables({
          signal: abortControllerRef.current.signal
        });
        
        const finalResponse = await tableAPI.getAllTables(activeFloor, {
          signal: abortControllerRef.current.signal
        });
        
        const uniqueTables = removeDuplicateTables(finalResponse.data.tables);
        setTables(uniqueTables);
      } else {
        const uniqueTables = removeDuplicateTables(response.data.tables);
        setTables(uniqueTables);
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      
      console.error('Error loading tables:', error);
      toast.error('Failed to load tables');
      
      const fallbackTables = Array.from({ length: 15 }, (_, i) => ({
        tableId: i + 1,
        status: 'available',
        floor: activeFloor
      }));
      setTables(fallbackTables);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-blue-400 hover:bg-blue-500',
      reserved: 'bg-green-400 hover:bg-green-500',
      'on-dine': 'bg-red-400 hover:bg-red-500',
      split: 'bg-orange-400 hover:bg-orange-500',
      merge: 'bg-cyan-400 hover:bg-cyan-500'
    };
    return colors[status] || 'bg-gray-400 hover:bg-gray-500';
  };

  const getStatusBorderColor = (status) => {
    const colors = {
      available: 'border-blue-500',
      reserved: 'border-green-500',
      'on-dine': 'border-red-500',
      split: 'border-orange-500',
      merge: 'border-cyan-500'
    };
    return colors[status] || 'border-gray-500';
  };

  const filters = ['All', 'Reservation', 'On Dine', 'Takeaway', 'Delivery', 'Split Table', 'Table Transfer'];

  const handleTableClick = (tableId) => {
    setOpenTableMenu(prev => prev === tableId ? null : tableId);
  };

  const handleAction = async (action, tableId) => {
    setOpenTableMenu(null);
    try {
      switch (action) {
        case 'dine-in':
          await tableAPI.startDining(tableId);
          toast.success(`Dine In started for Table #${tableId}`);
          await loadTables();
          // Navigate to menu with table context
          navigate('/posmenu', { 
            state: { 
              tableId,
              tableNumber: `Table #${tableId}`,
              orderType: 'Dine in',
              floor: activeFloor
            } 
          });
          break;
        case 'reserve':
          setSelectedTableForReservation(tableId);
          setShowReservationModal(true);
          break;
        case 'cancel-dine-in':
          await tableAPI.endDining(tableId);
          toast.success(`Dine In cancelled for Table #${tableId}`);
          await loadTables();
          break;
        case 'cancel-reserve':
          await tableAPI.cancelReservation(tableId);
          toast.success(`Reservation cancelled for Table #${tableId}`);
          await loadTables();
          break;
        case 'split':
          await tableAPI.updateTableStatus(tableId, { status: 'split' });
          toast.success(`Table #${tableId} set to Split`);
          await loadTables();
          break;
        case 'merge':
          await tableAPI.updateTableStatus(tableId, { status: 'merge' });
          toast.success(`Table #${tableId} set to Merge`);
          await loadTables();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error handling table action:', error);
      toast.error(error.response?.data?.message || 'Failed to update table status');
    }
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!reservationData.guestName || !reservationData.guestPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    const cleanPhone = reservationData.guestPhone.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      const reservationPayload = {
        guestName: reservationData.guestName.trim(),
        guestPhone: cleanPhone,
        partySize: parseInt(reservationData.partySize) || 1,
        reservationTime: reservationData.reservationTime 
          ? new Date(reservationData.reservationTime).toISOString()
          : new Date().toISOString()
      };

      console.log('Submitting reservation:', reservationPayload);
      
      await tableAPI.reserveTable(selectedTableForReservation, reservationPayload);
      
      toast.success(
        `Table #${selectedTableForReservation} reserved for ${reservationData.guestName}`,
        { duration: 3000 }
      );
      
      setShowReservationModal(false);
      setReservationData({
        guestName: '',
        guestPhone: '',
        partySize: 1,
        reservationTime: '',
      });
      setSelectedTableForReservation(null);
      await loadTables();
    } catch (error) {
      console.error('Error reserving table:', error);
      toast.error(error.response?.data?.message || 'Failed to reserve table');
    }
  };

  const handleCloseModal = () => {
    setShowReservationModal(false);
    setReservationData({
      guestName: '',
      guestPhone: '',
      partySize: 1,
      reservationTime: '',
    });
    setSelectedTableForReservation(null);
  };

  const getMenuItemsForTable = (status) => {
    switch (status) {
      case 'available':
        return [
          { action: 'dine-in', label: 'Dine In' },
          { action: 'reserve', label: 'Reserve' },
        ];
      case 'on-dine':
        return [
          { action: 'cancel-dine-in', label: 'Cancel Dine In', danger: true },
          { action: 'split', label: 'Split Table' },
          { action: 'merge', label: 'Merge Table' },
        ];
      case 'reserved':
        return [
          { action: 'cancel-reserve', label: 'Cancel Reservation', danger: true },
          { action: 'dine-in', label: 'Start Dining' },
        ];
      case 'split':
        return [
          { action: 'cancel-dine-in', label: 'Cancel Dine In', danger: true },
          { action: 'merge', label: 'Merge Table' },
        ];
      case 'merge':
        return [
          { action: 'cancel-dine-in', label: 'Cancel Dine In', danger: true },
          { action: 'split', label: 'Split Table' },
        ];
      default:
        return [];
    }
  };

  const handleAddNewOrder = () => {
    navigate('/posmenu', {
      state: {
        orderType: 'Takeaway'
      }
    });
  };

  const getFilteredTables = () => {
    if (activeFilter === 'All') return tables;
    
    const filterMap = {
      'Reservation': 'reserved',
      'On Dine': 'on-dine',
      'Split Table': 'split',
      'Table Transfer': 'merge'
    };
    
    const statusFilter = filterMap[activeFilter];
    return statusFilter ? tables.filter(t => t.status === statusFilter) : tables;
  };

  const filteredTables = getFilteredTables();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#487AA4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tables...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="inline-flex bg-gray-100 rounded-xl p-1.5 shadow-inner">
            {['Order', 'Table', 'KOT'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-lg font-semibold text-sm transition-colors
                  ${activeTab === tab ? 'bg-white shadow-md text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 max-w-lg">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search by KOT, Order ID, Table, Waiter..." className="w-full pl-12 pr-5 py-3.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddNewOrder}
                className="flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        {activeTab === 'Order' && <OrderContent />}

        {activeTab === 'Table' && (
          <div className="flex flex-col h-full relative">
            <div className="bg-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200">
              <div className="flex flex-wrap gap-3">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    className={`px-5 py-2 text-sm font-medium rounded border ${activeFilter === filter ? 'bg-gradient-to-r from-[#487AA4] to-[#386184] border-[#487AA4] text-white' : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'}`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button className={`px-5 py-2 text-sm font-medium rounded border ${activeFloor === 'First Floor' ? 'bg-gradient-to-r from-[#487AA4] to-[#386184] text-white' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`} onClick={() => setActiveFloor('First Floor')}>First Floor</button>
                <button className={`px-5 py-2 text-sm font-medium rounded border ${activeFloor === 'Second Floor' ? 'bg-gradient-to-r from-[#487AA4] to-[#386184] text-white' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`} onClick={() => setActiveFloor('Second Floor')}>Second Floor</button>
                <button 
                  onClick={loadTables}
                  className="p-2 bg-white border border-gray-300 rounded hover:border-gray-400"
                  title="Refresh tables"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600 bg-gray-50">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-400" /><span>Available</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-400" /><span>Reserved</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-400" /><span>On Dine</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-400" /><span>Split</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan-400" /><span>Merge Table</span></div>
            </div>

            <div className="flex-1 p-8 overflow-auto bg-white relative">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-8 max-w-7xl mx-auto">
                {filteredTables.map((table) => {
                  const menuItems = getMenuItemsForTable(table.status);
                  const isReserved = table.status === 'reserved';
                  const isOnDine = table.status === 'on-dine';
                  
                  return (
                    <div key={table.tableId} className="relative flex flex-col items-center">
                      <button
                        onClick={() => handleTableClick(table.tableId)}
                        className={`relative w-36 h-36 rounded-full flex flex-col items-center justify-center text-white font-semibold text-base shadow-md transition-all duration-200 border-4 ${getStatusColor(table.status)} ${getStatusBorderColor(table.status)}`}
                      >
                        {/* Table Number */}
                        <span className="text-lg">Table #{table.tableId}</span>
                        
                        {/* Status Text */}
                        <span className="text-xs font-normal opacity-90 mt-1 capitalize">
                          {table.status === 'on-dine' ? 'On Dine' : table.status}
                        </span>
                        
                        {/* Reserved Info */}
                        {isReserved && table.reservedBy && (
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-green-700 px-3 py-1 rounded-full text-xs font-semibold shadow-md border border-green-300 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {table.reservedBy.guestName}
                          </div>
                        )}
                        
                        {/* On Dine Indicator */}
                        {isOnDine && (
                          <div className="absolute -top-2 -right-2 bg-white text-red-700 p-2 rounded-full shadow-lg border-2 border-red-400 animate-pulse">
                            <Utensils className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                      
                      {/* Reservation Details Tooltip */}
                      {isReserved && table.reservedBy && (
                        <div className="mt-3 bg-white rounded-lg shadow-sm border border-gray-200 p-3 text-xs w-40">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-3 h-3 text-gray-500" />
                            <span className="font-semibold text-gray-700">{table.reservedBy.guestName}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-1 text-gray-600">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{table.reservedBy.guestPhone}</span>
                          </div>
                          {table.reservedBy.partySize && (
                            <div className="flex items-center gap-2 mb-1 text-gray-600">
                              <Users className="w-3 h-3" />
                              <span>{table.reservedBy.partySize} guests</span>
                            </div>
                          )}
                          {table.reservedBy.reservationTime && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(table.reservedBy.reservationTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {openTableMenu === table.tableId && (
                        <div className="absolute z-50 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-1 text-sm font-medium text-gray-700" style={{ top: '100%' }}>
                          {menuItems.map((item) => (
                            <button
                              key={item.action}
                              onClick={() => handleAction(item.action, table.tableId)}
                              className={`w-full text-left px-4 py-2.5 flex items-center gap-2 transition-colors ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                              {item.action === 'dine-in' && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              )}
                              {item.action === 'reserve' && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              )}
                              {(item.action === 'cancel-dine-in' || item.action === 'cancel-reserve') && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                              {item.action === 'split' && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4M4 17h12m0 0l-4-4m4 4l-4 4" />
                                </svg>
                              )}
                              {item.action === 'merge' && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16m0 0l-4 4m4-4l-4-4M20 17H4m0 0l4-4m-4 4l4 4" />
                                </svg>
                              )}
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {openTableMenu && (
                <div className="fixed inset-0 z-40" onClick={() => setOpenTableMenu(null)} />
              )}
            </div>
          </div>
        )}

        {activeTab === 'KOT' && <KOTContent />}
      </div>

      <ReservationModal
        isOpen={showReservationModal}
        onClose={handleCloseModal}
        onSubmit={handleReservationSubmit}
        reservationData={reservationData}
        setReservationData={setReservationData}
        selectedTableId={selectedTableForReservation}
      />
    </div>
  );
};

export default POSContent;