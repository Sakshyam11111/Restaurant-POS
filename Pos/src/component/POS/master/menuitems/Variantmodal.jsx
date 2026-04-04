import { X, Trash2, Plus } from 'lucide-react';

const VariantModal = ({
  showVariantModal,
  resetVariantForm,
  variantsList,
  handleVariantChange,
  addVariantRow,
  removeVariantRow,
  handleSaveVariant,
}) => {
  if (!showVariantModal) return null;

  // FIX: all variantsList fields (listedPrice, grossProfit) are computed in
  // handleVariantChange inside MenuItems.jsx. They display correctly here
  // because they're passed down as props. The previous issue was that
  // VariantModal.jsx was calling handleVariantChange inline without
  // the correct onChange wiring — the existing wiring is correct.

  const allValid = variantsList.every((v) => v.name && v.price);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Variants</h2>
          <button
            type="button"
            onClick={resetVariantForm}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {variantsList.map((variant) => (
            <div key={variant.id} className="space-y-3">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Variant Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={variant.name}
                    onChange={(e) => handleVariantChange(variant.id, e)}
                    placeholder="e.g. Regular, Large, Spicy"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Variant Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(variant.id, e)}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>

                {variantsList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariantRow(variant.id)}
                    className="mb-0.5 text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Remove variant"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 text-sm p-4 bg-gray-50 rounded-lg flex-wrap">
                <div>
                  <span className="text-gray-500">Listed Price: </span>
                  <span className="font-medium text-gray-900">
                    Rs {Number(variant.listedPrice || 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-500">COGS:</span>
                  <input
                    type="number"
                    name="cogs"
                    value={variant.cogs}
                    onChange={(e) => handleVariantChange(variant.id, e)}
                    step="0.01"
                    min="0"
                    className="w-28 px-3 py-1.5 text-right border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <span className="text-gray-500">Gross Profit: </span>
                  <span className={`font-medium ${Number(variant.grossProfit) >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                    Rs {Number(variant.grossProfit || 0).toFixed(2)}
                  </span>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="setupStockConsumption"
                    checked={variant.setupStockConsumption}
                    onChange={(e) => handleVariantChange(variant.id, e)}
                    className="rounded"
                  />
                  <span className="text-blue-600 hover:text-blue-800 font-medium">
                    Setup stock consumption
                  </span>
                </label>
              </div>
            </div>
          ))}

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={addVariantRow}
              className="px-4 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white font-medium rounded-lg flex items-center gap-2 hover:brightness-105 transition"
            >
              <Plus size={18} />
              Add Another Variant
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button
            type="button"
            onClick={resetVariantForm}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveVariant}
            disabled={!allValid}
            className="px-6 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white font-medium rounded-lg hover:brightness-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Variants
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantModal;