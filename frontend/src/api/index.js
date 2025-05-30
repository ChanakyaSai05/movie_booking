import axios from "axios";
import toast from "react-hot-toast";
import { showErrorToasts } from "../utils/errorHandler";

export const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: import.meta.env.REACT_APP_BASE_URL || "http://localhost:5000/api",
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
    console.log(error, "error in axios interceptor");
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      if (status === 401) {
        // Unauthorized - clear token and redirect to login (only critical error that shows toast)
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        return Promise.reject(
          new Error("Session expired. Please login again.")
        );
      }

      if (status === 429) {
        // Rate limit exceeded - show toast since this is a system-level error
        const message =
          data?.message || "Too many requests. Please try again later.";
        toast.error(message);
        return Promise.reject(new Error(message));
      }

      // For other errors, let components handle the toast notifications
      // Just pass through the error message from server
      const message =
        data?.message || data?.errors?.[0]?.msg || "An error occurred";
      console.log(data, "data");
      if (Array.isArray(data.errors)) {
        // If there are multiple validation errors, show them as individual toasts
        showErrorToasts(data.errors);
      } else {
      }
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Network error - this is critical so we show toast
      toast.error("Network error. Please check your connection.");
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);
