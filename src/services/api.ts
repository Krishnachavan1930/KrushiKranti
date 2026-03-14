import axios from "axios";

export const API_ERROR_EVENT = "krushikranti:api-error";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Let axios set Content-Type automatically for FormData
    // For non-FormData requests, default to JSON
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      // Unauthorized - clear auth data and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    if (typeof window !== "undefined" && status !== 401) {
      window.dispatchEvent(
        new CustomEvent(API_ERROR_EVENT, {
          detail: { status, message },
        }),
      );
    }

    // Create a more informative error
    const enhancedError = new Error(message);
    (enhancedError as Error & { status?: number }).status = status;
    return Promise.reject(enhancedError);
  },
);

export default api;
