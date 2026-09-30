import axios from 'axios';

export const api = axios.create({
  // Asegúrate de que apunte a la variable o directamente al backend de Render
  baseURL: import.meta.env.VITE_API_URL || 'https://ecomonitor-backend-apn2.onrender.com'
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;