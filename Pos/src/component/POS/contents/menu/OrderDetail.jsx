import React, { useState } from 'react';
import { Notebook, Pen, X } from 'lucide-react';

const OrderDetails = ({
  orderNumber,
  orderType,
  setOrderType,
  selectedWaiter,
  setSelectedWaiter,
  selectedTable,
  setSelectedTable,
  orderItems,
  setOrderItems,
  waiters,
  tables,
}) => {
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [duplicateQty, setDuplicateQty] = useState(1);

  const handleClearAll = () => setOrderItems([]);

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (itemId, change) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (itemId) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const openDuplicateModal = (item) => {
    setSelectedItem(item);
    setDuplicateQty(1);
    setShowDuplicateModal(true);
  };

  const handleDuplicateSave = () => {
    if (!selectedItem || duplicateQty < 1) return;

    const newItems = Array.from({ length: duplicateQty }, () => ({
      ...selectedItem,
    }));

    setOrderItems((prev) => [...prev, ...newItems]);
    setShowDuplicateModal(false);
    setSelectedItem(null);
    setDuplicateQty(1);
  };

  const closeDuplicateModal = () => {
    setShowDuplicateModal(false);
    setSelectedItem(null);
    setDuplicateQty(1);
  };

  const openNoteModal = (item) => {
    setSelectedItem(item);
    setNoteText(item.note || '');
    setShowNoteModal(true);
  };

  const handleSaveNote = () => {
    if (selectedItem) {
      setOrderItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? { ...item, note: noteText.trim() || undefined }
            : item
        )
      );
    }
    setShowNoteModal(false);
    setSelectedItem(null);
    setNoteText('');
  };

  const closeNoteModal = () => {
    setShowNoteModal(false);
    setSelectedItem(null);
    setNoteText('');
  };

  const charCount = noteText.length;
  const maxChars = 200;

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col relative">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
          <span className="text-lg font-semibold text-[#386890]">{orderNumber}</span>
        </div>

        <div className="flex gap-2 mb-6">
          {['Dine in', 'Takeaway', 'Delivery'].map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`flex-1 py-2.5 px-3 rounded-lg font-medium transition-colors text-sm ${
                orderType === type
                  ? 'bg-[#4682B4] text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Waiter</span>
            <select
              value={selectedWaiter}
              onChange={(e) => setSelectedWaiter(e.target.value)}
              className="text-[#386890] font-medium text-sm border-0 focus:ring-0 cursor-pointer bg-transparent"
            >
              {waiters.map((waiter) => (
                <option key={waiter.id} value={waiter.name}>
                  {waiter.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Table</span>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="text-[#386890] font-medium text-sm border-0 focus:ring-0 cursor-pointer bg-transparent"
            >
              {tables.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.id}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 text-base">Order Items</h3>
          {orderItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-[#386890] hover:text-[#487AA4] font-medium"
            >
              Clear All Items
            </button>
          )}
        </div>

        {orderItems.length === 0 ? (
          <div className="text-center text-gray-400 mt-12">
            <p className="text-sm">No items added yet</p>
            <p className="text-xs mt-1">Click on menu items to add</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
              >
                <div className="flex flex-col mb-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 text-[15px]">{item.name}</h4>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <button
                        onClick={() => openDuplicateModal(item)}
                        title="Duplicate item"
                        className="hover:text-[#386890] transition-colors"
                      >
                        <Notebook size={20} />
                      </button>
                      <button
                        onClick={() => openNoteModal(item)}
                        title="Edit item"
                        className="hover:text-[#386890] transition-colors"
                      >
                        <Pen size={20} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Remove item"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  {item.note && (
                    <p className="text-xs text-gray-600 mt-1 italic">
                      {item.note}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-medium text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-[#386890] text-white"
                    >
                      +
                    </button>
                  </div>
                  <div className="font-medium text-gray-900">
                    Rs. {item.price * item.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {orderItems.length > 0 && (
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-semibold text-gray-700">Total</span>
            <span className="text-2xl font-bold text-gray-900">Rs. {total}</span>
          </div>
          <button className="w-full py-3.5 bg-[#386890] text-white rounded-lg font-semibold">
            Place Order
          </button>
        </div>
      )}

      {showDuplicateModal && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="relative px-6 py-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                Additional Copies
              </h3>
              <button
                onClick={closeDuplicateModal}
                className="absolute top-4 right-5 text-gray-600 hover:text-gray-900 text-2xl font-bold leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="mb-5">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Item:</span> {selectedItem.name}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2 underline">
                  Extras:
                </p>
                <div className="space-y-3 pl-1">
                  <label className="flex items-center text-sm text-gray-700">
                    <input type="radio" name="qty" value="1" checked={duplicateQty === 1} onChange={() => setDuplicateQty(1)} className="mr-2" />
                    Normal copy
                  </label>
                  <label className="flex items-center text-sm text-gray-700">
                    <input type="radio" name="qty" value="2" checked={duplicateQty === 2} onChange={() => setDuplicateQty(2)} className="mr-2" />
                    2 copies
                  </label>
                  <label className="flex items-center text-sm text-gray-700">
                    <input type="radio" name="qty" value="3" checked={duplicateQty === 3} onChange={() => setDuplicateQty(3)} className="mr-2" />
                    3 copies (+ fast service)
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleDuplicateSave}
                  className="flex-1 bg-[#386890] text-white py-3 rounded-lg font-medium hover:bg-[#2f597a] transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={closeDuplicateModal}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNoteModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-500/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="relative p-5 border-b">
              <h3 className="text-lg font-semibold text-gray-900 text-center">
                Add Item Note
              </h3>
              <button
                onClick={closeNoteModal}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">Item: </span>
                <span className="text-sm text-gray-900">{selectedItem.name}</span>
              </div>

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value.slice(0, maxChars))}
                className="w-full h-28 p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-1 focus:ring-[#386890] focus:border-[#386890] text-sm"
                placeholder="Steam well / fully cooked."
                maxLength={maxChars}
              />

              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Character limit: {maxChars}</span>
                <span>{charCount}/{maxChars}</span>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSaveNote}
                  className="flex-1 bg-[#386890] text-white py-2.5 rounded font-medium hover:bg-[#2f5a7e] transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={closeNoteModal}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;