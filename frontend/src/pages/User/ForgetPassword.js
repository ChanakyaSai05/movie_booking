import React, { useEffect } from "react";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ForgetPassword } from "../../api/users";
import toast from "react-hot-toast";
import { showErrorToasts, extractErrorFromResponse } from "../../utils/errorHandler";

function Forget() {
  const navigate = useNavigate();  const onFinish = async (values) => {
    console.log(values);
    try {
      const response = await ForgetPassword(values);
      if (response.status === "success") {
        toast.success(response.message);
        toast.success("OTP sent to your email");
        navigate(`/reset/${encodeURIComponent(values.email)}`);
      } else {
        // Handle validation errors or other backend errors
        if (response.errors && Array.isArray(response.errors)) {
          showErrorToasts(response.errors);
        } else {
          showErrorToasts(response.message || "Failed to send reset link");
        }
      }
    } catch (error) {
      // Extract and show detailed error messages
      const extractedErrors = extractErrorFromResponse(error);
      showErrorToasts(extractedErrors);
    }
  };useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);  return (
    <>
      <main className="App-header">
        <h1>Welcome to BookMyShow</h1>
        <section className="auth-form-container mw-500 px-3">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Please enter a valid email" }
              ]}
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                style={{ fontSize: "1rem", fontWeight: "600" }}
              >
                Send Reset Link
              </Button>
            </Form.Item>
            
            <div className="auth-links">
              <p>
                Remember your password? <Link to="/login">Login Here</Link>
              </p>
            </div>
          </Form>
        </section>
      </main>
    </>
  );
}

export default Forget;
