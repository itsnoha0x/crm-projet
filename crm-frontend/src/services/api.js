import axios from 'axios';

const BASE_URL = '';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      'API Error:',
      error?.config?.url,
      error?.response?.status,
      error?.response?.data
    );
    return Promise.reject(error);
  }
);

export const customerAPI = {
  getAll: () =>
    api.get('/api/customers', { params: { size: 100 } })
       .then(res => ({ data: res.data.content ?? res.data })),
  getById: (id) => api.get(`/api/customers/${id}`),
  create: (data) => api.post('/api/customers', data),
  update: (id, data) => api.put(`/api/customers/${id}`, data),
  delete: (id) => api.delete(`/api/customers/${id}`),
};

export const loyaltyAPI = {
  createCard: (data) =>
    api.post('/api/loyalty/cards', data),
  getCardByCustomer: (customerId) =>
    api.get(`/api/loyalty/cards/customer/${customerId}`),
  getCardById: (id) =>
    api.get(`/api/loyalty/cards/${id}`),
  checkUpgrade: (customerId, balance) =>
    api.put(`/api/loyalty/cards/customer/${customerId}/check-upgrade`,
      null, { params: { balance } }),
  suspend: (id) =>
    api.put(`/api/loyalty/cards/${id}/suspend`),
};

export const pointsAPI = {
  earn: (data) => api.post('/api/points/earn', data),
  redeem: (data) => api.post('/api/points/redeem', data),
  getBalance: (customerId) =>
    api.get(`/api/points/${customerId}/balance`),
  getHistory: (customerId, size = 50) =>
    api.get(`/api/points/${customerId}/history`, { params: { size } })
       .then(res => ({ data: res.data.content ?? res.data })),
  simulateReservation: (data) =>
    api.post('/api/points/reservations', data),
};

export const benefitsAPI = {
  getByCardType: (cardType) =>
    api.get(`/api/benefits/${cardType}`),
  getAll: () =>
    api.get('/api/benefits'),
};

export default api;
