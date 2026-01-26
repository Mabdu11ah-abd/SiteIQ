// lib/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4500/api', // fixed the typo: 'locahost' → 'localhost'
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // if you're using cookies/sessions
});

// ✅ REQUEST LOGGER
axiosInstance.interceptors.request.use(
  (config) => {
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
