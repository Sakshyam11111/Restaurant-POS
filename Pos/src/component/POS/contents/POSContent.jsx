import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import TableContent from './order/TableContent';
import KOTContent from './KOT/KOTContent';
import { orderAPI } from '../../../services/api';

const POSContent = () => {
    const [activeTab, setActiveTab] = useState('Table');
    const navigate = useNavigate();

    const [activeFloor, setActiveFloor] = useState('First Floor');
    const [activeFilter, setActiveFilter] = useState('All');
    const [openTableMenu, setOpenTableMenu] = useState(null);

    const [tables, setTables] = useState(() =>
        Array.from({ length: 15 }, (_, i) => ({ id: i + 1, status: 'available' }))
    );

    const getStatusColor = (status) => {
        const colors = {
            available: 'bg-blue-400',
            reserved: 'bg-green-400',
            'on-dine': 'bg-red-400',
            split: 'bg-orange-400',
            merge: 'bg-cyan-400'
        };
        return colors[status] || 'bg-gray-400';
    };

    const filters = ['All', 'Reservation', 'On Dine', 'Takeaway', 'Delivery', 'Split Table', 'Table Transfer'];

    const handleTableClick = (tableId) => {
        setOpenTableMenu(prev => prev === tableId ? null : tableId);
    };

    const updateTableStatus = (tableId, newStatus) => {
        setTables(prev =>
            prev.map(t => t.id === tableId ? { ...t, status: newStatus } : t)
        );
    };

    const handleAction = (action, tableId) => {
        setOpenTableMenu(null);

        switch (action) {
            case 'dine-in':
                updateTableStatus(tableId, 'on-dine');
                navigate('/posmenu', { state: { tableId } });
                break;

            case 'reserve':
                updateTableStatus(tableId, 'reserved');
                toast.success(`Table #${tableId} reserved.`);
                break;

            case 'cancel-dine-in':
                updateTableStatus(tableId, 'available');
                toast.success(`Dine In cancelled for Table #${tableId}.`);
                break;

            case 'cancel-reserve':
                updateTableStatus(tableId, 'available');
                toast.success(`Reservation cancelled for Table #${tableId}.`);
                break;

            case 'split':
                updateTableStatus(tableId, 'split');
                toast.success(`Table #${tableId} set to Split.`);
                break;

            case 'merge':
                updateTableStatus(tableId, 'merge');
                toast.success(`Table #${tableId} set to Merge.`);
                break;

            default:
                break;
        }
    };

    const getMenuItemsForTable = (status) => {
        switch (status) {
            case 'available':
                return [
                    { action: 'dine-in',  label: 'Dine In' },
                    { action: 'reserve',  label: 'Reserve' },
                ];
            case 'on-dine':
                return [
                    { action: 'cancel-dine-in', label: 'Cancel Dine In', danger: true },
                    { action: 'split',          label: 'Split Table' },
                    { action: 'merge',          label: 'Merge Table' },
                ];
            case 'reserved':
                return [
                    { action: 'cancel-reserve', label: 'Cancel Reservation', danger: true },
                    { action: 'dine-in',        label: 'Dine In' },
                ];
            case 'split':
                return [
                    { action: 'cancel-dine-in', label: 'Cancel Dine In', danger: true },
                    { action: 'merge',          label: 'Merge Table' },
                ];
            case 'merge':
                return [
                    { action: 'cancel-dine-in', label: 'Cancel Dine In', danger: true },
                    { action: 'split',          label: 'Split Table' },
                ];
            default:
                return [];
        }
    };

    const handleAddNewOrder = () => {
        navigate('/posmenu');
    };

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
                {activeTab === 'Order' && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
                        <p className="text-xl font-medium">Order list is currently disabled</p>
                        <p className="mt-2">Use Table or KOT tabs to manage operations</p>
                    </div>
                )}

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
                                <button className="p-2 bg-white border border-gray-300 rounded hover:border-gray-400">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
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
                                {tables.map((table) => {
                                    const menuItems = getMenuItemsForTable(table.status);

                                    return (
                                        <div key={table.id} className="relative flex flex-col items-center">
                                            <button
                                                onClick={() => handleTableClick(table.id)}
                                                className={`relative w-36 h-36 rounded-full flex flex-col items-center justify-center text-white font-semibold text-base shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200 ${getStatusColor(table.status)}`}
                                            >
                                                <span>Table #{table.id}</span>
                                                <span className="text-xs font-normal opacity-80 mt-0.5 capitalize">
                                                    {table.status === 'on-dine' ? 'On Dine' : table.status}
                                                </span>
                                            </button>

                                            {openTableMenu === table.id && (
                                                <div className="absolute z-50 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-1 text-sm font-medium text-gray-700"
                                                    style={{ top: '100%' }}
                                                >
                                                    {menuItems.map((item) => (
                                                        <button
                                                            key={item.action}
                                                            onClick={() => handleAction(item.action, table.id)}
                                                            className={`w-full text-left px-4 py-2.5 flex items-center gap-2 transition-colors
                                                                ${item.danger
                                                                    ? 'text-red-600 hover:bg-red-50'
                                                                    : 'text-gray-700 hover:bg-gray-50'
                                                                }`}
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
        </div>
    );
};

export default POSContent;