// API URL configuration
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' || 
                      window.location.port === '5173' || 
                      window.location.port === '3000';
const ENV_API_URL = import.meta.env.VITE_API_URL;
const LOCAL_API_URL = 'http://localhost:5000/api';

// ALWAYS prefer local API when running on localhost to prevent hitting expired prod servers
export const API_BASE_URL = isDevelopment ? LOCAL_API_URL : (ENV_API_URL || '');

console.log('API using URL:', API_BASE_URL);

// Get token
const getToken = () => localStorage.getItem("token");

// Fetch wrapper
async function fetchWithAuth(url, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // 🔥 Handle errors safely
    if (!response.ok) {
      const text = await response.text();
      console.error("API ERROR:", text);
      
      // Try to parse error message from backend
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // If can't parse JSON, use text
        errorMessage = text || errorMessage;
      }
      
      // Throw formatted error and flag it
      const err = new Error(errorMessage);
      err.isApiError = true;
      throw err;
    }

    return await response.json();
  } catch (error) {
    console.error("FETCH ERROR:", error.message);
    if (error.isApiError) {
      throw error;
    }
    throw new Error("Unable to connect to server");
  }
}

// ================= APIs =================

// Auth
export const authAPI = {
  register: (data) =>
    fetchWithAuth("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data) =>
    fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getProfile: () => fetchWithAuth("/auth/profile"),
};

// Courses
export const courseAPI = {
  getAll: () => fetchWithAuth("/courses"),
};

// Enrollment
export const enrollmentAPI = {
  getMyEnrollments: () => fetchWithAuth("/enrollments/my-enrollments"),
};

// AI
export const aiAPI = {
  chat: (data) =>
    fetchWithAuth("/ai/chat", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};