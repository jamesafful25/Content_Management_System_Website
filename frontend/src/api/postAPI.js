import api from './axios.js'

export const postAPI = {
  // Public
  getAll: (params) => api.get('/posts', { params }),
  getFeatured: (limit = 5) => api.get('/posts/featured', { params: { limit } }),
  getBySlug: (slug) => api.get(`/posts/slug/${slug}`),

  // Admin
  adminGetAll: (params) => api.get('/posts/admin/all', { params }),
  adminGetById: (id) => api.get(`/posts/admin/${id}`),
  create: (formData) => api.post('/posts/admin', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/posts/admin/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/posts/admin/${id}`)
}
