// Pos/src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      localStorage.removeItem('isAdmin');
      const isAdmin = window.location.pathname.includes('admin');
      window.location.href = isAdmin ? '/admin' : '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  adminLogin: async (data) => {
    const response = await api.post('/auth/admin/login', data);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('isAdmin', 'true');
    }
    return response.data;
  },
  staffSignup: async (data) => {
    const response = await api.post('/auth/staff/signup', data);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('userType', 'staff');
      localStorage.setItem('isAdmin', 'false');
    }
    return response.data;
  },
  staffLogin: async (data) => {
    const response = await api.post('/auth/staff/login', data);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('userType', 'staff');
      localStorage.setItem('isAdmin', 'false');
    }
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('isAdmin');
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const orderAPI = {
  createOrder: async (data) => {
    const response = await api.post('/orders', data);
    const order = response.data?.data?.order;

    if (order?._id && data.table) {
      const numericId = String(data.table).match(/\d+/)?.[0];
      if (numericId) {
        try {
          await api.post(`/tables/${numericId}/link-order`, { orderId: order._id });
        } catch (err) {
          console.warn('Could not link order to table:', err.message);
        }
      }
    }

    return response.data;
  },
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  updateOrderStatus: async (id, data) => {
    const response = await api.patch(`/orders/${id}`, data);
    return response.data;
  },
  deleteOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};

export const tableAPI = {
  initializeTables: async () => {
    const response = await api.post('/tables/initialize');
    return response.data;
  },
  createTable: async (data) => {
    const response = await api.post('/tables', data);
    return response.data;
  },
  updateTable: async (tableId, data) => {
    const response = await api.put(`/tables/${tableId}`, data);
    return response.data;
  },
  deleteTable: async (tableId) => {
    const response = await api.delete(`/tables/${tableId}`);
    return response.data;
  },
  getAllTables: async (floor) => {
    const params = floor ? { floor } : {};
    const response = await api.get('/tables', { params });
    return response.data;
  },
  updateTableStatus: async (tableId, status) => {
    const response = await api.patch(`/tables/${tableId}/status`, { status });
    return response.data;
  },
  reserveTable: async (tableId, reservationData) => {
    const response = await api.post(`/tables/${tableId}/reserve`, reservationData);
    return response.data;
  },
  cancelReservation: async (tableId) => {
    const response = await api.post(`/tables/${tableId}/cancel-reservation`);
    return response.data;
  },
  startDining: async (tableId) => {
    const response = await api.post(`/tables/${tableId}/start-dining`);
    return response.data;
  },
  endDining: async (tableId) => {
    const response = await api.post(`/tables/${tableId}/end-dining`);
    return response.data;
  },
  linkOrderToTable: async (tableId, orderId) => {
    const response = await api.post(`/tables/${tableId}/link-order`, { orderId });
    return response.data;
  },
};

export const staffAPI = {
  getProfile: async () => {
    const response = await api.get('/staff/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.patch('/staff/profile', data);
    return response.data;
  },
  getAllStaff: async () => {
    const response = await api.get('/staff/all');
    return response.data;
  },
};

export const menuAPI = {
  getMenuItems: async (params = {}) => {
    const response = await api.get('/menu', { params });
    return response.data;
  },
  getMenuItemById: async (id) => {
    const response = await api.get(`/menu/${id}`);
    return response.data;
  },
  createMenuItem: async (data) => {
    const response = await api.post('/menu', data);
    return response.data;
  },
  updateMenuItem: async (id, data) => {
    const response = await api.put(`/menu/${id}`, data);
    return response.data;
  },
  deleteMenuItem: async (id) => {
    const response = await api.delete(`/menu/${id}`);
    return response.data;
  },
};

// ── Zone API ─────────────────────────────────────────────────────────────────
export const zoneAPI = {
  getZones: async (params = {}) => {
    const response = await api.get('/zones', { params });
    return response.data;
  },
  createZone: async (data) => {
    const response = await api.post('/zones', data);
    return response.data;
  },
  updateZone: async (id, data) => {
    const response = await api.put(`/zones/${id}`, data);
    return response.data;
  },
  deleteZone: async (id) => {
    const response = await api.delete(`/zones/${id}`);
    return response.data;
  },
};

// ── Designation API ───────────────────────────────────────────────────────────
export const designationAPI = {
  getDesignations: async (params = {}) => {
    const response = await api.get('/designations', { params });
    return response.data;
  },
  createDesignation: async (data) => {
    const response = await api.post('/designations', data);
    return response.data;
  },
  updateDesignation: async (id, data) => {
    const response = await api.put(`/designations/${id}`, data);
    return response.data;
  },
  deleteDesignation: async (id) => {
    const response = await api.delete(`/designations/${id}`);
    return response.data;
  },
};

// ── Employee API ──────────────────────────────────────────────────────────────
export const employeeAPI = {
  getEmployees: async (params = {}) => {
    const response = await api.get('/employees', { params });
    return response.data;
  },
  getEmployeeById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },
  createEmployee: async (data) => {
    const response = await api.post('/employees', data);
    return response.data;
  },
  updateEmployee: async (id, data) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },
  deleteEmployee: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },
};

export default api;