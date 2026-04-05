// Pos/src/component/POS/master/Table.jsx
import { QrCode, Search, Edit2, Trash2, Download, Plus, X } from 'lucide-react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { tableAPI } from '../../../services/api';
import toast from 'react-hot-toast';

const ZONES  = ['Main Hall', 'Outdoor', 'Private Room', 'Bar', 'Rooftop', 'Garden'];
const FLOORS = ['First Floor', 'Second Floor', 'Third Floor', 'Ground Floor'];

const defaultFormData = {
  tableNumber:      '',
  tableName:        '',
  seatingCapacity:  '',
  status:           'Active',
  zone:             'Main Hall',
  floor:            'First Floor',
};

// ── Status helpers ────────────────────────────────────────────────────────────
const STATUS_LABEL = {
  available: 'Available',
  'on-dine': 'On Dine',
  reserved:  'Reserved',
  split:     'Split',
  merge:     'Merge',
};
const STATUS_DOT = {
  available: 'bg-green-500',
  'on-dine': 'bg-red-500',
  reserved:  'bg-blue-500',
  split:     'bg-orange-500',
  merge:     'bg-cyan-500',
};
const STATUS_TEXT = {
  available: 'text-green-700',
  'on-dine': 'text-red-700',
  reserved:  'text-blue-700',
  split:     'text-orange-700',
  merge:     'text-cyan-700',
};

// ── Export helper ─────────────────────────────────────────────────────────────
const exportToCSV = (rows) => {
  const headers = ['SN', 'Table No.', 'Table Name', 'Floor', 'Zone', 'Capacity', 'Status'];
  const data = rows.map((t, i) => [
    i + 1,
    `#${t.tableId}`,
    t.tableName || '—',
    t.floor,
    t.zone || '—',
    t.seatingCapacity || '—',
    STATUS_LABEL[t.status] || t.status,
  ]);
  const csv = [headers, ...data]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = `tables-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

// ── TableListView ─────────────────────────────────────────────────────────────
const TableListView = ({ tables, loading, onAdd, onEdit, onDelete }) => {
  const [search,      setSearch]      = useState('');
  const [floorFilter, setFloorFilter] = useState('All');
  const [zoneFilter,  setZoneFilter]  = useState('All');

  const floors = useMemo(() => ['All', ...Array.from(new Set(tables.map((t) => t.floor).filter(Boolean)))], [tables]);
  const zones  = useMemo(() => ['All', ...Array.from(new Set(tables.map((t) => t.zone).filter(Boolean)))],  [tables]);

  const filtered = useMemo(() =>
    tables.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch =
        String(t.tableId).includes(q) ||
        (t.tableName || '').toLowerCase().includes(q) ||
        (t.zone      || '').toLowerCase().includes(q);
      const matchFloor = floorFilter === 'All' || t.floor === floorFilter;
      const matchZone  = zoneFilter  === 'All' || t.zone  === zoneFilter;
      return matchSearch && matchFloor && matchZone;
    }),
  [tables, search, floorFilter, zoneFilter]);

  return (
    <div className="min-h-screen bg-white px-6 py-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Table Master</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your restaurant tables</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white text-sm font-medium rounded-lg hover:brightness-105 transition"
          >
            <Plus size={16} />
            Add Table
          </button>
          <button
            onClick={() => exportToCSV(filtered)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition"
          >
            <Download size={16} />
            Generate Excel
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total',     value: tables.length,                                        color: 'bg-gray-50  border-gray-200  text-gray-700'  },
          { label: 'Available', value: tables.filter((t) => t.status === 'available').length, color: 'bg-green-50 border-green-200 text-green-700' },
          { label: 'On Dine',   value: tables.filter((t) => t.status === 'on-dine').length,   color: 'bg-red-50   border-red-200   text-red-700'   },
          { label: 'Reserved',  value: tables.filter((t) => t.status === 'reserved').length,  color: 'bg-blue-50  border-blue-200  text-blue-700'  },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl border px-5 py-4 ${color}`}>
            <p className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
          <div className="flex items-center flex-1 min-w-[180px] gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by number, name or zone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                <X size={13} />
              </button>
            )}
          </div>
          <select
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {floors.map((f) => <option key={f} value={f}>Floor: {f}</option>)}
          </select>
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {zones.map((z) => <option key={z} value={z}>Zone: {z}</option>)}
          </select>
        </div>

        {/* Data table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-white">
              <tr>
                {['SN', 'Table No.', 'Table Name', 'Floor', 'Zone', 'Capacity', 'Status', 'Actions'].map((col) => (
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
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#487AA4]" />
                      Loading tables…
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-400">
                    {tables.length === 0
                      ? 'No tables yet. Click "Add Table" to create your first one.'
                      : 'No tables match the current filters.'}
                  </td>
                </tr>
              ) : (
                filtered.map((table, index) => (
                  <tr key={table._id || table.tableId} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-5 py-4 text-sm text-gray-500">{index + 1}</td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#EBF2F9] text-[#386184] text-sm font-bold">
                        {table.tableId}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-gray-900">
                      {table.tableName || <span className="text-gray-400">—</span>}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">{table.floor}</td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {table.zone || <span className="text-gray-400">—</span>}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {table.seatingCapacity
                        ? <span>{table.seatingCapacity} seats</span>
                        : <span className="text-gray-400">—</span>}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${STATUS_TEXT[table.status] || 'text-gray-700'}`}>
                        <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[table.status] || 'bg-gray-400'}`} />
                        {STATUS_LABEL[table.status] || table.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(table)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit table"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(table.tableId)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete table"
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

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
            <span>Showing {filtered.length} of {tables.length} table{tables.length !== 1 ? 's' : ''}</span>
            {(search || floorFilter !== 'All' || zoneFilter !== 'All') && (
              <button
                onClick={() => { setSearch(''); setFloorFilter('All'); setZoneFilter('All'); }}
                className="text-[#487AA4] hover:underline text-xs"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Table component ──────────────────────────────────────────────────────
const Table = () => {
  const [showForm,      setShowForm]      = useState(false);
  const [formData,      setFormData]      = useState(defaultFormData);
  const [qrGenerated,   setQrGenerated]   = useState(false);
  const [tables,        setTables]        = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState('');
  const [editingTable,  setEditingTable]  = useState(null);

  // ── fetch all tables (no floor filter — master view shows all) ──────────────
  const fetchTables = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await tableAPI.getAllTables();
      setTables(res.data?.tables || []);
    } catch (err) {
      setError('Failed to load tables.');
      console.error('fetchTables:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTables(); }, [fetchTables]);

  // ── form helpers ──────────────────────────────────────────────────────────
  const resetForm = () => {
    setShowForm(false);
    setEditingTable(null);
    setFormData(defaultFormData);
    setQrGenerated(false);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (qrGenerated) setQrGenerated(false); // reset QR if fields change
  };

  // ── submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!formData.tableNumber || !formData.tableName) {
      setError('Table number and table name are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editingTable) {
        await tableAPI.updateTable(editingTable.tableId, formData);
        toast.success(`Table #${editingTable.tableId} updated!`);
      } else {
        await tableAPI.createTable(formData);
        toast.success(`Table #${formData.tableNumber} created!`);
      }
      await fetchTables();
      resetForm();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save table.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // ── edit ──────────────────────────────────────────────────────────────────
  const handleEdit = (table) => {
    setEditingTable(table);
    setFormData({
      tableNumber:     table.tableId,
      tableName:       table.tableName       || '',
      seatingCapacity: table.seatingCapacity || '',
      status:          'Active',
      zone:            table.zone            || 'Main Hall',
      floor:           table.floor           || 'First Floor',
    });
    setQrGenerated(false);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (tableId) => {
    if (!window.confirm(`Delete Table #${tableId}? This action cannot be undone.`)) return;
    try {
      await tableAPI.deleteTable(tableId);
      toast.success(`Table #${tableId} deleted`);
      setTables((prev) => prev.filter((t) => t.tableId !== tableId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete table.');
    }
  };

  // ── list view ─────────────────────────────────────────────────────────────
  if (!showForm) {
    return (
      <TableListView
        tables={tables}
        loading={loading}
        onAdd={() => setShowForm(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  // ── form view ─────────────────────────────────────────────────────────────
  const isFormValid = formData.tableNumber && formData.tableName;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6 font-sans">
      {/* Page title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {editingTable ? `Edit Table #${editingTable.tableId}` : 'Add New Table'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {editingTable ? 'Update table details below' : 'Fill in the details and save'}
          </p>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center justify-between">
          {error}
          <button onClick={() => setError('')}><X size={14} /></button>
        </div>
      )}

      <div className="space-y-6">
        {/* ── Card 1: Table Information ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 sm:px-8 lg:px-10 pt-8 pb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Table Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Table Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Table Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="tableNumber"
                  value={formData.tableNumber}
                  onChange={handleChange}
                  min="1"
                  disabled={!!editingTable}
                  placeholder="e.g., 1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
                {editingTable && (
                  <p className="text-xs text-gray-400 mt-1">Table number cannot be changed after creation</p>
                )}
              </div>

              {/* Table Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Table Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tableName"
                  value={formData.tableName}
                  onChange={handleChange}
                  placeholder="e.g., Window Table, VIP Booth"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Seating Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Seating Capacity</label>
                <input
                  type="number"
                  name="seatingCapacity"
                  value={formData.seatingCapacity}
                  onChange={handleChange}
                  min="1"
                  placeholder="e.g., 4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Floor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Floor</label>
                <select
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  {FLOORS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              {/* Zone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Zone</label>
                <select
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>

              {/* Status (display-only — real status managed by POS) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="Active">● Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">Operational status is managed from the POS table view</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Card 2: QR Code ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 sm:px-8 lg:px-10 pt-8 pb-10">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">QR Code Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Info side */}
              <div>
                <button
                  type="button"
                  onClick={() => setQrGenerated(true)}
                  disabled={!isFormValid}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-100 transition mb-6 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <QrCode size={18} />
                  Generate QR Code
                </button>

                <div className="space-y-3">
                  {[
                    ['Table Number', qrGenerated ? `#${formData.tableNumber}` : '—'],
                    ['Table Name',   qrGenerated ? formData.tableName         : '—'],
                    ['Floor',        qrGenerated ? formData.floor             : '—'],
                    ['Zone',         qrGenerated ? formData.zone              : '—'],
                    ['Capacity',     qrGenerated ? (formData.seatingCapacity ? `${formData.seatingCapacity} seats` : '—') : '—'],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 w-36">{label}:</span>
                      <span className={`text-sm ${val === '—' ? 'text-gray-400' : 'text-gray-800 font-medium'}`}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR preview */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-xs h-56 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white">
                  {qrGenerated ? (
                    <div className="text-center">
                      <div className="w-40 h-40 mx-auto bg-white rounded-lg shadow-inner border border-gray-100 flex flex-col items-center justify-center gap-2">
                        <QrCode size={64} className="text-gray-700" />
                        <p className="text-xs text-gray-500 font-medium">Table #{formData.tableNumber}</p>
                      </div>
                      <p className="mt-3 text-sm text-gray-500">Ready to print</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 text-center px-6">
                      <QrCode size={64} className="mb-3 text-gray-200" />
                      <p className="text-sm">Fill in table details,<br />then generate QR code</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex justify-end gap-4 pt-2 pb-8">
          <button
            type="button"
            onClick={resetForm}
            disabled={saving}
            className="px-8 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || !isFormValid}
            className="px-10 py-2.5 bg-gradient-to-r from-[#487AA4] to-[#386184] text-white font-medium rounded-lg hover:brightness-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {saving ? 'Saving...' : editingTable ? 'Update Table' : 'Save Table'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;