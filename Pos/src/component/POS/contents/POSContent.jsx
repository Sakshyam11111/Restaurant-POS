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

  // FIX: activeFilter is now actually used to filter the tables grid
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
    const interval = setInterval(() => loadTables(), 30000);
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      clearInterval(interval);
    };
  }, [activeFloor]);

  const removeDuplicateTables = (tablesArray) => {
    const seen = new Set();
    return tablesArray.filter((table) => {
      const duplicate = seen.has(table.tableId);
      seen.add(table.tableId);
      return !duplicate;
    });
  };

  const loadTables = async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const response = await tableAPI.getAllTables(activeFloor, {
        signal: abortControllerRef.current.signal,
      });

      if (response.data.tables.length === 0) {
        await tableAPI.initializeTables({ signal: abortControllerRef.current.signal });
        const finalResponse = await tableAPI.getAllTables(activeFloor, {
          signal: abortControllerRef.current.signal,
        });
        setTables(removeDuplicateTables(finalResponse.data.tables));
      } else {
        setTables(removeDuplicateTables(response.data.tables));
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error loading tables:', error);
      toast.error('Failed to load tables');
      const fallbackTables = Array.from({ length: 15 }, (_, i) => ({
        tableId: i + 1,
        status: 'available',
        floor: activeFloor,
      }));
      setTables(fallbackTables);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      available:  'bg-blue-400 hover:bg-blue-500',
      reserved:   'bg-green-400 hover:bg-green-500',
      'on-dine':  'bg-red-400 hover:bg-red-500',
      split:      'bg-orange-400 hover:bg-orange-500',
      merge:      'bg-cyan-400 hover:bg-cyan-500',
    };
    return colors[status] || 'bg-gray-400 hover:bg-gray-500';
  };

  const getStatusBorderColor = (status) => {
    const colors = {
      available:  'border-blue-500',
      reserved:   'border-green-500',
      'on-dine':  'border-red-500',
      split:      'border-orange-500',
      merge:      'border-cyan-500',
    };
    return colors[status] || 'border-gray-500';
  };

  const filters = ['All', 'Reservation', 'On Dine', 'Takeaway', 'Delivery', 'Split Table', 'Table Transfer'];

  // FIX: actually filter tables based on activeFilter
  const getFilteredTables = () => {
    if (activeFilter === 'All') return tables;

    const filterMap = {
      'Reservation':      'reserved',
      'On Dine':          'on-dine',
      'Split Table':      'split',
      'Table Transfer':   'merge',
      // Takeaway and Delivery are order types, not table statuses.
      // We surface available tables for those modes.
      'Takeaway':         'available',
      'Delivery':         'available',
    };

    const statusKey = filterMap[activeFilter];
    if (!statusKey) return tables;
    return tables.filter((t) => t.status === statusKey);
  };

  const filteredTables = getFilteredTables();

  const handleTableClick = (tableId) => {
    setOpenTableMenu((prev) => (prev === tableId ? null : tableId));
  };

  const getMenuItemsForTable = (status) => {
    switch (status) {
      case 'available':
        return [
          { action: 'dine-in',  label: 'Start Dine In' },
          { action: 'reserve',  label: 'Reserve Table' },
        ];
      case 'reserved':
        return [
          { action: 'dine-in',        label: 'Start Dine In' },
          { action: 'cancel-reserve', label: 'Cancel Reservation', danger: true },
        ];
      case 'on-dine':
        return [
          { action: 'split',          label: 'Split Table' },
          { action: 'merge',          label: 'Merge Table' },
          { action: 'cancel-dine-in', label: 'End Dine In', danger: true },
        ];
      default:
        return [{ action: 'dine-in', label: 'Start Dine In' }];
    }
  };

  const handleAction = async (action, tableId) => {
    setOpenTableMenu(null);
    try {
      switch (action) {
        case 'dine-in':
          await tableAPI.startDining(tableId);
          toast.success(`Dine In started for Table #${tableId}`);
          await loadTables();
          navigate('/posmenu', {
            state: {
              tableId,
              tableNumber: `Table #${tableId}`,
              orderType: 'Dine in',
              floor: activeFloor,
            },
          });
          break;
        case 'reserve':
          setSelectedTableForReservation(tableId);
          setShowReservationModal(true);
          break;
        case 'cancel-dine-in':
          await tableAPI.endDining(tableId);
          toast.success(`Dine In ended for Table #${tableId}`);
          await loadTables();
          break;
        case 'cancel-reserve':
          await tableAPI.cancelReservation(tableId);
          toast.success(`Reservation cancelled for Table #${tableId}`);
          await loadTables();
          break;
        case 'split':
          toast(`Split Table for #${tableId} — coming soon`);
          break;
        case 'merge':
          toast(`Merge Table for #${tableId} — coming soon`);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Table action error:', error);
      toast.error('Action failed. Please try again.');
    }
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    try {
      await tableAPI.reserveTable(selectedTableForReservation, reservationData);
      toast.success(`Table #${selectedTableForReservation} reserved successfully`);
      handleCloseModal();
      await loadTables();
    } catch (error) {
      console.error('Reservation error:', error);
      toast.error('Failed to create reservation');
    }
  };

  const handleCloseModal = () => {
    setShowReservationModal(false);
    setSelectedTableForReservation(null);
    setReservationData({ guestName: '', guestPhone: '', partySize: 1, reservationTime: '' });
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Tab Bar */}
      <div className="border-b border-gray-200 px-6 pt-4">
        <div className="flex gap-1">
          {['Table', 'Orders', 'KOT'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#487AA4] to-[#386184] text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Tab */}
      {activeTab === 'Orders' && <OrderContent />}

      {/* KOT Tab */}
      {activeTab === 'KOT' && <KOTContent />}

      {/* Table Tab */}
      {activeTab === 'Table' && (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Filter bar */}
          <div className="px-6 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-1.5 text-sm font-medium rounded border transition-colors ${
                    activeFilter === filter
                      ? 'bg-gradient-to-r from-[#487AA4] to-[#386184] border-[#487AA4] text-white'
                      : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {['First Floor', 'Second Floor'].map((floor) => (
                <button
                  key={floor}
                  className={`px-4 py-1.5 text-sm font-medium rounded border transition-colors ${
                    activeFloor === floor
                      ? 'bg-gradient-to-r from-[#487AA4] to-[#386184] text-white border-[#487AA4]'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setActiveFloor(floor)}
                >
                  {floor}
                </button>
              ))}
              <button
                onClick={loadTables}
                className="p-2 bg-white border border-gray-300 rounded hover:border-gray-400"
                title="Refresh tables"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="px-6 py-3 flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600 bg-gray-50 border-b border-gray-200">
            {[
              { color: 'bg-blue-400',   label: 'Available' },
              { color: 'bg-green-400',  label: 'Reserved' },
              { color: 'bg-red-400',    label: 'On Dine' },
              { color: 'bg-orange-400', label: 'Split' },
              { color: 'bg-cyan-400',   label: 'Merge Table' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span>{label}</span>
              </div>
            ))}
            <span className="ml-auto text-xs text-gray-400">
              {filteredTables.length} of {tables.length} table{tables.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Table grid */}
          <div className="flex-1 p-8 overflow-auto bg-white relative">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#487AA4] mx-auto" />
                  <p className="mt-3 text-sm text-gray-500">Loading tables…</p>
                </div>
              </div>
            ) : filteredTables.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No tables match the selected filter.
              </div>
            ) : (
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
                        <span className="text-lg">Table #{table.tableId}</span>
                        <span className="text-xs font-normal opacity-90 mt-1 capitalize">
                          {table.status === 'on-dine' ? 'On Dine' : table.status}
                        </span>

                        {isReserved && table.reservedBy && (
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-green-700 px-3 py-1 rounded-full text-xs font-semibold shadow-md border border-green-300 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {table.reservedBy.guestName}
                          </div>
                        )}

                        {isOnDine && (
                          <div className="absolute -top-2 -right-2 bg-white text-red-700 p-2 rounded-full shadow-lg border-2 border-red-400 animate-pulse">
                            <Utensils className="w-4 h-4" />
                          </div>
                        )}
                      </button>

                      {/* Reservation tooltip */}
                      {isReserved && table.reservedBy && (
                        <div className="mt-3 bg-white rounded-lg shadow-sm border border-gray-200 p-3 text-xs w-40">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-3 h-3 text-gray-500" />
                            <span className="font-semibold text-gray-700">{table.reservedBy.guestName}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-1 text-gray-600">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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
                              <span>
                                {new Date(table.reservedBy.reservationTime).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Context menu */}
                      {openTableMenu === table.tableId && (
                        <div
                          className="absolute z-50 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-1 text-sm font-medium text-gray-700"
                          style={{ top: '100%' }}
                        >
                          {menuItems.map((item) => (
                            <button
                              key={item.action}
                              onClick={() => handleAction(item.action, table.tableId)}
                              className={`w-full text-left px-4 py-2.5 flex items-center gap-2 transition-colors ${
                                item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {openTableMenu && (
              <div className="fixed inset-0 z-40" onClick={() => setOpenTableMenu(null)} />
            )}
          </div>
        </div>
      )}

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