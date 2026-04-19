const API_BASE_URL = import.meta.env.VITE_API_URL;

// ❗ Safety check
if (!API_BASE_URL) {
  throw new Error("VITE_API_URL not set in .env");
}

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
      throw new Error(`HTTP ${response.status}`);
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