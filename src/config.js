// Base URL for API calls
const BASE_URL = import.meta.env.VITE_BASE_URL;

if (!BASE_URL) {
  throw new Error('BASE_URL is not defined. Please check your .env file.');
}

// API URL includes the /api path
export const API_BASE_URL = `${BASE_URL}/api`;
export { BASE_URL };