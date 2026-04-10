const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth token
const getToken = () => localStorage.getItem('token');

// Generic fetch wrapper
async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  register: (data) => fetchWithAuth('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => fetchWithAuth('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => fetchWithAuth('/auth/profile'),
  updateProfile: (data) => fetchWithAuth('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

// Courses API
export const courseAPI = {
  getAll: () => fetchWithAuth('/courses'),
  getById: (id) => fetchWithAuth(`/courses/${id}`),
  getMyCourses: () => fetchWithAuth('/courses/my-courses/instructor'),
  create: (data) => fetchWithAuth('/courses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchWithAuth(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchWithAuth(`/courses/${id}`, { method: 'DELETE' }),
};

// Enrollments API
export const enrollmentAPI = {
  enroll: (courseId) => fetchWithAuth('/enrollments', { method: 'POST', body: JSON.stringify({ courseId }) }),
  getMyEnrollments: () => fetchWithAuth('/enrollments/my-enrollments'),
  updateProgress: (id, lessonId) => fetchWithAuth(`/enrollments/${id}/progress`, { method: 'PUT', body: JSON.stringify({ lessonId }) }),
};

// Admin API
export const adminAPI = {
  getStats: () => fetchWithAuth('/admin/stats'),
  getAllUsers: () => fetchWithAuth('/admin/users'),
  deleteUser: (id) => fetchWithAuth(`/admin/users/${id}`, { method: 'DELETE' }),
  updateUserRole: (id, role) => fetchWithAuth(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  getAllCourses: () => fetchWithAuth('/admin/courses'),
  publishCourse: (id, publish) => fetchWithAuth(`/admin/courses/${id}/publish`, { method: 'PUT', body: JSON.stringify({ publish }) }),
};

export default { authAPI, courseAPI, enrollmentAPI, adminAPI };
