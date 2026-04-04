import { Search, Edit2, Trash2, Download, Plus } from 'lucide-react';
import { useState, useMemo } from 'react';

// ── Simple CSV/Excel export (no external library needed) ──────────────────
const exportToCSV = (menuItems) => {
  const headers = ['SN', 'Name', 'Price', 'Category', 'Group', 'HS Code', 'Print Type', 'Status'];
  const rows = menuItems.map((item, idx) => [
    idx + 1,
    item.name,
    item.price,
    item.category || '',
    item.menuGroup || '',
    item.hsCode || '',
    item.printType || '',
    item.status || '',
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `menu-items-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const MenuItemsTable = ({ menuItems = [], loading = false, onAddMenu, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(menuItems.map((i) => i.category).filter(Boolean)));
    return ['All', ...unique];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [menuItems, searchQuery, categoryFilter]);

  return (
    <div className="min-h-screen bg-white px-6 py-6 font-sans">

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Create</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create menu for your restaurant</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onAddMenu}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white text-sm font-medium rounded-lg hover:brightness-105 transition"
          >
            <Plus size={16} />
            Add Menu
          </button>
          {/* FIX: Generate Excel is now wired up */}
          <button
            onClick={() => exportToCSV(filteredItems)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition"
          >
            <Download size={16} />
            Generate Excel
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">

        {/* Search + filter */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
          <div className="flex items-center flex-1 gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>Category: {cat}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-white">
              <tr>
                {['SN', 'Name', 'Price', 'Category', 'Group', 'Hs Code', 'Print Type', 'Status', 'Actions'].map((col) => (
                  <th
                    key={col}
                    className={`px-5 py-3.5 text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                      col === 'Actions' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center">
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#487AA4]" />
                      Loading menu items…
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">
                    No menu items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-600">{index + 1}</td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {item.imagePreview ? (
                          <img
                            src={item.imagePreview}
                            alt={item.name}
                            className="w-9 h-9 rounded-lg object-cover border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center text-lg">
                            🍽️
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">Rs. {item.price}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">{item.category || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">{item.menuGroup || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">{item.hsCode || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">{item.printType || '—'}</td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-800">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            item.status === 'Active' ? 'bg-green-500' : 'bg-red-400'
                          }`}
                        />
                        {item.status || '—'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit item"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && filteredItems.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
            Showing {filteredItems.length} of {menuItems.length} item{menuItems.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemsTable;