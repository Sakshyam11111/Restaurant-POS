import React, { useState } from 'react';

const Zone = () => {
  const [showForm, setShowForm] = useState(false);
  const [zones, setZones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    zoneName: '',
    shortCode: '',
    status: 'Active',
  });

  const [editingId, setEditingId] = useState(null);

  const handleShowForm = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleHideForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      zoneName: '',
      shortCode: '',
      status: 'Active',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const zoneData = {
      ...formData,
      id: editingId || Date.now(),
      createdAt: editingId ? zones.find(z => z.id === editingId)?.createdAt || new Date().toLocaleDateString() : new Date().toLocaleDateString(),
    };

    if (editingId) {
      setZones(prev => prev.map(zone => zone.id === editingId ? zoneData : zone));
    } else {
      setZones(prev => [...prev, zoneData]);
    }

    handleHideForm();
  };

  const handleEdit = (zone) => {
    setFormData({
      zoneName: zone.zoneName,
      shortCode: zone.shortCode,
      status: zone.status,
    });
    setEditingId(zone.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this zone?')) {
      setZones(prev => prev.filter(zone => zone.id !== id));
    }
  };

  const filteredZones = zones.filter(zone =>
    zone.zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateExcel = () => {
    const headers = ['Zone Name', 'Description', 'Status', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...zones.map(zone => [
        zone.zoneName,
        zone.shortCode,
        zone.status,
        zone.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zones.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Zone</h1>
        <div className="flex gap-3">
          {!showForm && (
            <button
              onClick={handleShowForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white text-sm font-medium rounded-lg hover:brightness-105 transition shadow-sm"
            >
              <span className="text-lg font-bold">+</span>
              Add Zone
            </button>
          )}
          <button 
            onClick={generateExcel}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span className="text-lg">↓</span>
            Generate Excel
          </button>
        </div>
      </div>

      {/* Form or Table or Empty State */}
      {showForm ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 sm:px-10 lg:px-16 pt-8 pb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              {editingId ? 'Edit Zone' : 'Add New Zone'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-7 w-full">
              {/* Zone Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Zone Name
                </label>
                <input
                  type="text"
                  name="zoneName"
                  value={formData.zoneName}
                  onChange={handleChange}
                  placeholder="e.g., North Region, Warehouse A, Downtown Area"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm"
                  required
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Enter zone name
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  name="shortCode"
                  value={formData.shortCode}
                  onChange={handleChange}
                  placeholder="Enter zone description..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition shadow-sm appearance-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-8">
                <button
                  type="button"
                  onClick={handleHideForm}
                  className="px-8 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white font-medium rounded-lg hover:brightness-105 transition shadow-md"
                >
                  {editingId ? 'Update Zone' : 'Save Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : zones.length > 0 ? (
        // Zone Table View
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search by zone name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">
                Total: {filteredZones.length} zone{filteredZones.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Zone Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created Date</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredZones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{zone.zoneName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{zone.shortCode}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        zone.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {zone.status === 'Active' && (
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                        )}
                        {zone.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {zone.createdAt}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(zone)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(zone.id)}
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

          {filteredZones.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">No zones found matching your search.</p>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center mt-20 text-center px-4">
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
            No Zones Created Yet
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-md">
            You haven't added any zones yet.<br />
            Create your first zone to start organizing locations.
          </p>

          <button
            onClick={handleShowForm}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition shadow-sm text-lg"
          >
            Add New Zone
          </button>
        </div>
      )}
    </div>
  );
};

export default Zone;