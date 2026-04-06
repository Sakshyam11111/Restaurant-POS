import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import KOTContent from './KOT/KOTContent';
import OrderContent from './order/OrderContent';
import { tableAPI } from '../../../services/api';
import ReservationModal from './tableform/ReservationModal';
import { Utensils, X, User, Phone, MapPin, Clock, FileText, ShoppingBag, Truck } from 'lucide-react';

const OrderTypeModal = ({ isOpen, orderType, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    location: '',
    pickupDeliveryTime: '',
    remarks: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        customerName: '',
        phoneNumber: '',
        location: '',
        pickupDeliveryTime: '',
        remarks: '',
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isTakeaway = orderType === 'Takeaway';
  const Icon = isTakeaway ? ShoppingBag : Truck;
  const timeLabel = isTakeaway ? 'Pickup Time' : 'Delivery Time';
  const accentColor = isTakeaway ? 'orange' : 'cyan';

  const accentClasses = {
    orange: {
      header: 'from-[#487AA4] to-[#386184]',
      focus: 'focus:ring-[#386184] focus:border-[#386184]',
      button: 'bg-gradient-to-r from-[#487AA4] to-[#386184]',
    },
    cyan: {
      header: 'from-[#487AA4] to-[#386184]',
      focus: 'focus:ring-[#386184] focus:border-[#386184]',
      button: 'bg-gradient-to-r from-[#487AA4] to-[#386184]',
    },
  }[accentColor];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phoneNumber || !formData.location) {
      toast.error('Customer name, phone number and address are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({ ...formData, orderType });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (accent) =>
    `w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 ${accent} transition-all placeholder-gray-400`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className={`bg-gradient-to-r ${accentClasses.header} px-6 py-5`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{orderType} Order</h3>
                <p className="text-white/75 text-xs mt-0.5">Fill in customer details to proceed</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" />
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Enter customer name"
              required
              className={inputClass(accentClasses.focus)}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+977 98XXXXXXXX"
              required
              className={inputClass(accentClasses.focus)}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              {isTakeaway ? 'Location / Address' : 'Delivery Address'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder={isTakeaway ? 'Customer location' : 'Full delivery address'}
              required
              className={inputClass(accentClasses.focus)}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {timeLabel}
            </label>
            <input
              type="datetime-local"
              name="pickupDeliveryTime"
              value={formData.pickupDeliveryTime}
              onChange={handleChange}
              className={inputClass(accentClasses.focus)}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <FileText className="w-3.5 h-3.5 text-gray-400" />
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={3}
              placeholder={
                isTakeaway
                  ? 'Any special instructions or notes...'
                  : 'Delivery instructions, landmarks, notes...'
              }
              className={`${inputClass(accentClasses.focus)} resize-none`}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-2.5 ${accentClasses.button} text-white font-semibold rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? 'Processing...' : `Confirm ${orderType}`}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg text-sm hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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

  const [showOrderTypeModal, setShowOrderTypeModal] = useState(false);
  const [orderTypeModalType, setOrderTypeModalType] = useState('Takeaway');

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
      available: 'bg-blue-400 hover:bg-blue-500',
      reserved: 'bg-green-400 hover:bg-green-500',
      'on-dine': 'bg-red-400 hover:bg-red-500',
      split: 'bg-orange-400 hover:bg-orange-500',
      merge: 'bg-cyan-400 hover:bg-cyan-500',
    };
    return colors[status] || 'bg-gray-400 hover:bg-gray-500';
  };

  const getStatusBorderColor = (status) => {
    const colors = {
      available: 'border-blue-500',
      reserved: 'border-green-500',
      'on-dine': 'border-red-500',
      split: 'border-orange-500',
      merge: 'border-cyan-500',
    };
    return colors[status] || 'border-gray-500';
  };

  const filters = ['All', 'Reservation', 'On Dine', 'Split Table', 'Table Transfer', 'Takeaway', 'Delivery'];

  const getFilteredTables = () => {
    if (activeFilter === 'All') return tables;
    const filterMap = {
      'Reservation': 'reserved',
      'On Dine': 'on-dine',
      'Split Table': 'split',
      'Table Transfer': 'merge',
    };
    const statusKey = filterMap[activeFilter];
    if (!statusKey) return tables;
    return tables.filter((t) => t.status === statusKey);
  };

  const filteredTables = getFilteredTables();

  const handleFilterClick = (filter) => {
    if (filter === 'Takeaway' || filter === 'Delivery') {
      setOrderTypeModalType(filter);
      setShowOrderTypeModal(true);
      return;
    }
    setActiveFilter(filter);
  };

  const handleTableClick = (tableId) => {
    setOpenTableMenu((prev) => (prev === tableId ? null : tableId));
  };

  const getMenuItemsForTable = (status) => {
    switch (status) {
      case 'available':
        return [
          { action: 'dine-in', label: 'Start Dine In' },
          { action: 'reserve', label: 'Reserve Table' },
        ];
      case 'reserved':
        return [
          { action: 'dine-in', label: 'Start Dine In' },
          { action: 'cancel-reserve', label: 'Cancel Reservation', danger: true },
        ];
      case 'on-dine':
        return [
          { action: 'split', label: 'Split Table' },
          { action: 'merge', label: 'Merge Table' },
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
      handleCloseReservationModal();
      await loadTables();
    } catch (error) {
      console.error('Reservation error:', error);
      toast.error('Failed to create reservation');
    }
  };

  const handleCloseReservationModal = () => {
    setShowReservationModal(false);
    setSelectedTableForReservation(null);
    setReservationData({ guestName: '', guestPhone: '', partySize: 1, reservationTime: '' });
  };

  const handleOrderTypeSubmit = async (data) => {
    try {
      toast.success(
        `${data.orderType} order created for ${data.customerName}!`,
        { duration: 3000, position: 'top-center' }
      );
      setShowOrderTypeModal(false);

      navigate('/posmenu', {
        state: {
          orderType: data.orderType === 'Takeaway' ? 'Takeaway' : 'Delivery',
          customerName: data.customerName,
          phoneNumber: data.phoneNumber,
          location: data.location,
          pickupDeliveryTime: data.pickupDeliveryTime,
          remarks: data.remarks,
        },
      });
    } catch (error) {
      console.error('Order type submit error:', error);
      toast.error('Failed to create order. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
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

      {activeTab === 'Orders' && (
        <div className="flex-1 overflow-y-auto min-h-0">
          <OrderContent />
        </div>
      )}

      {activeTab === 'KOT' && (
        <div className="flex-1 overflow-y-auto min-h-0">
          <KOTContent />
        </div>
      )}

      {activeTab === 'Table' && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="px-6 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => {
                const isTakeaway = filter === 'Takeaway';
                const isDelivery = filter === 'Delivery';
                const isSpecial = isTakeaway || isDelivery;
                const isActive = activeFilter === filter;

                return (
                  <button
                    key={filter}
                    className={`px-4 py-1.5 text-sm font-medium rounded border transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-cyan-50 text-cyan-700 border-cyan-300 hover:bg-cyan-100'
                        : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleFilterClick(filter)}
                  >
                    {isTakeaway && <ShoppingBag className="w-3.5 h-3.5" />}
                    {isDelivery && <Truck className="w-3.5 h-3.5" />}
                    {filter}
                  </button>
                );
              })}
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-6 py-3 flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600 bg-gray-50 border-b border-gray-200">
            {[
              { color: 'bg-blue-400', label: 'Available' },
              { color: 'bg-green-400', label: 'Reserved' },
              { color: 'bg-red-400', label: 'On Dine' },
              { color: 'bg-orange-400', label: 'Split' },
              { color: 'bg-cyan-400', label: 'Merge Table' },
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

          <div className="flex-1 p-8 overflow-y-auto min-h-0 bg-white relative">
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

                        {isOnDine && (
                          <div className="absolute -top-2 -right-2 bg-white text-red-700 p-2 rounded-full shadow-lg border-2 border-red-400 animate-pulse">
                            <Utensils className="w-4 h-4" />
                          </div>
                        )}
                      </button>

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
        onClose={handleCloseReservationModal}
        onSubmit={handleReservationSubmit}
        reservationData={reservationData}
        setReservationData={setReservationData}
        selectedTableId={selectedTableForReservation}
      />

      <OrderTypeModal
        isOpen={showOrderTypeModal}
        orderType={orderTypeModalType}
        onClose={() => setShowOrderTypeModal(false)}
        onSubmit={handleOrderTypeSubmit}
      />
    </div>
  );
};

export default POSContent;