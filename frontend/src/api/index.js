import axios from "axios";

export const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: "http://localhost:5000",
});

axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(new Error("Session expired. Please login again."));
      }
      
      if (status === 403) {
        return Promise.reject(new Error("Access denied. You don't have permission."));
      }
      
      if (status === 404) {
        return Promise.reject(new Error("Resource not found."));
      }
      
      if (status >= 500) {
        return Promise.reject(new Error("Server error. Please try again later."));
      }
      
      // Return the error message from server if available
      const message = data?.message || data?.errors?.[0]?.msg || "An error occurred";
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Network error
      return Promise.reject(new Error("Network error. Please check your connection."));
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);
