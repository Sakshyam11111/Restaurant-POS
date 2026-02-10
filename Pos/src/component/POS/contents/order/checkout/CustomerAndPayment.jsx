import React from 'react';

const paymentMethods = [
  { id: 'cash', name: 'Cash', icon: '💵', color: 'bg-green-50 border-green-300' },
  { id: 'qr', name: 'QR', icon: '📱', color: 'bg-blue-50 border-blue-300' },
  { id: 'bank', name: 'Bank Transfer', icon: '🏦', color: 'bg-purple-50 border-purple-300' },
  { id: 'credit', name: 'Credit', icon: '💳', color: 'bg-indigo-50 border-indigo-300' },
  { id: 'partial', name: 'Partial', icon: '🤝', color: 'bg-orange-50 border-orange-300' }
];

const CustomerAndPayment = ({
  customerInfo,
  setCustomerInfo,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  paymentAmounts,
  setPaymentAmounts
}) => {
  const handleAmountChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    const newAmounts = { ...paymentAmounts, [field]: value };

    if (field === 'amount' || field === 'tenderAmount') {
      const amount = field === 'amount' ? numValue : parseFloat(paymentAmounts.amount) || 0;
      const tender = field === 'tenderAmount' ? numValue : parseFloat(paymentAmounts.tenderAmount) || 0;
      newAmounts.changeAmount = Math.max(0, tender - amount).toFixed(2);
    }

    setPaymentAmounts(newAmounts);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Customer</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter customer to assign"
            value={customerInfo}
            onChange={(e) => setCustomerInfo(e.target.value)}
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment method</h3>

        <div className="grid grid-cols-5 gap-3 mb-6">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedPaymentMethod(method.name)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPaymentMethod === method.name
                  ? method.color + ' border-current'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{method.icon}</div>
              <div className="text-sm font-medium text-gray-700">{method.name}</div>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rs</span>
              <input
                type="number"
                placeholder="0.00"
                value={paymentAmounts.amount}
                onChange={(e) => handleAmountChange('amount', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tender Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rs</span>
              <input
                type="number"
                placeholder="0.00"
                value={paymentAmounts.tenderAmount}
                onChange={(e) => handleAmountChange('tenderAmount', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Change Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rs</span>
              <input
                type="number"
                placeholder="0.00"
                value={paymentAmounts.changeAmount}
                readOnly
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerAndPayment;