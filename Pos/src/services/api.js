import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor – attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      localStorage.removeItem('isAdmin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authAPI = {
  adminLogin: async (credentials) => {
    const response = await api.post('/auth/admin/login', credentials);
    return response.data;
  },
  staffSignup: async (userData) => {
    const response = await api.post('/auth/staff/signup', userData);
    return response.data;
  },
  staffLogin: async (credentials) => {
    const response = await api.post('/auth/staff/login', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// ── Order API ─────────────────────────────────────────────────────────────────
export const orderAPI = {
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
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

// ── Table API ─────────────────────────────────────────────────────────────────
export const tableAPI = {
  getAllTables: async (floor, options = {}) => {
    const params = floor ? { floor } : {};
    const response = await api.get('/tables', { params, ...options });
    return response.data;
  },
  createTable: async (tableData) => {
    const response = await api.post('/tables', tableData);
    return response.data;
  },
  updateTable: async (tableId, tableData) => {
    const response = await api.put(`/tables/${tableId}`, tableData);
    return response.data;
  },
  deleteTable: async (tableId) => {
    const response = await api.delete(`/tables/${tableId}`);
    return response.data;
  },
  initializeTables: async (options = {}) => {
    const response = await api.post('/tables/initialize', {}, options);
    return response.data;
  },
  updateTableStatus: async (tableId, statusData) => {
    const response = await api.patch(`/tables/${tableId}/status`, statusData);
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

// ── Menu API ──────────────────────────────────────────────────────────────────
export const menuAPI = {
  getMenuItems: async (params = {}) => {
    const response = await api.get('/menu', { params });
    return response.data;
  },
  getMenuItemById: async (id) => {
    const response = await api.get(`/menu/${id}`);
    return response.data;
  },
  createMenuItem: async (itemData) => {
    const response = await api.post('/menu', itemData);
    return response.data;
  },
  updateMenuItem: async (id, itemData) => {
    const response = await api.put(`/menu/${id}`, itemData);
    return response.data;
  },
  deleteMenuItem: async (id) => {
    const response = await api.delete(`/menu/${id}`);
    return response.data;
  },
};

// ── Staff API ─────────────────────────────────────────────────────────────────
export const staffAPI = {
  getStaffProfile: async () => {
    const response = await api.get('/staff/profile');
    return response.data;
  },
  updateStaffProfile: async (data) => {
    const response = await api.patch('/staff/profile', data);
    return response.data;
  },
  getAllStaff: async () => {
    const response = await api.get('/staff/all');
    return response.data;
  },
};

// ── Zone API ──────────────────────────────────────────────────────────────────
export const zoneAPI = {
  getZones: async (params = {}) => {
    const response = await api.get('/zones', { params });
    return response.data;
  },
  getZoneById: async (id) => {
    const response = await api.get(`/zones/${id}`);
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
  getDesignationById: async (id) => {
    const response = await api.get(`/designations/${id}`);
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

// ── Ingredient API ────────────────────────────────────────────────────────────
export const ingredientAPI = {
  getIngredients: async (params = {}) => {
    const response = await api.get('/ingredients', { params });
    return response.data;
  },
  getIngredientById: async (id) => {
    const response = await api.get(`/ingredients/${id}`);
    return response.data;
  },
  createIngredient: async (data) => {
    const response = await api.post('/ingredients', data);
    return response.data;
  },
  updateIngredient: async (id, data) => {
    const response = await api.put(`/ingredients/${id}`, data);
    return response.data;
  },
  deleteIngredient: async (id) => {
    const response = await api.delete(`/ingredients/${id}`);
    return response.data;
  },
};

export default api;