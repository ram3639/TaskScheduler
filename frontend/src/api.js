import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://taskscheduler-5rbv.onrender.com/api'
    : 'http://localhost:5000/api',
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data, error.config?.url);
    console.error('Full error:', error);
    return Promise.reject(error);
  }
);

// Test backend connection on app load
console.log('🔍 Testing backend connection...');
console.log('🔍 API Base URL:', process.env.NODE_ENV === 'production' 
  ? 'https://taskscheduler-5rbv.onrender.com/api'
  : 'http://localhost:5000/api');

api.get('/test')
  .then(response => {
    console.log('✅ Backend connection successful:', response.data);
  })
  .catch(error => {
    console.error('❌ Backend connection failed:', error);
    console.error('❌ Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
  });

export default api; 