import React from "react";
import { Form, Button, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../api/users";
import toast from "react-hot-toast";
import { showErrorToasts, extractErrorFromResponse } from "../utils/errorHandler";

function Login() {
  const navigate = useNavigate();  const onFinish = async (values) => {
    try {
      const response = await LoginUser(values);
      if (response.success) {
        console.log(response);
        toast.success(response.message);
        localStorage.setItem("token", response.data);
        navigate("/");
      } else {
        // Handle validation errors or other backend errors
        if (response.errors && Array.isArray(response.errors)) {
          showErrorToasts(response.errors);
        } else {
          showErrorToasts(response.message || "Login failed");
        }
      }
    } catch (err) {
      console.log(err);
      // Extract and show detailed error messages
      const extractedErrors = extractErrorFromResponse(err);
      showErrorToasts(extractedErrors);
    }
  };return (
    <>
      <main className="App-header">
        <h1>Welcome to BookMyShow</h1>
        <section className="auth-form-container mw-500 px-3">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              htmlFor="email"
              name="email"
              className="d-block"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                id="email"
                type="text"
                placeholder="Enter your email"
                size="large"
              />
            </Form.Item>
            <Form.Item
              label="Password"
              htmlFor="password"
              name="password"
              className="d-block"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password
                id="password"
                placeholder="Enter your password"
                size="large"
              />
            </Form.Item>
            <Form.Item className="d-block">
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{ fontSize: "1rem", fontWeight: "600" }}
              >
                Sign In
              </Button>
            </Form.Item>
            <div className="auth-links">
              <p>
                New to BookMyShow? <Link to="/register">Create Account</Link>
              </p>
              <p>
                <Link to="/forget">Forgot your password?</Link>
              </p>
            </div>
          </Form>
        </section>
      </main>
    </>
  );
}

export default Login;
