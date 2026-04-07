import React, { useState } from 'react';

const Department = () => {
  const [showForm, setShowForm] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    departmentName: '',
    departmentHead: '',
    description: '',
    status: 'Active',
  });

  const [editingId, setEditingId] = useState(null);

  const departmentHeadOptions = [
    { value: '', label: 'Select department head' },
    { value: 'john-doe', label: 'John Doe' },
    { value: 'jane-smith', label: 'Jane Smith' },
    { value: 'michael-lee', label: 'Michael Lee' },
  ];

  const handleShowForm = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleHideForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      departmentName: '',
      departmentHead: '',
      description: '',
      status: 'Active',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const departmentData = {
      ...formData,
      id: editingId || Date.now(),
      createdAt: editingId ? departments.find(d => d.id === editingId)?.createdAt || new Date().toLocaleDateString() : new Date().toLocaleDateString(),
    };

    if (editingId) {
      setDepartments(prev => prev.map(dept => dept.id === editingId ? departmentData : dept));
    } else {
      setDepartments(prev => [...prev, departmentData]);
    }

    handleHideForm();
  };

  const handleEdit = (department) => {
    setFormData({
      departmentName: department.departmentName,
      departmentHead: department.departmentHead,
      description: department.description,
      status: department.status,
    });
    setEditingId(department.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(prev => prev.filter(dept => dept.id !== id));
    }
  };

  const getDepartmentHeadName = (value) => {
    const head = departmentHeadOptions.find(opt => opt.value === value);
    return head ? head.label : value;
  };

  const filteredDepartments = departments.filter(dept =>
    dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getDepartmentHeadName(dept.departmentHead).toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateExcel = () => {
    const headers = ['Department Name', 'Department Head', 'Description', 'Status', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...departments.map(dept => [
        dept.departmentName,
        getDepartmentHeadName(dept.departmentHead),
        dept.description,
        dept.status,
        dept.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'departments.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Department</h1>
        <div className="flex gap-3">
          {!showForm && (
            <button
              onClick={handleShowForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white text-sm font-medium rounded-lg hover:brightness-105 transition"
            >
              <span className="text-lg font-bold">+</span>
              Add Department
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
              {editingId ? 'Edit Department' : 'Add New Department'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Department Name
                </label>
                <input
                  type="text"
                  name="departmentName"
                  value={formData.departmentName}
                  onChange={handleChange}
                  placeholder="Enter department name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                  required
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Department Head
                </label>
                <select
                  name="departmentHead"
                  value={formData.departmentHead}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-base"
                >
                  {departmentHeadOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter description..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y text-base"
                />
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
      ) : departments.length > 0 ? (
        // Department Table View
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search by name, head, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">
                Total: {filteredDepartments.length} department{filteredDepartments.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department Head</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created Date</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDepartments.map((department) => (
                  <tr key={department.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{department.departmentName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {getDepartmentHeadName(department.departmentHead).split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-sm text-gray-700">
                          {department.departmentHead ? getDepartmentHeadName(department.departmentHead) : '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                        {department.description || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        department.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {department.status === 'Active' && (
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                        )}
                        {department.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {department.createdAt}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(department)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(department.id)}
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

          {filteredDepartments.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">No departments found matching your search.</p>
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
            Ooops! No Department created yet...
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-md">
            There's nothing to view right now. Please create a new<br />
            department to get started.
          </p>

          <button
            onClick={handleShowForm}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition shadow-sm text-lg"
          >
            Create Department
          </button>
        </div>
      )}
    </div>
  );
};

export default Department;