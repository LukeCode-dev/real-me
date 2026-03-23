import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('rm_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// ─── Avatar ──────────────────────────────────────
export const avatarAPI = {
  create: (data: FormData) =>
    api.post('/avatars', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  get: (id: string) => api.get(`/avatars/${id}`),
  update: (id: string, data: any) => api.put(`/avatars/${id}`, data),
  getMeasurements: (id: string) => api.get(`/avatars/${id}/measurements`),
  getRecommendedSize: (avatarId: string, productId: string) =>
    api.get(`/avatars/${avatarId}/size-recommendation/${productId}`),
};

// ─── Products ────────────────────────────────────
export const productAPI = {
  getAll: (params?: { category?: string; brand?: string; page?: number }) =>
    api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  search: (query: string) => api.get('/products/search', { params: { q: query } }),
  getCategories: () => api.get('/products/categories'),
};

// ─── Stores ──────────────────────────────────────
export const storeAPI = {
  getAll: () => api.get('/stores'),
  getById: (id: string) => api.get(`/stores/${id}`),
  getProducts: (storeId: string) => api.get(`/stores/${storeId}/products`),
};

// ─── Orders ──────────────────────────────────────
export const orderAPI = {
  create: (data: {
    items: { productId: string; size: string; color: string; quantity: number }[];
    shippingAddress: any;
    paymentMethod: string;
  }) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
};

// ─── Try-On ──────────────────────────────────────
export const tryOnAPI = {
  simulate: (avatarId: string, productId: string, size: string, color: string) =>
    api.post('/try-on/simulate', { avatarId, productId, size, color }),
};

export default api;
