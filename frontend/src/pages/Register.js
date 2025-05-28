import React from "react";
import { Form, Button, Input, Radio } from "antd";
import { Link } from "react-router-dom";
import { RegisterUser } from "../api/users";
import toast from "react-hot-toast";
import {
  showErrorToasts,
  extractErrorFromResponse,
} from "../utils/errorHandler";

function Register() {
  const onFinish = async (values) => {
    try {
      const response = await RegisterUser(values);
      if (response.success) {
        toast.success(response.message);
      } else {
        // Handle validation errors or other backend errors
        if (response.errors && Array.isArray(response.errors)) {
          showErrorToasts(response.errors);
        } else {
          showErrorToasts(response.message || "Registration failed");
        }
      }
    } catch (error) {
      // Extract and show detailed error messages
      const extractedErrors = extractErrorFromResponse(error);
      showErrorToasts(extractedErrors);
    }
  };
  return (
    <>
      <main className="App-header">
        <h1>Welcome to BookMyShow</h1>
        <section className="auth-form-container mw-500 px-3">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Name"
              htmlFor="name"
              name="name"
              className="d-block"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                size="large"
              />
            </Form.Item>
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
            <Form.Item
              label="Register as a Partner"
              htmlFor="role"
              name="role"
              className="d-block text-center"
              initialValue={false}
              rules={[{ required: true, message: "Please select an option" }]}
            >
              <div className="radio-group-container">
                <Radio.Group name="radiogroup" className="flex-start">
                  <Radio value={"partner"}>Yes</Radio>
                  <Radio value={"user"}>No</Radio>
                </Radio.Group>
              </div>
            </Form.Item>
            <Form.Item className="d-block">
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{ fontSize: "1rem", fontWeight: "600" }}
              >
                Create Account
              </Button>
            </Form.Item>
            <div className="auth-links">
              <p>
                Already a User? <Link to="/login">Login now</Link>
              </p>
            </div>
          </Form>
        </section>
      </main>
    </>
  );
}

export default Register;
