// Production backend URL - FORCE CORRECT URL
const PROD_API_URL = 'https://edunexa-lms-zx8q.onrender.com/api';
const API_BASE_URL = PROD_API_URL; // Force production URL

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
      
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("FETCH ERROR:", error.message);
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