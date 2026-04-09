import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../../services/api';

// ── API helpers ───────────────────────────────────────────────────────────────
const ingredientAPI = {
  getIngredients: (params = {}) => api.get('/ingredients', { params }).then(r => r.data),
  createIngredient: (data) => api.post('/ingredients', data).then(r => r.data),
  updateIngredient: (id, data) => api.put(`/ingredients/${id}`, data).then(r => r.data),
  deleteIngredient: (id) => api.delete(`/ingredients/${id}`).then(r => r.data),
};

const UNITS = [
  'kg', 'g', 'mg', 'lb', 'oz',
  'L', 'ml', 'cup', 'tbsp', 'tsp',
  'piece', 'dozen', 'pack', 'box', 'bag',
  'bottle', 'can', 'jar',
];

const CATEGORIES = [
  'Vegetables', 'Fruits', 'Meat & Poultry', 'Seafood', 'Dairy',
  'Grains & Cereals', 'Spices & Herbs', 'Oils & Fats', 'Sauces & Condiments',
  'Beverages', 'Bakery', 'Frozen', 'Canned Goods', 'Other',
];

const defaultForm = {
  ingredientName: '',
  unit: '',
  category: '',
  costPerUnit: '',
  stockQuantity: '',
  reorderLevel: '',
  supplier: '',
  description: '',
  status: 'Active',
};

const Ingredient = () => {
  const [showForm,     setShowForm]     = useState(false);
  const [ingredients,  setIngredients]  = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [searchTerm,   setSearchTerm]   = useState('');
  const [editingId,    setEditingId]    = useState(null);
  const [formData,     setFormData]     = useState(defaultForm);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchIngredients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ingredientAPI.getIngredients();
      setIngredients(res.data?.ingredients || []);
    } catch (err) {
      toast.error('Failed to load ingredients');
      console.error('fetchIngredients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchIngredients(); }, [fetchIngredients]);

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

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ingredientName.trim()) {
      toast.error('Ingredient name is required');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await ingredientAPI.updateIngredient(editingId, formData);
        toast.success('Ingredient updated successfully');
      } else {
        await ingredientAPI.createIngredient(formData);
        toast.success('Ingredient created successfully');
      }
      await fetchIngredients();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save ingredient');
    } finally {
      setSaving(false);
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const handleEdit = (ingredient) => {
    setFormData({
      ingredientName: ingredient.ingredientName,
      unit:           ingredient.unit          || '',
      category:       ingredient.category      || '',
      costPerUnit:    ingredient.costPerUnit   ?? '',
      stockQuantity:  ingredient.stockQuantity ?? '',
      reorderLevel:   ingredient.reorderLevel  ?? '',
      supplier:       ingredient.supplier      || '',
      description:    ingredient.description   || '',
      status:         ingredient.status,
    });
    setEditingId(ingredient._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ingredient?')) return;
    try {
      await ingredientAPI.deleteIngredient(id);
      toast.success('Ingredient deleted successfully');
      setIngredients((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete ingredient');
    }
  };

  // ── CSV Export ────────────────────────────────────────────────────────────
  const generateExcel = () => {
    const headers = ['Ingredient Name', 'Unit', 'Category', 'Cost/Unit', 'Stock Qty', 'Reorder Level', 'Supplier', 'Status', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...ingredients.map((i) => [
        i.ingredientName,
        i.unit || '',
        i.category || '',
        i.costPerUnit || 0,
        i.stockQuantity || 0,
        i.reorderLevel || 0,
        i.supplier || '',
        i.status,
        new Date(i.createdAt).toLocaleDateString(),
      ].join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ingredients.csv';
    a.click();
  };

  const filteredIngredients = ingredients.filter((i) =>
    i.ingredientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.category  || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.supplier  || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Stock status helper ───────────────────────────────────────────────────
  const getStockBadge = (ingredient) => {
    const qty = ingredient.stockQuantity || 0;
    const reorder = ingredient.reorderLevel || 0;
    if (qty === 0) return { label: 'Out of Stock', cls: 'bg-red-100 text-red-800' };
    if (qty <= reorder) return { label: 'Low Stock', cls: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', cls: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Ingredients</h1>
        <div className="flex gap-3">
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white text-sm font-medium rounded-lg hover:brightness-105 transition"
            >
              <span className="text-lg font-bold">+</span> Add Ingredient
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
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="px-6 sm:px-8 lg:px-10 pt-8 pb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              {editingId ? 'Edit Ingredient' : 'Add New Ingredient'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Ingredient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" name="ingredientName" value={formData.ingredientName}
                    onChange={handleChange} placeholder="e.g., Tomato, Chicken Breast"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit of Measure</label>
                  <select
                    name="unit" value={formData.unit} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-base"
                  >
                    <option value="">Select unit</option>
                    {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select
                    name="category" value={formData.category} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-base"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cost per Unit (Rs)</label>
                  <input
                    type="number" name="costPerUnit" value={formData.costPerUnit}
                    onChange={handleChange} placeholder="0.00" min="0" step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity</label>
                  <input
                    type="number" name="stockQuantity" value={formData.stockQuantity}
                    onChange={handleChange} placeholder="0" min="0" step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Reorder Level</label>
                  <input
                    type="number" name="reorderLevel" value={formData.reorderLevel}
                    onChange={handleChange} placeholder="0" min="0" step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                  />
                  <p className="mt-1 text-xs text-gray-400">Alert when stock falls below this level</p>
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
              </div>

              {/* Row 4 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Supplier</label>
                <input
                  type="text" name="supplier" value={formData.supplier}
                  onChange={handleChange} placeholder="Supplier name or company"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                />
              </div>

              {/* Row 5 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  name="description" value={formData.description} onChange={handleChange}
                  rows={3} placeholder="Enter description..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y text-base"
                />
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
      {!loading && ingredients.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text" placeholder="Search by name, category or supplier..."
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">
                Total: {filteredIngredients.length} ingredient{filteredIngredients.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Ingredient', 'Category', 'Unit', 'Cost/Unit', 'Stock Qty', 'Stock Status', 'Supplier', 'Status', 'Created Date', 'Actions'].map((h) => (
                    <th key={h} className={`px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${h === 'Actions' ? 'text-center' : 'text-left'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredIngredients.map((ingredient) => {
                  const stockBadge = getStockBadge(ingredient);
                  return (
                    <tr key={ingredient._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{ingredient.ingredientName}</p>
                            {ingredient.description && (
                              <p className="text-xs text-gray-400 truncate max-w-[160px]">{ingredient.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">{ingredient.category || '—'}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                          {ingredient.unit || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">
                        {ingredient.costPerUnit > 0 ? `Rs ${ingredient.costPerUnit.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-900">
                        <span className="font-medium">{ingredient.stockQuantity ?? 0}</span>
                        {ingredient.unit && <span className="text-gray-400 text-xs ml-1">{ingredient.unit}</span>}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockBadge.cls}`}>
                          {stockBadge.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">{ingredient.supplier || '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ingredient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {ingredient.status === 'Active' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5" />}
                          {ingredient.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{new Date(ingredient.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(ingredient)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(ingredient._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
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

          {filteredIngredients.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">No ingredients found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && ingredients.length === 0 && !showForm && (
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
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Ooops! No Ingredients added yet...</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-md">
            There's nothing to view right now. Please add a new<br />ingredient to get started.
          </p>
          <button onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition shadow-sm text-lg">
            Add Ingredient
          </button>
        </div>
      )}
    </div>
  );
};

export default Ingredient;