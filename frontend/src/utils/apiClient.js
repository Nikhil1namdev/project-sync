import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

// Automatic interceptor to attach JWT authorization token
apiClient.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        const token = parsed?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Error parsing user token for authorization header:", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle expired or invalid token errors (401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const message = error.response.data?.message || "";
      if (message.includes("Not authorized") || message.includes("token failed")) {
        console.warn("Session expired or invalid token. Redirecting to login...");
        // Clear local storage session
        localStorage.removeItem("userInfo");
        // Clean redirect to login page
        window.location.href = "/Login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
