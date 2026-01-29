import React from 'react';

const TableContent = ({ orders, onCardClick }) => {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => {
                    const isDineIn = order.type === 'Dine In';

                    return (
                        <div
                            key={order.id}
                            onClick={() => onCardClick(order)} 
                            className={`bg-white rounded-2xl p-6 shadow-md border-2 cursor-pointer
                                ${isDineIn
                                    ? 'border-[#FFB5BB] bg-gradient-to-br from-[#FFF2F3] to-[#FFFAFA]'
                                    : 'border-[#70BAEB] bg-gradient-to-br from-[#F2F8FF] to-[#FAFDFF]'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-5">
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-1">{order.table}</h3>
                                    <div className={`flex items-center gap-2 text-sm font-medium ${isDineIn ? 'text-red-600' : 'text-blue-700'}`}>
                                        <span className={`w-3 h-3 rounded-full ${isDineIn ? 'bg-red-600' : 'bg-blue-500'}`} />
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
                                        <div key={i} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-700 font-medium truncate pr-2">{name}</span>
                                            <span className="text-gray-900 font-bold">×{qty}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className={`pt-5 border-t-2 ${isDineIn ? 'border-pink-200' : 'border-blue-200'} flex items-center justify-between`}>
                                <span className="text-gray-600 font-medium text-sm">Total Items</span>
                                <span className="text-2xl font-extrabold text-gray-900">
                                    {order.total}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TableContent;