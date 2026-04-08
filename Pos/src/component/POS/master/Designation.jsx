import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { designationAPI } from '../../../services/api';

const Designation = () => {
  const [showForm,      setShowForm]      = useState(false);
  const [designations,  setDesignations]  = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [searchTerm,    setSearchTerm]    = useState('');
  const [editingId,     setEditingId]     = useState(null);
  const [formData,      setFormData]      = useState({ designationName: '', description: '', status: 'Active' });

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchDesignations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await designationAPI.getDesignations();
      setDesignations(res.data?.designations || []);
    } catch (err) {
      toast.error('Failed to load designations');
      console.error('fetchDesignations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDesignations(); }, [fetchDesignations]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ designationName: '', description: '', status: 'Active' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.designationName.trim()) {
      toast.error('Designation name is required');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await designationAPI.updateDesignation(editingId, formData);
        toast.success('Designation updated successfully');
      } else {
        await designationAPI.createDesignation(formData);
        toast.success('Designation created successfully');
      }
      await fetchDesignations();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save designation');
    } finally {
      setSaving(false);
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const handleEdit = (designation) => {
    setFormData({
      designationName: designation.designationName,
      description:     designation.description || '',
      status:          designation.status,
    });
    setEditingId(designation._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this designation?')) return;
    try {
      await designationAPI.deleteDesignation(id);
      toast.success('Designation deleted successfully');
      setDesignations((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete designation');
    }
  };

  // ── CSV Export ────────────────────────────────────────────────────────────
  const generateExcel = () => {
    const headers = ['Designation Name', 'Description', 'Status', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...designations.map((d) => [
        d.designationName,
        d.description || '',
        d.status,
        new Date(d.createdAt).toLocaleDateString(),
      ].join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'designations.csv';
    a.click();
  };

  const filteredDesignations = designations.filter((d) =>
    d.designationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Designation</h1>
        <div className="flex gap-3">
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white text-sm font-medium rounded-lg hover:brightness-105 transition"
            >
              <span className="text-lg font-bold">+</span> Add Designation
            </button>
          )}
          <button
            onClick={generateExcel}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg">↓</span> Generate Excel
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="px-6 sm:px-8 lg:px-10 pt-8 pb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              {editingId ? 'Edit Designation' : 'Add New Designation'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Designation Name</label>
                <input
                  type="text" name="designationName" value={formData.designationName} onChange={handleChange}
                  placeholder="Enter designation name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  name="description" value={formData.description} onChange={handleChange} rows={3}
                  placeholder="Enter description..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  name="status" value={formData.status} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-base"
                >
                  <option value="Active">● Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button type="button" onClick={resetForm} disabled={saving}
                  className="px-8 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="px-10 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white font-medium rounded-lg hover:brightness-105 transition disabled:opacity-50 flex items-center gap-2">
                  {saving && (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#487AA4]" />
        </div>
      )}

      {/* Table */}
      {!loading && designations.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text" placeholder="Search by name or description..."
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">Total: {filteredDesignations.length} designation{filteredDesignations.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Designation Name', 'Description', 'Status', 'Created Date', 'Actions'].map((h) => (
                    <th key={h} className={`px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${h === 'Actions' ? 'text-center' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDesignations.map((designation) => (
                  <tr key={designation._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{designation.designationName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{designation.description || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${designation.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {designation.status === 'Active' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5" />}
                        {designation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(designation.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(designation)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(designation._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
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

          {filteredDesignations.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">No designations found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && designations.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 flex items-center justify-center bg-gray-50 rounded-full border border-gray-200">
              <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-gray-400">
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
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Ooops! No Designation created yet...</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-md">
            There's nothing to view right now. Please create a new<br />designation to get started.
          </p>
          <button onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition shadow-sm text-lg">
            Create Designation
          </button>
        </div>
      )}
    </div>
  );
};

export default Designation;