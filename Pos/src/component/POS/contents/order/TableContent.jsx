import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import POSContent from '../POSContent';
import KOTContent from '../KOT/KOTContent';

const TableContent = () => {
    const [activeTab, setActiveTab] = useState('Order');
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

    const tabContent = {
        Table: <POSContent />,
        KOT: <KOTContent />,
        Order: (
            <motion.div
                key="order"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex-1 p-4 sm:p-6 lg:p-8"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order, index) => {
                        const isDineIn = order.type === 'Dine In';

                        return (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleCardClick(order)} // Click handler
                                className={`relative bg-white rounded-2xl p-6 shadow-md border-2 cursor-pointer transition-all
                  ${isDineIn
                                        ? 'border-[#FFB5BB] bg-gradient-to-br from-[#FFF2F3] to-[#FFFAFA]'
                                        : 'border-[#70BAEB] bg-gradient-to-br from-[#F2F8FF] to-[#FAFDFF]'
                                    }`}
                            >
                                {/* Same card content as before */}
                                <div className="flex items-start justify-between mb-5">
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-900 mb-1">{order.table}</h3>
                                        <div className={`flex items-center gap-2 text-sm font-medium ${isDineIn ? 'text-red-600' : 'text-blue-700'}`}>
                                            <motion.span
                                                animate={{ opacity: [0.6, 1, 0.6] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                className={`w-3 h-3 rounded-full ${isDineIn ? 'bg-red-600' : 'bg-blue-500'}`}
                                            />
                                            <span>{order.type}</span>
                                            <span className="text-gray-600 text-sm">• KOT-{order.kot}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-medium">{order.time}</span>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                                    {order.items.map((item, i) => {
                                        const [name, qty] = item.split(' ×');
                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="flex justify-between items-center text-sm"
                                            >
                                                <span className="text-gray-700 font-medium truncate pr-2">{name}</span>
                                                <span className="text-gray-900 font-bold">×{qty}</span>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                <div className={`pt-5 border-t-2 ${isDineIn ? 'border-pink-200' : 'border-blue-200'} flex items-center justify-between`}>
                                    <span className="text-gray-600 font-medium text-sm">Total Items</span>
                                    <motion.span
                                        className="text-2xl font-extrabold text-gray-900"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        {order.total}
                                    </motion.span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        ),
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header - unchanged */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white border-b border-gray-200 px-4 sm:px-6 py-5 shadow-sm"
            >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="inline-flex bg-gray-100 rounded-xl p-1.5 shadow-inner">
                        {['Order', 'Table', 'KOT'].map((tab) => (
                            <motion.button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                whileTap={{ scale: 0.95 }}
                                className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 relative overflow-hidden
                  ${activeTab === tab ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white rounded-lg shadow-md"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{tab}</span>
                            </motion.button>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                        <motion.div whileFocus={{ scale: 1.02 }} className="relative flex-1 max-w-lg">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by KOT, Order ID, Table, Waiter..."
                                className="w-full pl-12 pr-5 py-3.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                            />
                        </motion.div>

                        <div className="flex items-center gap-3">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    style={{ colorScheme: 'light' }}
                                />
                                <div className="flex items-center gap-2.5 px-5 py-3.5 border border-gray-300 rounded-xl bg-white shadow-sm cursor-pointer hover:border-blue-500 transition-colors">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-800 font-semibold whitespace-nowrap">
                                        {formatDisplayDate(selectedDate)}
                                    </span>
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Order
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {tabContent[activeTab]}
            </AnimatePresence>
        </div>
    );
};

export default TableContent;