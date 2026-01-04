import React, { useState } from 'react';

const Employeeshifts = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    shiftName: '',
    startTime: '',
    endTime: '',
    status: 'Active',
  });

  const handleShowForm = () => setShowForm(true);

  const handleHideForm = () => {
    setShowForm(false);
    setFormData({
      shiftName: '',
      startTime: '',
      endTime: '',
      status: 'Active',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New shift saved:', formData);
    handleHideForm();
  };

  const hasShifts = false;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Employee Shift</h1>
        <div className="flex gap-3">
          {!showForm && (
            <button
              onClick={handleShowForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white text-sm font-medium rounded-lg hover:brightness-105 transition"
            >
              <span className="text-lg font-bold">+</span>
              Add Employee Shift
            </button>
          )}
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <span className="text-lg">↓</span>
            Generate Excel
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 sm:px-8 lg:px-10 pt-8 pb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              Add Employee Shift
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Shift Name
                </label>
                <input
                  type="text"
                  name="shiftName"
                  value={formData.shiftName}
                  onChange={handleChange}
                  placeholder="Morning"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Shift Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                    required
                  />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Shift End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                    required
                  />
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
                  Save
                </button>
              </div>
            </form>
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
            Ooops! No Employee Shift created yet...
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-md">
            There's nothing to view right now. Please create a new<br />
            employee shift to get started.
          </p>

          <button
            onClick={handleShowForm}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition shadow-sm text-lg"
          >
            Create Employee Shift
          </button>
        </div>
      )}
    </div>
  );
};

export default Employeeshifts;