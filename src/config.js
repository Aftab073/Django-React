// Base URL for API calls
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://blog-backend-hpl0.onrender.com';

// API URL includes the /api path
export const API_BASE_URL = `${BASE_URL}/api`;
export { BASE_URL };