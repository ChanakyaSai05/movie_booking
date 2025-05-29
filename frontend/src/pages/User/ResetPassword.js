import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { ResetPassword } from "../../api/users";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { showErrorToasts, extractErrorFromResponse } from "../../utils/errorHandler";

function Reset() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const response = await ResetPassword(values, email);
      if (response.status === "success") {
        toast.success(response.message);
        navigate("/login");
      } else {
        // Handle validation errors or other backend errors
        if (response.errors && Array.isArray(response.errors)) {
          showErrorToasts(response.errors);
        } else {
          showErrorToasts(response.message || "Failed to reset password");
        }
      }
    } catch (error) {      // Extract and show detailed error messages
      const extractedErrors = extractErrorFromResponse(error);
      showErrorToasts(extractedErrors);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <>
      <main className="App-header">
        <h1>Welcome to BookMyShow</h1>
        <section className="auth-form-container mw-500 px-3">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="OTP"
              name="otp"
              rules={[{ required: true, message: "OTP is required" }]}
            >
              <Input
                type="number"
                placeholder="Enter the OTP sent to your email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password
                placeholder="Enter your new password"
                size="large"
              />
            </Form.Item>
              <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isLoading}
                style={{ fontSize: "1rem", fontWeight: "600" }}
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </section>
      </main>
    </>
  );
}

export default Reset;
