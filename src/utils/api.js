// API utilities for making requests to the backend

// Set the API base URL
export const API_BASE_URL = 'http://localhost:8000/api';
// Base URL (without /api) for media/static files
export const BASE_URL = 'http://localhost:8000';

/**
 * Fetch data from the API
 * @param {string} endpoint - The API endpoint to fetch from (without the base URL)
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - The response data
 */
export const fetchApi = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include', // Include cookies for authentication
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

/**
 * Post JSON data to the API
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - The data to post
 * @returns {Promise<any>} - The response data
 */
export const postApi = async (endpoint, data) => {
  return fetchApi(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Delete a resource from the API
 * @param {string} endpoint - The API endpoint to delete
 * @returns {Promise<any>} - The response data or null if no content
 */
export const deleteApi = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Try to parse error JSON, but some DELETE responses might not have a body
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Delete failed: ${response.status}`);
    }

    // Some DELETE operations return 204 No Content
    if (response.status === 204) {
      return null;
    }

    // If there's a JSON response body, return it
    try {
      return await response.json();
    } catch (e) {
      return null; // No JSON body
    }
  } catch (error) {
    console.error(`Delete Error (${endpoint}):`, error);
    throw error;
  }
};

/**
 * Post FormData to the API (for file uploads)
 * @param {string} endpoint - The API endpoint
 * @param {FormData} formData - The FormData object to post
 * @param {string} method - HTTP method (POST, PATCH, etc.)
 * @returns {Promise<any>} - The response data
 */
export const postFormData = async (endpoint, formData, method = 'POST') => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: method,
      credentials: 'include',
      // Don't set Content-Type header when sending FormData
      // The browser will set it automatically with the boundary
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

/**
 * Get the complete image URL for an image path
 * @param {string} imagePath - The relative image path
 * @returns {string} - The complete image URL
 */
export const getImageUrl = (imagePath) => {
  // Server fallback for placeholder image
  const serverPlaceholder = 'http://localhost:8000/media/posts/placeholder.jpg';
  
  if (!imagePath) return serverPlaceholder;
  
  // If the image path already includes the full domain (http), use it directly
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Handle different formats of paths
  // 1. If it's a media path that starts with /media/
  if (imagePath.startsWith('/media/')) {
    return `${BASE_URL}${imagePath}`;
  }
  
  // 2. If it's a media path that doesn't have the leading slash
  if (imagePath.startsWith('media/')) {
    return `${BASE_URL}/${imagePath}`;
  }
  
  // 3. If it's just a filename in the posts directory
  if (!imagePath.includes('/')) {
    return `${BASE_URL}/media/posts/${imagePath}`;
  }
  
  // 4. For any other path, just append to the base URL
  return `${BASE_URL}/${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`;
}; 