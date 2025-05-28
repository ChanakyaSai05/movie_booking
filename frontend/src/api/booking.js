import { axiosInstance } from "./index";

export const makePayment = async (token, amount) => {
  try {
    const response = await axiosInstance.post("/api/bookings/make-payment", {
      token,
      amount,
    });
    return response.data;
  } catch (error) {
    console.error("Payment error:", error);
    throw error;
  }
};

export const bookShow = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/bookings/book-show",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Booking error:", error);
    throw error;
  }
};

export const getAllBookings = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `/api/bookings/get-all-bookings/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Get bookings error:", error);
    throw error;
  }
};
