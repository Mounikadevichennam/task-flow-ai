import axios from 'axios';

const API = axios.create({
  baseURL: 'https://task-flow-ai-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization Bearer Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for global handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto redirect if already on login/register pages
      const currentPath = window.location.pathname;
      if (!['/login', '/register', '/welcome', '/forgot-password'].includes(currentPath)) {
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
