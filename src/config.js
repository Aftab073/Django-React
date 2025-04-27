// Base URL for API calls - hardcoded for production to avoid environment variable issues
const API_HOST = 'https://blog-backend-hpl0.onrender.com';

// Export as constants to ensure they're available throughout the app
export const BASE_URL = API_HOST;
export const API_BASE_URL = `${API_HOST}/api`;