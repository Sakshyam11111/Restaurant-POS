import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableContent from './order/TableContent';
import KOTContent from './KOT/KOTContent';

const POSContent = () => {
    const [activeTab, setActiveTab] = useState('Table'); 
    const navigate = useNavigate();

    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);

    const formatDisplayDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${year}/${month}/${day}`;
    };

    const orders = [
        { id: 1, kot: '001', table: 'Table 1', type: 'Dine In', time: '2 min ago', items: ['Burger ×1', 'Coffee ×1', 'Pizza ×1'], total: 3 },
        { id: 2, kot: '002', table: 'Table 2', type: 'Dine In', time: '4 min ago', items: ['Coffee ×2', 'Milk Tea ×2', 'Lemon Tea ×1', 'Black Tea ×1'], total: 6 },
        { id: 3, kot: '003', table: 'Table 3', type: 'Dine In', time: '5 min ago', items: ['Burger ×1', 'Milk Tea ×1', 'Milk Coffee ×1', 'Black Tea ×1'], total: 4 },
        { id: 4, kot: '004', table: 'Take away', type: 'Take Away', time: '7 min ago', items: ['Burger ×2', 'Coke ×2', 'Fanta ×2', 'Momo ×2'], total: 8 },
        { id: 5, kot: '005', table: 'Take away', type: 'Take Away', time: '10 min ago', items: ['Coffee ×2', 'Milk Tea ×2', 'Lemon Tea ×1'], total: 5 },
        { id: 6, kot: '006', table: 'Table 6', type: 'Dine In', time: '1 min ago', items: ['Milk Tea ×2', 'Lemon Tea ×1'], total: 3 },
        { id: 7, kot: '007', table: 'Table 7', type: 'Dine In', time: '7 min ago', items: ['Momo ×1', 'Chicken Chilly ×1', 'Chicken Wings ×1', 'Chilly Momo ×1', 'Pork Momo ×1'], total: 5 },
    ];

    const handleCardClick = (order) => {
        navigate(`/order/${order.id}`, { state: { order } });
    };

    const [activeFloor, setActiveFloor] = useState('First Floor');
    const [activeFilter, setActiveFilter] = useState('All');

    const tables = [
        { id: 1, status: 'available' }, { id: 2, status: 'reserved' }, { id: 3, status: 'reserved' },
        { id: 4, status: 'on-dine' }, { id: 5, status: 'on-dine' }, { id: 6, status: 'reserved' },
        { id: 7, status: 'available' }, { id: 8, status: 'on-dine' }, { id: 9, status: 'on-dine' },
        { id: 10, status: 'on-dine' }, { id: 11, status: 'available' }, { id: 12, status: 'available' },
        { id: 13, status: 'available' }, { id: 14, status: 'available' }, { id: 15, status: 'on-dine' },
    ];

    const getStatusColor = (status) => {
        const colors = { available: 'bg-blue-400', reserved: 'bg-green-400', 'on-dine': 'bg-red-400', split: 'bg-orange-400', merge: 'bg-cyan-400' };
        return colors[status] || 'bg-gray-400';
    };

    const filters = ['All', 'Reservation', 'On Dine', 'Takeaway', 'Delivery', 'Split Table', 'Table Transfer'];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-5 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Tabs */}
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
                            <div className="relative">
                                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" style={{ colorScheme: 'light' }} />
                                <div className="flex items-center gap-2.5 px-5 py-3.5 border border-gray-300 rounded-xl bg-white shadow-sm cursor-pointer hover:border-blue-500 transition-colors">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-800 font-semibold whitespace-nowrap">{formatDisplayDate(selectedDate)}</span>
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            <button className="flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Content Area */}
            <div className="flex-1">
                {activeTab === 'Order' && <TableContent orders={orders} onCardClick={handleCardClick} />}

                {activeTab === 'Table' && (
                    <div className="flex flex-col h-full">
                        <div className="bg-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200">
                            <div className="flex flex-wrap gap-3">
                                {filters.map((filter) => (
                                    <button key={filter} className={`px-5 py-2 text-sm font-medium rounded border ${activeFilter === filter ? 'bg-gradient-to-r from-[#487AA4] to-[#386184] border-[#487AA4] text-white' : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'}`} onClick={() => setActiveFilter(filter)}>{filter}</button>
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
                        <div className="flex-1 p-8 overflow-auto bg-white">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-8 max-w-7xl mx-auto">
                                {tables.map((table) => (
                                    <button key={table.id} className={`relative w-36 h-36 rounded-full flex items-center justify-center text-white font-semibold text-base shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200 ${getStatusColor(table.status)}`}>Table #{table.id}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'KOT' && <KOTContent />}
            </div>
        </div>
    );
};

export default POSContent;