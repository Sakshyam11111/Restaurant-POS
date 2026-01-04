import { Upload, X, Edit2, Trash2, Plus } from 'lucide-react';
import React, { useState } from 'react';

const VariantModal = ({
  showVariantModal,
  resetVariantForm,
  variantsList,
  handleVariantChange,
  addVariantRow,
  removeVariantRow,
  handleSaveVariant
}) => {
  return (
    showVariantModal && (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-none flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Default Price</h2>
            <button
              type="button"
              onClick={resetVariantForm}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-6 py-6 space-y-5">
            {variantsList.map((variant, index) => (
              <div key={variant.id} className="space-y-3">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Variant Name</label>
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
                      className="mt-6 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 text-sm p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-gray-600">Listed Price: <span className="font-medium text-gray-900">Rs {variant.listedPrice}</span></span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-gray-600">COGS: <span>
                      <input
                        type="number"
                        name="cogs"
                        value={variant.cogs}
                        onChange={(e) => handleVariantChange(variant.id, e)}
                        step="0.01"
                        min="0"
                        className="w-28 px-3 py-1.5 text-right border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="0.00"
                      />
                    </span></span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-600">Gross Profit: <span className="font-medium text-green-700">Rs {variant.grossProfit}</span></span>
                  </div>

                  <div className="flex items-center h-full">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="setupStockConsumption"
                        checked={variant.setupStockConsumption}
                        onChange={(e) => handleVariantChange(variant.id, e)}
                        className="mr-2"
                      />
                      <span className="text-blue-600 hover:text-blue-800 font-medium">
                        Setup stock consumption
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={addVariantRow}
                className="px-4 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white font-medium rounded-lg flex items-center gap-2"
              >
                <Plus size={18} />
                Add Variant
              </button>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
            <button
              type="button"
              onClick={handleSaveVariant}
              disabled={!variantsList.every(v => v.name && v.price)}
              className="px-6 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white font-medium rounded-lg hover:brightness-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
            <button
              type="button"
              onClick={resetVariantForm}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

const MenuItemsTable = ({ menuItems, handleDeleteItem }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 sm:px-8 lg:px-10 pt-8 pb-10">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variants Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variants Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {menuItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.sn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {item.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.variantname || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.variantprice || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MenuItems = () => {
  const [showForm, setShowForm] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  const [formData, setFormData] = useState({
    menuGroup: 'Main Course',
    menuSubGroup: '',
    itemName: '',
    itemCode: '',
    hsCode: '',
    printType: '',
    price: '',
    category: 'Vegetarian',
    status: 'Active',
    variants: [],
  });

  const [variantsList, setVariantsList] = useState([
    { id: 1, name: '', price: '', listedPrice: '0.00', cogs: '0.00', grossProfit: '0.00', setupStockConsumption: false }
  ]);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const resetForm = () => {
    setShowForm(false);
    setFormData({
      menuGroup: 'Main Course',
      menuSubGroup: '',
      itemName: '',
      itemCode: '',
      hsCode: '',
      printType: '',
      price: '',
      category: 'Vegetarian',
      status: 'Active',
      variants: [],
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const resetVariantForm = () => {
    setVariantsList([
      { id: 1, name: '', price: '', listedPrice: '0.00', cogs: '0.00', grossProfit: '0.00', setupStockConsumption: false }
    ]);
    setShowVariantModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (id, e) => {
    const { name, value, type, checked } = e.target;

    setVariantsList(prevList =>
      prevList.map(variant => {
        if (variant.id === id) {
          if (name === 'price') {
            const price = parseFloat(value) || 0;
            const cogs = parseFloat(variant.cogs) || 0;
            const grossProfit = price - cogs;
            return {
              ...variant,
              [name]: value,
              listedPrice: price.toFixed(2),
              grossProfit: grossProfit.toFixed(2),
            };
          } else if (name === 'cogs') {
            const cogs = parseFloat(value) || 0;
            const price = parseFloat(variant.price) || 0;
            const grossProfit = price - cogs;
            return {
              ...variant,
              [name]: value,
              grossProfit: grossProfit.toFixed(2),
            };
          } else if (name === 'setupStockConsumption') {
            return {
              ...variant,
              [name]: checked,
            };
          } else {
            return {
              ...variant,
              [name]: type === 'checkbox' ? checked : value,
            };
          }
        }
        return variant;
      })
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAddVariant = () => {
    setShowVariantModal(true);
  };

  const addVariantRow = () => {
    const newId = Math.max(...variantsList.map(v => v.id), 0) + 1;
    setVariantsList([...variantsList, {
      id: newId,
      name: '',
      price: '',
      listedPrice: '0.00',
      cogs: '0.00',
      grossProfit: '0.00',
      setupStockConsumption: false
    }]);
  };

  const removeVariantRow = (id) => {
    if (variantsList.length > 1) {
      setVariantsList(variantsList.filter(variant => variant.id !== id));
    }
  };

  const handleSaveVariant = () => {
    const isValid = variantsList.every(variant => variant.name && variant.price);
    if (!isValid || !formData.itemName) return;

    variantsList.forEach((variant, index) => {
      const newItem = {
        id: Date.now() + index,
        sn: menuItems.length + index + 1,
        name: formData.itemName,
        price: formData.price || variant.price,
        category: formData.category || 'Vegetarian',
        status: formData.status || 'Active',
        variantname: variant.name,
        variantprice: variant.price,
        menuGroup: formData.menuGroup,
        menuSubGroup: formData.menuSubGroup,
        itemCode: formData.itemCode,
        hsCode: formData.hsCode,
        printType: formData.printType,
      };

      setMenuItems(prev => [...prev, newItem]);
    });

    resetVariantForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.itemName) return;

    const newItem = {
      id: Date.now(),
      sn: menuItems.length + 1,
      name: formData.itemName,
      price: formData.variants.length > 0 ? formData.variants[0].price : Number(formData.price),
      category: formData.category,
      status: formData.status || 'Active',
      variantname: '',
      variantprice: '',
      menuGroup: formData.menuGroup,
      menuSubGroup: formData.menuSubGroup,
      itemCode: formData.itemCode,
      hsCode: formData.hsCode,
      printType: formData.printType,
    };

    setMenuItems((prev) => [...prev, newItem]);
    resetForm();
  };

  const handleDeleteItem = (id) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Menu Items</h1>
        <div className="flex gap-3">
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white text-sm font-medium rounded-lg hover:brightness-105 transition"
            >
              <Plus size={18} />
              Add New Menu
            </button>
          )}
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            Generate Excel
          </button>
        </div>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 sm:px-8 lg:px-10 pt-8 pb-10">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Menu Group</label>
                      <select
                        name="menuGroup"
                        value={formData.menuGroup}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option>Main Course</option>
                        <option>Appetizers</option>
                        <option>Desserts</option>
                        <option>Beverages</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option>Vegetarian</option>
                        <option>Non-Vegetarian</option>
                        <option>Vegan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Item Name</label>
                      <input
                        type="text"
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Item Code</label>
                      <input
                        type="text"
                        name="itemCode"
                        value={formData.itemCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">HS Code</label>
                      <input
                        type="text"
                        name="hsCode"
                        value={formData.hsCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Print Type</label>
                      <select
                        name="printType"
                        value={formData.printType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option>Select print type</option>
                        <option>KOT</option>
                        <option>BOT</option>
                        <option>COT</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 sm:px-8 lg:px-10 pt-8 pb-10">
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center h-64 flex flex-col justify-center items-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-600 mb-4">Drop image here or</p>
                        <label className="px-5 py-2.5 bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer">
                          Upload Image
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="w-full py-4 text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Add Variant
                </button>
              </div>
            </div>
          </div>

          <MenuItemsTable menuItems={menuItems} handleDeleteItem={handleDeleteItem} />

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-8 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white font-medium rounded-lg hover:brightness-105 transition"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="w-24 h-24 flex items-center justify-center bg-gray-50 rounded-full border border-gray-200 mb-8">
            <svg viewBox="0 0 320 320" className="w-20 h-20 text-gray-400">
              <rect x="10" y="10" width="300" height="300" rx="80" fill="none" stroke="#E5E7EB" strokeWidth="3" />
              <rect x="50" y="50" width="220" height="220" rx="60" fill="none" stroke="#D1D5DB" strokeWidth="3" />
              <rect x="90" y="90" width="140" height="140" rx="40" fill="none" stroke="#D1D5DB" strokeWidth="3" />
              <g stroke="#9CA3AF" strokeWidth="10" strokeLinecap="round">
                <line x1="160" y1="130" x2="160" y2="190" />
                <line x1="130" y1="160" x2="190" y2="160" />
              </g>
            </svg>
          </div>

          <h2 className="text-3xl font-semibold text-gray-900 mb-4">No menu items created yet...</h2>
          <p className="text-gray-600 text-lg mb-10 max-w-md">
            Create your first menu item to get started.
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition shadow-sm text-lg"
          >
            Create Menu Item
          </button>
        </div>
      )}

      <VariantModal
        showVariantModal={showVariantModal}
        resetVariantForm={resetVariantForm}
        variantsList={variantsList}
        handleVariantChange={handleVariantChange}
        addVariantRow={addVariantRow}
        removeVariantRow={removeVariantRow}
        handleSaveVariant={handleSaveVariant}
      />
    </div>
  );
};

export default MenuItems;