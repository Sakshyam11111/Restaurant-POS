import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { employeeAPI } from '../../../services/api';

// ── Convert a File object to a base64 data-URL string ────────────────────────
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

const defaultForm = {
  fullName: '', gender: 'Male', address: '', email: '',
  contactNumber: '', dateOfBirth: '', joiningDate: '',
  education: '', designation: '', department: '',
  status: 'Active', panNumber: '', description: '',
  username: '', password: '',
  photo: null,       // File object (new upload)
  photoBase64: '',   // base64 stored/loaded from API
  documents: [],
};

const Employee = () => {
  const [showForm,    setShowForm]    = useState(false);
  const [employees,   setEmployees]   = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [searchTerm,  setSearchTerm]  = useState('');
  const [editingId,   setEditingId]   = useState(null);
  const [formData,    setFormData]    = useState(defaultForm);
  const [showPassword, setShowPassword] = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await employeeAPI.getEmployees();
      setEmployees(res.data?.employees || []);
    } catch (err) {
      toast.error('Failed to load employees');
      console.error('fetchEmployees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(defaultForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData((prev) => ({ ...prev, photo: file }));
  };

  const handleDocumentsChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, documents: [...prev.documents, ...files] }));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }
    setSaving(true);
    try {
      // Convert photo File → base64 if a new one was selected
      let photoBase64 = formData.photoBase64 || '';
      if (formData.photo instanceof File) {
        photoBase64 = await fileToBase64(formData.photo);
      }

      const payload = {
        fullName:      formData.fullName,
        gender:        formData.gender,
        address:       formData.address,
        email:         formData.email,
        contactNumber: formData.contactNumber,
        dateOfBirth:   formData.dateOfBirth,
        joiningDate:   formData.joiningDate,
        education:     formData.education,
        designation:   formData.designation,
        department:    formData.department,
        status:        formData.status,
        panNumber:     formData.panNumber,
        description:   formData.description,
        username:      formData.username,
        photo:         photoBase64,
      };

      if (editingId) {
        await employeeAPI.updateEmployee(editingId, payload);
        toast.success('Employee updated successfully');
      } else {
        await employeeAPI.createEmployee(payload);
        toast.success('Employee created successfully');
      }

      await fetchEmployees();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save employee');
      console.error('handleSubmit:', err);
    } finally {
      setSaving(false);
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const handleEdit = async (employee) => {
    // Fetch full employee record (includes photo)
    try {
      const res = await employeeAPI.getEmployeeById(employee._id);
      const full = res.data?.employee || employee;
      setFormData({
        fullName:      full.fullName      || '',
        gender:        full.gender        || 'Male',
        address:       full.address       || '',
        email:         full.email         || '',
        contactNumber: full.contactNumber || '',
        dateOfBirth:   full.dateOfBirth   || '',
        joiningDate:   full.joiningDate   || '',
        education:     full.education     || '',
        designation:   full.designation   || '',
        department:    full.department    || '',
        status:        full.status        || 'Active',
        panNumber:     full.panNumber     || '',
        description:   full.description   || '',
        username:      full.username      || '',
        password:      '',
        photo:         null,
        photoBase64:   full.photo         || '',
        documents:     [],
      });
    } catch {
      // Fallback to list data
      setFormData({ ...defaultForm, ...employee, photo: null, photoBase64: '', documents: [] });
    }
    setEditingId(employee._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await employeeAPI.deleteEmployee(id);
      toast.success('Employee deleted successfully');
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  // ── CSV Export ────────────────────────────────────────────────────────────
  const generateExcel = () => {
    const headers = ['Full Name', 'Gender', 'Email', 'Contact', 'Department', 'Designation', 'Status', 'Joining Date'];
    const csvContent = [
      headers.join(','),
      ...employees.map((emp) => [
        emp.fullName, emp.gender, emp.email, emp.contactNumber,
        emp.department, emp.designation, emp.status, emp.joiningDate,
      ].join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
  };

  const filteredEmployees = employees.filter((emp) =>
    (emp.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.designation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Derived preview URL for photo
  const photoPreview =
    formData.photo instanceof File
      ? URL.createObjectURL(formData.photo)
      : formData.photoBase64 || null;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Employee</h1>
        <div className="flex gap-3">
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white text-sm font-medium rounded-lg hover:brightness-105 transition"
            >
              <span className="text-lg font-bold">+</span> Add Employee
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

      {/* ── Form ── */}
      {showForm && (
        <div className="space-y-6 mb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Employee Details */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  {editingId ? 'Edit Employee' : 'Add New Employee'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {[
                    { label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'Enter full name', required: true },
                    { label: 'Address', name: 'address', type: 'text', placeholder: 'Enter Address' },
                    { label: 'Email', name: 'email', type: 'email', placeholder: 'employee@gmail.com' },
                    { label: 'Contact Number', name: 'contactNumber', type: 'tel', placeholder: '+977 0000 000 000' },
                    { label: 'Date of Birth', name: 'dateOfBirth', type: 'date' },
                    { label: 'Joining Date', name: 'joiningDate', type: 'date' },
                    { label: 'Education', name: 'education', type: 'text', placeholder: "e.g., Bachelor's Degree" },
                    { label: 'Designation', name: 'designation', type: 'text', placeholder: 'e.g., Chef, Manager' },
                    { label: 'Department', name: 'department', type: 'text', placeholder: 'e.g., Kitchen, Service' },
                    { label: 'PAN Number', name: 'panNumber', type: 'text', placeholder: 'e.g., ABCDE1234F' },
                  ].map(({ label, name, type, placeholder, required }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                      <input
                        type={type} name={name} value={formData[name]} onChange={handleChange}
                        placeholder={placeholder} required={required}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                  ))}

                  {/* Gender select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Status select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm">
                      <option value="Active">● Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange}
                      rows={3} placeholder="Enter description..."
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none" />
                  </div>
                </div>
              </div>

              {/* Right: Photo + Documents */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-300 flex items-center justify-center overflow-hidden mb-4">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition text-sm font-medium flex items-center gap-2">
                      <span>↑</span> Upload Photo
                      <input type="file" accept="image/jpeg,image/png,image/gif" onChange={handlePhotoChange} className="hidden" />
                    </label>
                    <p className="mt-2 text-xs text-gray-500 text-center">Max file size: 5MB (JPG, PNG, GIF)</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <label className="block text-sm font-medium text-gray-900 mb-3">Documents</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-8 h-8 mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-blue-600 font-medium">Click to add or drop here.</p>
                    </div>
                    <input type="file" multiple onChange={handleDocumentsChange} className="hidden" />
                  </label>
                  {formData.documents.length > 0 && (
                    <p className="mt-2 text-sm text-gray-600">{formData.documents.length} file(s) selected</p>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile App Credentials */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">User Password for Mobile App</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange}
                    placeholder="Enter username"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password}
                      onChange={handleChange} placeholder="Enter secure password"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                        }
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-6 mt-6">
              <button type="submit" disabled={saving}
                className="px-16 py-3 bg-gradient-to-r from-[#487AA4] to-[#5a8eb8] text-white font-medium rounded-md hover:brightness-105 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
                {saving && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {saving ? 'Saving...' : editingId ? 'Update' : 'Save'}
              </button>
              <button type="button" onClick={resetForm} disabled={saving}
                className="px-12 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition text-sm disabled:opacity-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#487AA4]" />
        </div>
      )}

      {/* Table */}
      {!loading && employees.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text" placeholder="Search by name, email, department or designation..."
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">Total: {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Employee', 'Contact', 'Department', 'Designation', 'Status', 'Joining Date', 'Actions'].map((h) => (
                    <th key={h} className={`px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${h === 'Actions' ? 'text-center' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
                          <span className="text-sm font-medium text-blue-600">
                            {(employee.fullName || '?').split(' ').map((n) => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{employee.fullName}</div>
                          <div className="text-sm text-gray-500">{employee.email || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{employee.contactNumber || '—'}</div>
                      <div className="text-sm text-gray-500">{employee.gender}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.department || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.designation || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {employee.status === 'Active' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5" />}
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.joiningDate || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(employee)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(employee._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
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

          {filteredEmployees.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">No employees found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && employees.length === 0 && !showForm && (
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
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Ooops! No Employees added yet...</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-md">
            There's nothing to view right now. Please add a new<br />employee to get started.
          </p>
          <button onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition shadow-sm text-lg">
            Add Employee
          </button>
        </div>
      )}
    </div>
  );
};

export default Employee;