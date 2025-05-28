import { axiosInstance } from "./index";

//Register new User
export const RegisterUser = async (value) => {
  try {
    const response = await axiosInstance.post("api/users/register", value);
    console.log("Registration response:", response);
    return response.data;
  } catch (err) {
    console.error("Registration error:", err);
    throw err;
  }
};

export const LoginUser = async (value) => {
  try {
    const response = await axiosInstance.post("/api/users/login", value);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("api/users/get-current-user");
    return response.data;
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
};

export const ForgetPassword = async (value) => {
  try {
    const response = await axiosInstance.patch(
      "/api/users/forgetpassword",
      value
    );
    return response.data;
  } catch (err) {
    console.error("Forget password error:", err);
    throw err;
  }
};

export const ResetPassword = async (value, id) => {
  try {
    const response = await axiosInstance.patch(
      `/api/users/resetpassword/${id}`,
      value
    );
    return response.data;
  } catch (err) {
    console.error("Reset password error:", err);
    throw err;
  }
};
