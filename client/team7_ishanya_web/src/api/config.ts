import axios from 'axios';
import DOMPurify from 'dompurify'
export const API_BASE_URL = "https://team7.pythonanywhere.com";


// sanitization function for request data
const sanitizeRequestData = (data) => {
  if (!data) return data;
  
  // Handle different data types
  if (typeof data === 'string') {
    return DOMPurify.sanitize(data, { ALLOWED_TAGS: [] });
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeRequestData(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeRequestData(value);
    }
    return sanitized;
  }
  
  return data;
};
// axios instance with interceptors
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for sanitization
api.interceptors.request.use(config => {
  if (config.data) {
    config.data = sanitizeRequestData(config.data);
  }
  return config;
});