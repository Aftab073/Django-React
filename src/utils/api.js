// API utilities for making requests to the backend
import { API_BASE_URL, BASE_URL } from '../config';

/**
 * Fetch data from the API
 */
export const fetchApi = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      mode: 'cors',
      credentials: 'omit',
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
 */
export const deleteApi = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'omit', // Don't send credentials for cross-origin requests
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
 */
export const postFormData = async (endpoint, formData, method = 'POST') => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: method,
      mode: 'cors',
      credentials: 'omit', // Don't send credentials for cross-origin requests
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
 */
export const getImageUrl = (imagePath) => {
  // Import BASE_URL from config to ensure it's available
  const baseUrl = import.meta.env.VITE_BASE_URL || 'https://blog-backend-hpl0.onrender.com';
  
  // Server fallback for placeholder image
  const serverPlaceholder = `${baseUrl}/media/posts/placeholder.jpg`;

  if (!imagePath) return serverPlaceholder;
  
  // If the image path already includes the full domain (http), use it directly
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Handle different formats of paths
  // 1. If it's a media path that starts with /media/
  if (imagePath.startsWith('/media/')) {
    return `${baseUrl}${imagePath}`;
  }
  
  // 2. If it's a media path that doesn't have the leading slash
  if (imagePath.startsWith('media/')) {
    return `${baseUrl}/${imagePath}`;
  }
  
  // 3. If it's just a filename in the posts directory
  if (!imagePath.includes('/')) {
    return `${baseUrl}/media/posts/${imagePath}`;
  }
  
  // 4. For any other path, just append to the base URL
  return `${baseUrl}/${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`;
};