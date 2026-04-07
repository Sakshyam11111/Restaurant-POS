import React, { useState } from 'react';

const PrintSetting = () => {
  const [showForm, setShowForm] = useState(false);
  const [printers, setPrinters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    printerName: '',
    printType: '',
    connectionType: 'Network',
    ipAddress: '',
    port: '9100',
    devicePath: '',
  });

  const [editingId, setEditingId] = useState(null);

  const printTypeOptions = [
    { value: '', label: 'Select print type' },
    { value: 'thermal', label: 'Thermal' },
    { value: 'dot-matrix', label: 'Dot Matrix' },
    { value: 'inkjet', label: 'Inkjet' },
    { value: 'laser', label: 'Laser' },
  ];

  const connectionTypeOptions = [
    { value: 'Network', label: 'Network' },
    { value: 'USB', label: 'USB' },
    { value: 'Serial', label: 'Serial' },
  ];

  const handleShowForm = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleHideForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      printerName: '',
      printType: '',
      connectionType: 'Network',
      ipAddress: '',
      port: '9100',
      devicePath: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const printerData = {
      ...formData,
      id: editingId || Date.now(),
      createdAt: editingId ? printers.find(p => p.id === editingId)?.createdAt || new Date().toLocaleDateString() : new Date().toLocaleDateString(),
    };

    if (editingId) {
      setPrinters(prev => prev.map(printer => printer.id === editingId ? printerData : printer));
    } else {
      setPrinters(prev => [...prev, printerData]);
    }

    handleHideForm();
  };

  const handleEdit = (printer) => {
    setFormData({
      printerName: printer.printerName,
      printType: printer.printType,
      connectionType: printer.connectionType,
      ipAddress: printer.ipAddress,
      port: printer.port,
      devicePath: printer.devicePath,
    });
    setEditingId(printer.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this printer setting?')) {
      setPrinters(prev => prev.filter(printer => printer.id !== id));
    }
  };

  const getPrintTypeLabel = (value) => {
    const type = printTypeOptions.find(opt => opt.value === value);
    return type ? type.label : value;
  };

  const getConnectionTypeLabel = (value) => {
    const type = connectionTypeOptions.find(opt => opt.value === value);
    return type ? type.label : value;
  };

  const getConnectionIcon = (type) => {
    switch (type) {
      case 'Network':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        );
      case 'USB':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        );
      case 'Serial':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      default:
        return null;
    }
  };

  const filteredPrinters = printers.filter(printer =>
    printer.printerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getPrintTypeLabel(printer.printType).toLowerCase().includes(searchTerm.toLowerCase()) ||
    printer.connectionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    printer.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateExcel = () => {
    const headers = ['Printer Name', 'Print Type', 'Connection Type', 'IP Address', 'Port', 'Device Path', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...printers.map(printer => [
        printer.printerName,
        getPrintTypeLabel(printer.printType),
        printer.connectionType,
        printer.ipAddress || '-',
        printer.port,
        printer.devicePath || '-',
        printer.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'printer_settings.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Printer Setting Master</h1>
        <div className="flex gap-3">
          {!showForm && (
            <button
              onClick={handleShowForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white text-sm font-medium rounded-lg hover:brightness-105 transition"
            >
              <span className="text-lg font-bold">+</span>
              Add Printer Setting
            </button>
          )}
          <button 
            onClick={generateExcel}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg">↓</span>
            Generate Excel
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 sm:px-8 lg:px-10 pt-8 pb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              {editingId ? 'Edit Printer Setting' : 'Add New Printer Setting'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Printer Name
                  </label>
                  <input
                    type="text"
                    name="printerName"
                    value={formData.printerName}
                    onChange={handleChange}
                    placeholder="Enter printer name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                    required
                  />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Print Type
                  </label>
                  <select
                    name="printType"
                    value={formData.printType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-base"
                    required
                  >
                    {printTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Connection Type
                  </label>
                  <select
                    name="connectionType"
                    value={formData.connectionType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-base"
                  >
                    {connectionTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Ip Address
                  </label>
                  <input
                    type="text"
                    name="ipAddress"
                    value={formData.ipAddress}
                    onChange={handleChange}
                    placeholder="e.g., 192.168.1.100"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Port
                  </label>
                  <input
                    type="text"
                    name="port"
                    value={formData.port}
                    onChange={handleChange}
                    placeholder="9100"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Device Path
                  </label>
                  <input
                    type="text"
                    name="devicePath"
                    value={formData.devicePath}
                    onChange={handleChange}
                    placeholder="e.g., /dev/usb/lp0 or COM1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleHideForm}
                  className="px-8 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-10 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white font-medium rounded-lg hover:brightness-105 transition"
                >
                  {editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : printers.length > 0 ? (
        // Printers Table View
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search by printer name, type, connection or IP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">
                Total: {filteredPrinters.length} printer{filteredPrinters.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Printer Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Print Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Connection</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Port</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Device Path</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPrinters.map((printer) => (
                  <tr key={printer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{printer.printerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {getPrintTypeLabel(printer.printType)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {getConnectionIcon(printer.connectionType)}
                        {printer.connectionType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 font-mono">{printer.ipAddress || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{printer.port}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 font-mono">{printer.devicePath || '-'}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {printer.createdAt}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(printer)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(printer.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPrinters.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">No printers found matching your search.</p>
            </div>
          )}
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
            Ooops! No Printer Setting created yet...
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-md">
            There's nothing to view right now. Please create a new<br />
            printer setting to get started.
          </p>

          <button
            onClick={handleShowForm}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition shadow-sm text-lg"
          >
            Create Printer Setting
          </button>
        </div>
      )}
    </div>
  );
};

export default PrintSetting;