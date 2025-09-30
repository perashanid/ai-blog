import axios from 'axios';

// In production, use relative URLs so it works with the same domain
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : (process.env.REACT_APP_API_URL || 'http://localhost:8000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes for AI generation and news digest
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage = error.response?.data?.error?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export const postsAPI = {
  // Get all posts
  getAllPosts: (page = 1, limit = 10) => {
    return api.get(`/posts?page=${page}&limit=${limit}`);
  },

  // Get single post by ID or slug
  getPost: (identifier) => {
    return api.get(`/posts/${identifier}`);
  },

  // Create new post (admin)
  createPost: (postData, credentials) => {
    const auth = btoa(`${credentials.username}:${credentials.password}`);
    return api.post('/admin/posts', postData, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });
  },

  // Get admin posts
  getAdminPosts: (credentials) => {
    const auth = btoa(`${credentials.username}:${credentials.password}`);
    return api.get('/admin/posts', {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });
  },

  // Get admin profile
  getAdminProfile: (credentials) => {
    const auth = btoa(`${credentials.username}:${credentials.password}`);
    return api.get('/admin/profile', {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });
  },

  // Get single post for editing (admin)
  getAdminPost: (postId, credentials) => {
    const auth = btoa(`${credentials.username}:${credentials.password}`);
    return api.get(`/admin/posts/${postId}`, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });
  },

  // Update post (admin)
  updatePost: (postId, postData, credentials) => {
    const auth = btoa(`${credentials.username}:${credentials.password}`);
    return api.put(`/admin/posts/${postId}`, postData, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });
  },

  // Delete post (admin)
  deletePost: (postId, credentials) => {
    const auth = btoa(`${credentials.username}:${credentials.password}`);
    return api.delete(`/admin/posts/${postId}`, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });
  },

  // Generate AI post (admin)
  generateAIPost: (credentials) => {
    const auth = btoa(`${credentials.username}:${credentials.password}`);
    return api.post('/admin/generate-ai', {}, {
      headers: {
        'Authorization': `Basic ${auth}`
      },
      timeout: 180000 // 3 minutes for AI generation
    });
  },

  // Generate tech news digest (admin)
  generateNewsDigest: (credentials) => {
    const auth = btoa(`${credentials.username}:${credentials.password}`);
    return api.post('/admin/generate-news-digest', {}, {
      headers: {
        'Authorization': `Basic ${auth}`
      },
      timeout: 180000 // 3 minutes for news digest generation
    });
  }
};

export default api;