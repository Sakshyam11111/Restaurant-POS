import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      localStorage.removeItem('isAdmin');
      
      // Redirect to appropriate login page
      const isAdmin = window.location.pathname.includes('admin');
      window.location.href = isAdmin ? '/admin' : '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Admin authentication
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

  // Staff authentication
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
  }
};

export const orderAPI = {
  createOrder: async (data) => {
    const response = await api.post('/orders', data);
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
  }
};

export const tableAPI = {
  initializeTables: async () => {
    const response = await api.post('/tables/initialize');
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
  }
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
  }
};

export default api;