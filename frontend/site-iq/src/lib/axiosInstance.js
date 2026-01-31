// lib/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4500/api/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // if you're using cookies/sessions
});

// ✅ REQUEST INTERCEPTOR - Automatically add JWT token from localStorage
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get JWT token from localStorage
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('[Axios] Failed to get JWT token:', error);
      }
    }
    console.log(`[Axios Request] ${config.method?.toUpperCase()} ${config.url}`, config);
    return config;
  },
  (error) => {
    console.error('[Axios Request Error]', error);
    return Promise.reject(error);
  }
);

// ✅ RESPONSE LOGGER
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[Axios Response]`, response);
    return response;
  },
  (error) => {
    console.error('[Axios Response Error]', error.response || error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
