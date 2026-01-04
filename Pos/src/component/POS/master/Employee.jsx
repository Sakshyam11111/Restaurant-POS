// Employee.jsx
import React, { useState } from 'react';

const Employee = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Male',
    address: '',
    email: '',
    contactNumber: '',
    dateOfBirth: '',
    joiningDate: '',
    education: '',
    designation: '',
    department: '',
    status: 'Active',
    panNumber: '',
    description: '',
    username: '',
    password: '',
    photo: null,
    documents: [],
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleShowForm = () => setShowForm(true);

  const handleHideForm = () => {
    setShowForm(false);
    setFormData({
      fullName: '',
      gender: 'Male',
      address: '',
      email: '',
      contactNumber: '',
      dateOfBirth: '',
      joiningDate: '',
      education: '',
      designation: '',
      department: '',
      status: 'Active',
      panNumber: '',
      description: '',
      username: '',
      password: '',
      photo: null,
      documents: [],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
    }
  };

  const handleDocumentsChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, documents: [...prev.documents, ...files] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New employee data:', formData);
    handleHideForm();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Employee</h1>
        <div className="flex gap-3">
          {!showForm && (
            <button
              onClick={handleShowForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white text-sm font-medium rounded-lg hover:brightness-105 transition"
            >
              <span className="text-lg font-bold">+</span>
              Add Employee
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
          <form onSubmit={handleSubmit}>
            {/* Main grid - three columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Card - Employee Details */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Add New Employee</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      required
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter Address"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="employee@gmail.com"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="+977 0000 000 000"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        placeholder="mm/dd/yyyy"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Joining Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleChange}
                        placeholder="mm/dd/yyyy"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="e.g., Bachelor's Degree"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      Designation
                      <button type="button" className="text-blue-600 text-lg font-bold">+</button>
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="e.g., Chef, Manager"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      Department
                      <button type="button" className="text-blue-600 text-lg font-bold">+</button>
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g., Kitchen, Service"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm"
                    >
                      <option value="Active">● Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* PAN Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      placeholder="e.g., ABCDE1234F"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>

                  {/* Description - Full Width */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none"
                      placeholder="Enter description..."
                    />
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Photo and Documents */}
              <div className="space-y-6">
                {/* Photo Upload Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-300 flex items-center justify-center overflow-hidden mb-4">
                      {formData.photo ? (
                        <img
                          src={URL.createObjectURL(formData.photo)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition text-sm font-medium flex items-center gap-2">
                      <span>↑</span> Upload Photo
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                    <p className="mt-2 text-xs text-gray-500 text-center">Max file size: 5MB (JPG, PNG, GIF)</p>
                  </div>
                </div>

                {/* Documents Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <label className="block text-sm font-medium text-gray-900 mb-3">Documents</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-8 h-8 mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-blue-600 font-medium">Click to add or drop here.</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      onChange={handleDocumentsChange}
                      className="hidden"
                    />
                  </label>
                  {formData.documents.length > 0 && (
                    <p className="mt-2 text-sm text-gray-600">
                      {formData.documents.length} file(s) selected
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile App Credentials Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">User Password for Mobile App</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter secure password"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-4 pt-6 mt-6">
              <button
                type="submit"
                className="px-16 py-3 bg-gradient-to-r from-[#487AA4] to-[#5a8eb8] text-white font-medium rounded-md hover:brightness-105 transition text-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleHideForm}
                className="px-12 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Empty state
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
            Ooops! No Employees added yet...
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-md">
            There's nothing to view right now. Please add a new<br />
            employee to get started.
          </p>

          <button
            onClick={handleShowForm}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition shadow-sm text-lg"
          >
            Add Employee
          </button>
        </div>
      )}
    </div>
  );
};

export default Employee;