// UnitMeasure.jsx
import React, { useState } from 'react';

const UnitMeasure = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    unitName: '',
    shortName: '',
    conversionFactor: '1',
    status: 'Active',
  });

  const handleShowForm = () => setShowForm(true);

  const handleHideForm = () => {
    setShowForm(false);
    setFormData({
      unitName: '',
      shortName: '',
      conversionFactor: '1',
      status: 'Active',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-fill short name for common units (expand as needed)
    if (name === 'unitName' && value) {
      const shortNameMap = {
        Kilogram: 'kg',
        Gram: 'g',
        Liter: 'L',
        Milliliter: 'mL',
        Piece: 'pc',
        Box: 'bx',
        Meter: 'm',
        Centimeter: 'cm',
        Kilometer: 'km',
        Unit: 'u',
        Package: 'pkg',
      };
      if (shortNameMap[value]) {
        setFormData((prev) => ({ ...prev, shortName: shortNameMap[value] }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New unit of measure saved:', formData);
    handleHideForm();
  };

  const hasUnits = false;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Unit Measurement</h1>
        <div className="flex gap-3">
          {!showForm && (
            <button
              onClick={handleShowForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white text-sm font-medium rounded-lg hover:brightness-105 transition"
            >
              <span className="text-lg font-bold">+</span>
              Add Unit Master
            </button>
          )}
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <span className="text-lg">↓</span>
            Generate Excel
          </button>
        </div>
      </div>

      {/* Form or Empty State */}
      {showForm ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 sm:px-10 lg:px-12 pt-8 pb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              Add New Unit Measurement
            </h2>

            <form onSubmit={handleSubmit} className="space-y-7 w-full">
              {/* Unit Name */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Unit Name
                </label>
                <select
                  name="unitName"
                  value={formData.unitName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition appearance-none shadow-sm"
                  required
                >
                  <option value="">Select a unit</option>
                  <option value="Kilogram">Kilogram</option>
                  <option value="Gram">Gram</option>
                  <option value="Liter">Liter</option>
                  <option value="Milliliter">Milliliter</option>
                  <option value="Piece">Piece</option>
                  <option value="Box">Box</option>
                  <option value="Meter">Meter</option>
                  <option value="Centimeter">Centimeter</option>
                  <option value="Kilometer">Kilometer</option>
                  <option value="Unit">Unit</option>
                  <option value="Package">Package</option>
                </select>
                <p className="mt-1.5 text-xs text-gray-500">
                  Full descriptive name of the unit
                </p>
              </div>

              {/* Short Name */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Short Name
                </label>
                <input
                  type="text"
                  name="shortName"
                  value={formData.shortName}
                  onChange={handleChange}
                  placeholder="Auto-filled from selected unit"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm"
                />
              </div>

              {/* Conversion Factor */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Conversion Factor
                </label>
                <input
                  type="number"
                  name="conversionFactor"
                  value={formData.conversionFactor}
                  onChange={handleChange}
                  step="any"
                  min="0.00000001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm"
                  required
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Only positive decimal numbers allowed
                </p>
              </div>

              {/* Status */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition appearance-none shadow-sm"
                >
                  <option value="Active"><span className='bg-green-600'>●</span> Active</option>
                  <option value="Inactive"><span className='bg-red-600'>●</span>Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-6">
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
                  Save Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center mt-16 md:mt-24 text-center px-4">
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
            No Units of Measurement Created Yet
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-md">
            You haven't added any units yet.<br />
            Create your first unit of measurement to get started.
          </p>

          <button
            onClick={handleShowForm}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition shadow-sm text-lg"
          >
            <span className="text-2xl font-bold">+</span>
            Add Measurement
          </button>
        </div>
      )}
    </div>
  );
};

export default UnitMeasure;