import { Col, Modal, Row, Form, Input, Select, Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import { addMovie, updateMovie } from "../../api/movie";
import moment from "moment";
import toast from "react-hot-toast";
import { showErrorToasts, extractErrorFromResponse } from "../../utils/errorHandler";

const MovieForm = ({
  isModalOpen,
  setIsModalOpen,
  selectedMovie,
  setSelectedMovie,
  formType,
  getData,
}) => {
  const dispatch = useDispatch();

  if (selectedMovie) {
    selectedMovie.releaseDate = moment(selectedMovie.releaseDate).format(
      "YYYY-MM-DD"
    );
  }  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response = null;
      if (formType === "add") {
        response = await addMovie(values);
      } else {
        response = await updateMovie({ ...values, movieId: selectedMovie._id });
      }
      if (response.success) {
        getData();
        toast.success(response.message);
        setIsModalOpen(false);      } else {
        // Handle validation errors or other backend errors
        if (response.errors && Array.isArray(response.errors)) {
          showErrorToasts(response.errors);
        } else {
          showErrorToasts(response.message || "Operation failed");
        }
      }
      setSelectedMovie(null);
      dispatch(HideLoading());
    } catch (err) {
      dispatch(HideLoading());
      // Extract and show detailed error messages
      const extractedErrors = extractErrorFromResponse(err);
      showErrorToasts(extractedErrors);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };
  return (
    <Modal
      centered
      title={formType === "add" ? "Add New Movie" : "Edit Movie"}
      open={isModalOpen}
      onCancel={handleCancel}
      width={800}
      footer={null}
      className="modern-modal"
    >
      <Form layout="vertical" initialValues={selectedMovie} onFinish={onFinish}>
        <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
          <Col span={24}>
            <Form.Item
              label="Movie Name"
              name="title"
              rules={[{ required: true, message: "Movie name is required!" }]}
            >
              <Input placeholder="Enter the movie name" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required!" }]}
            >
              <TextArea rows="4" placeholder="Enter the description" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
              <Col span={8}>
                <Form.Item
                  label="Movie Duration (in min)"
                  name="duration"
                  rules={[
                    { required: true, message: "Movie duration is required!" },
                  ]}
                >
                  <Input type="number" placeholder="Enter the movie duration" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Select Movie Language"
                  name="language"
                  rules={[
                    { required: true, message: "Movie language is required!" },
                  ]}
                >
                  <Select
                    placeholder="Select Language"
                    options={[
                      { value: "English", label: "English" },
                      { value: "Hindi", label: "Hindi" },
                      { value: "Punjabi", label: "Punjabi" },
                      { value: "Telugu", label: "Telugu" },
                      { value: "Bengali", label: "Bengali" },
                      { value: "German", label: "German" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Release Date"
                  name="releaseDate"
                  rules={[
                    {
                      required: true,
                      message: "Movie Release Date is required!",
                    },
                  ]}
                >
                  <Input type="date" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
              <Col span={8}>
                <Form.Item
                  label="Select Movie Genre"
                  name="genre"
                  rules={[
                    { required: true, message: "Movie genre is required!" },
                  ]}
                >
                  <Select
                    placeholder="Select Movie"
                    options={[
                      { value: "Action", label: "Action" },
                      { value: "Comedy", label: "Comedy" },
                      { value: "Horror", label: "Horror" },
                      { value: "Love", label: "Love" },
                      { value: "Patriot", label: "Patriot" },
                      { value: "Bhakti", label: "Bhakti" },
                      { value: "Thriller", label: "Thriller" },
                      { value: "Mystery", label: "Mystery" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  label="Poster URL"
                  name="poster"
                  rules={[
                    { required: true, message: "Movie Poster is required!" },
                  ]}
                >
                  <Input placeholder="Enter the poster URL" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            className="submit-button"
            size="large"
          >
            {formType === "add" ? "Add Movie" : "Update Movie"}
          </Button>
          <Button 
            className="mt-3 cancel-button" 
            block 
            onClick={handleCancel}
            size="large"
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MovieForm;
