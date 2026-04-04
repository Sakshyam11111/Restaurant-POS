import { Upload, X, ChevronDown, Trash2 } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import MenuItemsTable from './MenuItemsTable';
import VariantModal from './VariantModal';
import { menuAPI } from '../../../../services/api';

const defaultFormData = {
  menuGroup:    '',
  menuSubGroup: '',
  itemName:     '',
  itemCode:     '',
  hsCode:       '',
  printType:    '',
  price:        '',
  addOns:       '',
  category:     'Vegetarian',
  status:       'Active',
};

const MENU_GROUPS = [
  'Main Course', 'Appetizers', 'Desserts', 'Beverages', 'Lunch',
  'Breakfast', 'Snacks', 'Salads', 'Soups', 'Sides', 'Specials'
];

const SUB_GROUP_MAP = {
  'Main Course': [
    'Rice-Based',
    'Noodle-Based',
    'Curry-Based',
    'Grilled Items',
    'Sandwich-Based',
    'Pasta-Based',
    'Pizza-Based'
  ],

  'Appetizers': [
    'Soup-Based',
    'Salad-Based',
    'Starter Items',
    'Dips & Spreads',
    'Finger Foods',
    'Canapés & Bites'
  ],

  'Desserts': [
    'Ice Cream-Based',
    'Cake-Based',
    'Pastry-Based',
    'Traditional Sweets',
    'Pudding & Custard',
    'Brownie-Based'
  ],

  'Beverages': [
    'Hot Drinks',
    'Cold Drinks',
    'Fresh Juices',
    'Shakes & Smoothies',
    'Alcoholic Drinks',
    'Mocktails',
    'Coffee-Based',
    'Tea-Based'
  ],

  'Lunch': [
    'Set Meals',
    'Thali-Based',
    'Combo Meals',
    'A La Carte',
    'Buffet'
  ],

  'Breakfast': [
    'Continental Items',
    'Nepali Breakfast',
    'English Breakfast',
    'Healthy Bowls',
    'Egg-Based Items'
  ],

  'Snacks': [
    'Chips & Crisps',
    'Fried Snacks',
    'Pakora Items',
    'Samosa Items',
    'Momo-Based'
  ],

  'Specials': [
    'Chef Specials',
    'Seasonal Items',
    'Limited Time Offers',
    'Signature Items'
  ]
};

const PRINT_TYPES = ['KOT', 'BOT', 'COT', 'Invoice', 'Kitchen Display'];

const ADD_ONS_OPTIONS = [
  'Extra Cheese', 'Extra Sauce', 'Extra Spicy', 'Extra Veggies',
  'Extra Meat', 'Gluten Free', 'Dairy Free', 'Sugar Free', 'No Onion No Garlic'
];

const CATEGORIES = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Gluten Free', 'Jain'];

const STATUSES = ['Active', 'Inactive', 'Out of Stock'];

const ComboBox = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  placeholder = "Type or select...",
  required = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const filteredOptions = useMemo(() => {
    if (!inputValue) return options;
    return options.filter(option =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, options]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange({ target: { name, value: newValue } });
    setIsOpen(true);
  };

  const handleSelect = (option) => {
    setInputValue(option);
    onChange({ target: { name, value: option } });
    setIsOpen(false);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <input
          type="text"
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm 
                     placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none pr-10"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              onMouseDown={() => handleSelect(option)}
              className="px-4 py-2.5 text-sm hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const VariantPreviewTable = ({ rows, onDelete }) => {
  const columns = ['SN', 'Name', 'Price', 'Category', 'Variant Name', 'Variant Price', 'Print Type', 'Status'];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 text-center">
                {col}
              </th>
            ))}
            <th className="border border-gray-200 px-2 py-3 w-10" />
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="border border-gray-200 px-4 py-8 text-center text-sm text-gray-400">
                No variants added yet. Fill in the form and click "Add Variant".
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={row.tempId} className="hover:bg-gray-50 transition-colors">
                <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700 text-center">{index + 1}</td>
                <td className="border border-gray-200 px-4 py-3 text-sm text-gray-800 text-center">{row.name}</td>
                <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700 text-center">{row.basePrice}</td>
                <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700 text-center">{row.category || '—'}</td>
                <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700 text-center">{row.variantName || '-'}</td>
                <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700 text-center">{row.variantPrice || '-'}</td>
                <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700 text-center">{row.printType || '-'}</td>
                <td className="border border-gray-200 px-4 py-3 text-center">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-800 justify-center">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${row.status === 'Active' ? 'bg-green-500' : 'bg-red-400'}`} />
                    {row.status}
                  </span>
                </td>
                <td className="border border-gray-200 px-2 py-3 text-center">
                  <button type="button" onClick={() => onDelete(row.tempId)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const MenuItems = () => {
  const [showForm, setShowForm]                 = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

  const [editingItem, setEditingItem]   = useState(null);
  const [formData, setFormData]         = useState(defaultFormData);
  const [variantsList, setVariantsList] = useState([{ id: 1, name: '', price: '', listedPrice: '0.00', cogs: '0.00', grossProfit: '0.00', setupStockConsumption: false }]);
  const [imagePreview, setImagePreview] = useState(null);
  const [previewRows, setPreviewRows]   = useState([]);

  const flattenForTable = (items) => {
    const rows = [];
    items.forEach((item) => {
      if (!item.variants || item.variants.length === 0) {
        rows.push({
          id:           item._id,
          _id:          item._id,
          name:         item.name,
          price:        item.price,
          category:     item.category,
          menuGroup:    item.menuGroup,
          menuSubGroup: item.menuSubGroup,
          itemCode:     item.itemCode,
          hsCode:       item.hsCode,
          printType:    item.printType,
          addOns:       item.addOns,
          status:       item.status,
          imagePreview: item.image || null,
          variantname:  '',
          variantprice: '',
          _original:    item,
        });
      } else {
        item.variants.forEach((v) => {
          rows.push({
            id:           `${item._id}_${v._id}`,
            _id:          item._id,
            name:         item.name,
            price:        item.price,
            category:     item.category,
            menuGroup:    item.menuGroup,
            menuSubGroup: item.menuSubGroup,
            itemCode:     item.itemCode,
            hsCode:       item.hsCode,
            printType:    item.printType,
            addOns:       item.addOns,
            status:       item.status,
            imagePreview: item.image || null,
            variantname:  v.name,
            variantprice: v.price,
            _original:    item,
          });
        });
      }
    });
    return rows;
  };

  const fetchMenuItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await menuAPI.getMenuItems();
      setMenuItems(flattenForTable(res.data.items || []));
    } catch (err) {
      setError('Failed to load menu items.');
      console.error('fetchMenuItems:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMenuItems(); }, [fetchMenuItems]);

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData(defaultFormData);
    setImagePreview(null);
    setPreviewRows([]);
    setVariantsList([{ id: 1, name: '', price: '', listedPrice: '0.00', cogs: '0.00', grossProfit: '0.00', setupStockConsumption: false }]);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'menuGroup') {
      setFormData((prev) => ({ ...prev, menuGroup: value, menuSubGroup: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const buildPayload = () => ({
    name:         formData.itemName,
    itemCode:     formData.itemCode,
    hsCode:       formData.hsCode,
    price:        Number(formData.price),
    category:     formData.category,
    menuGroup:    formData.menuGroup,
    menuSubGroup: formData.menuSubGroup,
    printType:    formData.printType,
    addOns:       formData.addOns,
    status:       formData.status,
    image:        imagePreview || '',
    variants:     previewRows.map((r) => r.variantData).filter(Boolean),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.itemName || !formData.price) return;

    setSaving(true);
    setError('');
    try {
      const payload = buildPayload();
      if (editingItem) {
        await menuAPI.updateMenuItem(editingItem._id, payload);
      } else {
        await menuAPI.createMenuItem(payload);
      }
      await fetchMenuItems();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Please try again.');
      console.error('handleSubmit:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEditItem = (row) => {
    const original = row._original;
    setEditingItem(original);
    setFormData({
      menuGroup:    original.menuGroup    || '',
      menuSubGroup: original.menuSubGroup || '',
      itemName:     original.name,
      itemCode:     original.itemCode     || '',
      hsCode:       original.hsCode       || '',
      printType:    original.printType    || '',
      price:        original.price,
      addOns:       original.addOns       || '',
      category:     original.category     || 'Vegetarian',
      status:       original.status       || 'Active',
    });
    setImagePreview(original.image || null);

    if (original.variants?.length > 0) {
      const rows = original.variants.map((v, idx) => ({
        tempId:       `existing_${idx}_${Date.now()}`,
        name:         original.name,
        basePrice:    original.price,
        category:     original.category,
        printType:    original.printType,
        status:       original.status,
        variantName:  v.name,
        variantPrice: v.price,
        variantData: {
          name:                  v.name,
          price:                 v.price,
          cogs:                  v.cogs,
          listedPrice:           v.listedPrice,
          grossProfit:           v.grossProfit,
          setupStockConsumption: v.setupStockConsumption,
        },
      }));
      setPreviewRows(rows);
    }

    setShowForm(true);
  };

  const handleDeleteItem = async (rowId) => {
    const dbId = String(rowId).includes('_') ? String(rowId).split('_')[0] : rowId;
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await menuAPI.deleteMenuItem(dbId);
      await fetchMenuItems();
    } catch (err) {
      setError('Failed to delete menu item.');
      console.error('handleDeleteItem:', err);
    }
  };

  const handleDeletePreviewRow = (tempId) => {
    setPreviewRows((prev) => prev.filter((r) => r.tempId !== tempId));
  };

  const resetVariantForm = () => {
    setVariantsList([{ id: 1, name: '', price: '', listedPrice: '0.00', cogs: '0.00', grossProfit: '0.00', setupStockConsumption: false }]);
    setShowVariantModal(false);
  };

  const handleVariantChange = (id, e) => {
    const { name, value, type, checked } = e.target;
    setVariantsList((prev) =>
      prev.map((variant) => {
        if (variant.id !== id) return variant;
        if (name === 'price') {
          const p = parseFloat(value) || 0, c = parseFloat(variant.cogs) || 0;
          return { ...variant, price: value, listedPrice: p.toFixed(2), grossProfit: (p - c).toFixed(2) };
        }
        if (name === 'cogs') {
          const c = parseFloat(value) || 0, p = parseFloat(variant.price) || 0;
          return { ...variant, cogs: value, grossProfit: (p - c).toFixed(2) };
        }
        return { ...variant, [name]: type === 'checkbox' ? checked : value };
      })
    );
  };

  const addVariantRow = () => {
    const newId = Math.max(...variantsList.map((v) => v.id), 0) + 1;
    setVariantsList((prev) => [...prev, { 
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
    if (variantsList.length > 1) setVariantsList((prev) => prev.filter((v) => v.id !== id));
  };

  const handleSaveVariant = () => {
    const isValid = variantsList.every((v) => v.name && v.price);
    if (!isValid || !formData.itemName) return;

    const newRows = variantsList.map((variant, index) => ({
      tempId:       `${Date.now()}_${index}`,
      name:         formData.itemName,
      basePrice:    formData.price || variant.price,
      category:     formData.category || 'Vegetarian',
      status:       formData.status   || 'Active',
      printType:    formData.printType,
      variantName:  variant.name,
      variantPrice: variant.price,
      variantData: {
        name:                  variant.name,
        price:                 Number(variant.price),
        cogs:                  Number(variant.cogs)        || 0,
        listedPrice:           Number(variant.listedPrice) || 0,
        grossProfit:           Number(variant.grossProfit) || 0,
        setupStockConsumption: Boolean(variant.setupStockConsumption),
      },
    }));

    setPreviewRows((prev) => [...prev, ...newRows]);
    resetVariantForm();
  };

  return (
    <div className="font-sans">

      {error && !showForm && (
        <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center justify-between">
          {error}
          <button onClick={() => setError('')}><X size={14} /></button>
        </div>
      )}

      {!showForm && (
        <MenuItemsTable
          menuItems={menuItems}
          loading={loading}
          onAddMenu={() => setShowForm(true)}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
        />
      )}

      {showForm && (
        <div className="min-h-screen bg-gray-100 px-6 py-6">

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center justify-between">
              {error}
              <button onClick={() => setError('')}><X size={14} /></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex gap-5 items-start mb-4">

              <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm px-7 py-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5">
                  {editingItem ? 'Edit Menu' : 'Add New Menu'}
                </h2>

                <div className="grid grid-cols-2 gap-x-5 gap-y-4">

                  <ComboBox
                    label="Menu Group"
                    name="menuGroup"
                    value={formData.menuGroup}
                    onChange={handleChange}
                    options={MENU_GROUPS}
                    required
                  />

                  <ComboBox
                    label="Menu Sub Group"
                    name="menuSubGroup"
                    value={formData.menuSubGroup}
                    onChange={handleChange}
                    options={SUB_GROUP_MAP[formData.menuGroup] || []}
                    placeholder={formData.menuGroup ? "Type or select sub group" : "Select group first"}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Item Name</label>
                    <input type="text" name="itemName" value={formData.itemName} onChange={handleChange}
                      placeholder="Item name" required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Item Code</label>
                    <input type="text" name="itemCode" value={formData.itemCode} onChange={handleChange}
                      placeholder="Enter item code"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">HS Code</label>
                    <input type="text" name="hsCode" value={formData.hsCode} onChange={handleChange}
                      placeholder="Enter HS Code e.g.121"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>

                  <ComboBox
                    label="Print Type"
                    name="printType"
                    value={formData.printType}
                    onChange={handleChange}
                    options={PRINT_TYPES}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Price</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange}
                      step="0.01" min="0" placeholder="0.0" required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>

                  <ComboBox
                    label="Add-Ons / Extra"
                    name="addOns"
                    value={formData.addOns}
                    onChange={handleChange}
                    options={ADD_ONS_OPTIONS}
                  />

                  <ComboBox
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={CATEGORIES}
                  />

                  <ComboBox
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={STATUSES}
                  />

                </div>
              </div>

              <div className="w-64 shrink-0 flex flex-col gap-4">

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl h-44 flex flex-col justify-center items-center bg-gray-50 cursor-pointer"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                        <button type="button" onClick={() => setImagePreview(null)}
                          className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                          <X size={11} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-400">Drop image here</p>
                      </div>
                    )}
                  </div>
                  <label className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition">
                    <Upload size={14} />
                    Upload Image
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <button type="button" onClick={() => setShowVariantModal(true)}
                    className="w-full py-3.5 text-gray-800 font-semibold text-sm hover:bg-gray-50 transition rounded-xl">
                    Add Variant
                  </button>
                </div>
              </div>
            </div>

            <VariantPreviewTable rows={previewRows} onDelete={handleDeletePreviewRow} />

            <div className="flex justify-end gap-3 mt-5">
              <button type="submit" disabled={saving}
                className="px-12 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white font-medium rounded-lg hover:brightness-105 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                {saving ? 'Saving...' : editingItem ? 'Update' : 'Save'}
              </button>
              <button type="button" onClick={resetForm} disabled={saving}
                className="px-10 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-200 transition text-sm">
                Cancel
              </button>
            </div>
          </form>
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