// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor to add token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/joinus';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Staff Authentication
  staffSignup: async (data) => {
    const response = await api.post('/auth/staff/signup', data);
    return response.data;
  },

  staffLogin: async (data) => {
    const response = await api.post('/auth/staff/login', data);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('userType', 'staff');
    }
    return response.data;
  },

  // Customer Authentication
  customerSignup: async (data) => {
    const response = await api.post('/auth/customer/signup', data);
    return response.data;
  },

  customerLogin: async (data) => {
    const response = await api.post('/auth/customer/login', data);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('userType', 'customer');
    }
    return response.data;
  },

  // Common
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Staff API calls
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

// Customer API calls
export const customerAPI = {
  getProfile: async () => {
    const response = await api.get('/customer/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.patch('/customer/profile', data);
    return response.data;
  },

  getLoyaltyPoints: async () => {
    const response = await api.get('/customer/loyalty-points');
    return response.data;
  }
};

export default api;