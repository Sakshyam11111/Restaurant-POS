import { QrCode } from 'lucide-react';
import React, { useState } from 'react';

const Table = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    tableNumber: '',
    tableName: '',
    seatingCapacity: '',
    status: 'Active',
    zone: 'Main Hall',
  });
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);

  const handleShowForm = () => setShowForm(true);

  const handleHideForm = () => {
    setShowForm(false);
    setFormData({
      tableNumber: '',
      tableName: '',
      seatingCapacity: '',
      status: 'Active',
      zone: 'Main Hall',
    });
    setQrCodeGenerated(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateQRCode = () => {
    setQrCodeGenerated(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New table saved:', formData);
    handleHideForm();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Table</h1>
        <div className="flex gap-3">
          {!showForm && (
            <button
              onClick={handleShowForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white text-sm font-medium rounded-lg hover:brightness-105 transition"
            >
              <span className="text-lg font-bold">+</span>
              Add Table
            </button>
          )}
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <span className="text-lg">↓</span>
            Generate Excel
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="space-y-6">
          {/* Card 1: Table Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 sm:px-8 lg:px-10 pt-8 pb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Add New Table
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Table Number
                    </label>
                    <input
                      type="number"
                      name="tableNumber"
                      value={formData.tableNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Table Name
                    </label>
                    <input
                      type="text"
                      name="tableName"
                      value={formData.tableName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Seating Capacity
                    </label>
                    <input
                      type="number"
                      name="seatingCapacity"
                      value={formData.seatingCapacity}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Zone
                    </label>
                    <select
                      name="zone"
                      value={formData.zone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="Main Hall">Main Hall</option>
                      <option value="Outdoor">Outdoor</option>
                      <option value="Private Room">Private Room</option>
                      <option value="Bar">Bar</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Card 2: QR Code Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 sm:px-8 lg:px-10 pt-8 pb-10">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                QR Code Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <button
                    type="button"
                    onClick={handleGenerateQRCode}
                    className="flex items-center px-5 py-2.5 bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-100 transition mb-6"
                  >
                    <QrCode className="mr-2" />
                    Generate QR Code
                  </button>

                  <div className="space-y-3 bg-white p-5 rounded-lg">
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-700 w-32">Table Number:</span>
                      <span className="text-sm text-gray-600">
                        {qrCodeGenerated ? formData.tableNumber : '—'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-700 w-32">Table Name:</span>
                      <span className="text-sm text-gray-600">
                        {qrCodeGenerated ? formData.tableName : '—'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-700 w-32">Location:</span>
                      <span className="text-sm text-gray-600">
                        {qrCodeGenerated ? formData.zone : '—'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-700 w-32">Capacity:</span>
                      <span className="text-sm text-gray-600">
                        {qrCodeGenerated ? formData.seatingCapacity : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-96 h-56 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white">
                    {qrCodeGenerated ? (
                      <div className="text-center">
                        <div className="w-40 h-40 mx-auto bg-white rounded-lg shadow-inner flex items-center justify-center">
                          <span className="text-gray-400 text-sm">QR Code</span>
                        </div>
                        <p className="mt-3 text-sm text-gray-500">Ready to scan</p>
                      </div>
                    ) : (
                      <span className="flex flex-col items-center text-gray-400 text-center px-6">
                        <QrCode className="mb-2 w-20 h-20 text-gray-300" />
                        QR Code will appear here after generation
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons - placed at the bottom */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleHideForm}
              className="px-8 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-8 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white font-medium rounded-lg hover:brightness-105 transition"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 flex items-center justify-center bg-gray-50 rounded-full border border-gray-200">
              <svg
                viewBox="0 0 320 320"
                xmlns="http://www.w3.org/2000/svg"
                className="w-20 h-20 text-gray-400"
              >
                <rect x="10" y="10" width="300" height="300" rx="80" ry="80" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                <rect x="50" y="50" width="220" height="220" rx="60" ry="60" fill="none" stroke="#D1D5DB" strokeWidth="3" />
                <rect x="90" y="90" width="140" height="140" rx="40" ry="40" fill="none" stroke="#D1D5DB" strokeWidth="3" />
                <g stroke="#9CA3AF" strokeWidth="10" strokeLinecap="round">
                  <line x1="160" y1="130" x2="160" y2="190" />
                  <line x1="130" y1="160" x2="190" y2="160" />
                </g>
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Ooops! No Table created yet...
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-md">
            There's nothing to view right now. Please create a new<br />
            Table to get started.
          </p>

          <button
            onClick={handleShowForm}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition shadow-sm text-lg"
          >
            Create Table
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;