import { Col, Modal, Row, Form, Input, Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";
import { useDispatch, useSelector } from "react-redux";
import { addTheatre, updateTheatre } from "../../api/theatre";
import toast from "react-hot-toast";
import {
  showErrorToasts,
  extractErrorFromResponse,
} from "../../utils/errorHandler";
import { useState } from "react";

const TheatreForm = ({
  isModalOpen,
  setIsModalOpen,
  selectedTheatre,
  setSelectedTheatre,
  formType,
  getData,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const onFinish = async (values) => {
    setIsSubmitting(true);
    try {
      dispatch(ShowLoading());
      let response = null;
      if (formType === "add") {
        response = await addTheatre({ ...values, owner: user._id });
      } else {
        values.theatreId = selectedTheatre._id;
        response = await updateTheatre(values);
      }
      if (response.success) {
        getData();
        toast.success(response.message);
        setIsModalOpen(false);
      } else {
        // Handle validation errors or other backend errors
        if (response.errors && Array.isArray(response.errors)) {
          showErrorToasts(response.errors);
        } else {
          showErrorToasts(response.message || "Operation failed");
        }
      }
      setSelectedTheatre(null);
      dispatch(HideLoading());
    } catch (err) {      dispatch(HideLoading());
      // Extract and show detailed error messages
      const extractedErrors = extractErrorFromResponse(err);
      showErrorToasts(extractedErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedTheatre(null);
  };
  return (
    <Modal
      centered
      title={formType === "add" ? "Add New Theatre" : "Edit Theatre"}
      open={isModalOpen}
      onCancel={handleCancel}
      width={800}
      footer={null}
      className="modern-modal"
    >
      <Form
        layout="vertical"
        initialValues={selectedTheatre}
        onFinish={onFinish}
        className="theatre-form"
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Theatre Name"
              name="name"
              rules={[{ required: true, message: "Theatre name is required!" }]}
            >
              <Input
                placeholder="Enter the theatre name"
                size="large"
                className="form-input"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Address"
              name="address"
              rules={[
                { required: true, message: "Theatre address is required!" },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Enter the complete address"
                className="form-input"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                type="email"
                placeholder="Enter the email address"
                size="large"
                className="form-input"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Phone number is required!",
                },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number!",
                },
              ]}
            >
              <Input
                placeholder="Enter 10-digit phone number"
                size="large"
                className="form-input"
                maxLength={10}
              />
            </Form.Item>
          </Col>
        </Row>        <div className="form-actions">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="submit-button"
            loading={isSubmitting}
          >
            {formType === "add" ? "Add Theatre" : "Update Theatre"}
          </Button>
          <Button 
            size="large" 
            onClick={handleCancel} 
            className="cancel-button"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TheatreForm;
