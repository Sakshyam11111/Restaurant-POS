import React, { useState } from 'react';

const Employeeshiftsrotation = () => {
  const [showForm, setShowForm] = useState(false);
  const [rotations, setRotations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    employeeName: '',
    shiftName: '',
    previousShiftDate: new Date().toISOString().split('T')[0],
    newShiftDate: '',
    status: 'Active',
  });

  const [editingId, setEditingId] = useState(null);

  const employeeOptions = [
    { value: '', label: 'Select employee name' },
    { value: 'john-doe', label: 'John Doe' },
    { value: 'jane-smith', label: 'Jane Smith' },
    { value: 'michael-lee', label: 'Michael Lee' },
  ];

  const shiftOptions = [
    { value: '', label: 'Select shift name' },
    { value: 'morning', label: 'Morning Shift' },
    { value: 'evening', label: 'Evening Shift' },
    { value: 'night', label: 'Night Shift' },
  ];

  const handleShowForm = () => {
    setEditingId(null);
    setFormData(prev => ({
      ...prev,
      previousShiftDate: new Date().toISOString().split('T')[0],
    }));
    setShowForm(true);
  };

  const handleHideForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      employeeName: '',
      shiftName: '',
      previousShiftDate: new Date().toISOString().split('T')[0],
      newShiftDate: '',
      status: 'Active',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const rotationData = {
      ...formData,
      id: editingId || Date.now(),
      createdAt: editingId ? rotations.find(r => r.id === editingId)?.createdAt || new Date().toLocaleDateString() : new Date().toLocaleDateString(),
    };

    if (editingId) {
      setRotations(prev => prev.map(rotation => rotation.id === editingId ? rotationData : rotation));
    } else {
      setRotations(prev => [...prev, rotationData]);
    }

    handleHideForm();
  };

  const handleEdit = (rotation) => {
    setFormData({
      employeeName: rotation.employeeName,
      shiftName: rotation.shiftName,
      previousShiftDate: rotation.previousShiftDate,
      newShiftDate: rotation.newShiftDate,
      status: rotation.status,
    });
    setEditingId(rotation.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this shift rotation?')) {
      setRotations(prev => prev.filter(rotation => rotation.id !== id));
    }
  };

  const getEmployeeName = (value) => {
    const employee = employeeOptions.find(opt => opt.value === value);
    return employee ? employee.label : value;
  };

  const getShiftName = (value) => {
    const shift = shiftOptions.find(opt => opt.value === value);
    return shift ? shift.label : value;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysDifference = (prevDate, newDate) => {
    if (!prevDate || !newDate) return null;
    const prev = new Date(prevDate);
    const newD = new Date(newDate);
    const diffTime = newD - prev;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredRotations = rotations.filter(rotation =>
    getEmployeeName(rotation.employeeName).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getShiftName(rotation.shiftName).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateExcel = () => {
    const headers = ['Employee Name', 'Shift Name', 'Previous Shift', 'New Shift', 'Days Changed', 'Status', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...rotations.map(rotation => [
        getEmployeeName(rotation.employeeName),
        getShiftName(rotation.shiftName),
        rotation.previousShiftDate,
        rotation.newShiftDate,
        getDaysDifference(rotation.previousShiftDate, rotation.newShiftDate) || 0,
        rotation.status,
        rotation.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shift_rotations.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Employee Shifts Rotation</h1>
        <div className="flex gap-3">
          {!showForm && (
            <button
              onClick={handleShowForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white text-sm font-medium rounded-lg hover:brightness-105 transition"
            >
              <span className="text-lg font-bold">+</span>
              Add Shift Rotation
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
              {editingId ? 'Edit Shift Rotation' : 'Add Shift Rotation'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Employee Name
                </label>
                <select
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-base"
                  required
                >
                  {employeeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Shift Name
                </label>
                <select
                  name="shiftName"
                  value={formData.shiftName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-base"
                  required
                >
                  {shiftOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Previous Shift
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="previousShiftDate"
                      value={formData.previousShiftDate}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                      required
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">📅</span>
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    New Shift
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="newShiftDate"
                      value={formData.newShiftDate}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                      required
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">📅</span>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-base"
                >
                  <option value="Active">● Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
      ) : rotations.length > 0 ? (
        // Rotations Table View
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search by employee or shift name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">
                Total: {filteredRotations.length} rotation{filteredRotations.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Shift</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Previous Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">New Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Change</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRotations.map((rotation) => {
                  const daysDiff = getDaysDifference(rotation.previousShiftDate, rotation.newShiftDate);
                  return (
                    <tr key={rotation.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {getEmployeeName(rotation.employeeName).split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {getEmployeeName(rotation.employeeName)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {getShiftName(rotation.shiftName)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{formatDate(rotation.previousShiftDate)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 font-medium">{formatDate(rotation.newShiftDate)}</span>
                      </td>
                      <td className="px-6 py-4">
                        {daysDiff !== null && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            daysDiff > 0 
                              ? 'bg-orange-100 text-orange-800' 
                              : daysDiff < 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {daysDiff > 0 ? '+' : ''}{daysDiff} days
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rotation.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {rotation.status === 'Active' && (
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                          )}
                          {rotation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {rotation.createdAt}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(rotation)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(rotation.id)}
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
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredRotations.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">No rotations found matching your search.</p>
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
            Ooops! No Shift Rotation created yet...
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-md">
            There's nothing to view right now. Please create a new<br />
            shift rotation to get started.
          </p>

          <button
            onClick={handleShowForm}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition shadow-sm text-lg"
          >
            Create Shift Rotation
          </button>
        </div>
      )}
    </div>
  );
};

export default Employeeshiftsrotation;