import {
  Col,
  Modal,
  Row,
  Form,
  Input,
  Button,
  Select,
  Table,
  Tag,
  Tooltip,
  Popconfirm,
} from "antd";

import { ShowLoading, HideLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useEffect, useState, useCallback } from "react";
// import { useSelector } from 'react-redux';
import { getAllMovies } from "../../api/movie";
import {
  addShow,
  deleteShow,
  getShowsByTheatre,
  updateShow,
} from "../../api/shows";
import moment from "moment";
import toast from "react-hot-toast";
import { showErrorToasts, extractErrorFromResponse } from "../../utils/errorHandler";

const ShowModal = ({
  isShowModalOpen,
  setIsShowModalOpen,
  selectedTheatre,
}) => {
  const [view, setView] = useState("table"); // vew can be table, add, edit
  const [movies, setMovies] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [shows, setShows] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const dispatch = useDispatch();  const getData = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const movieResponse = await getAllMovies();
      if (movieResponse.success) {
        setMovies(movieResponse.data);
      } else {
        const errors = movieResponse.errors || movieResponse.message || "Failed to load movies";
        showErrorToasts(errors);
      }

      const showResponse = await getShowsByTheatre({
        theatreId: selectedTheatre._id,
      });
      if (showResponse.success) {
        setShows(showResponse.data);
      } else {
        const errors = showResponse.errors || showResponse.message || "Failed to load shows";
        showErrorToasts(errors);
      }

      dispatch(HideLoading());
    } catch (err) {
      const extractedErrors = extractErrorFromResponse(err);
      showErrorToasts(extractedErrors);
      dispatch(HideLoading());
    }
  }, [dispatch, selectedTheatre._id]);  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response = null;
      if (view === "add") {
        response = await addShow({ ...values, theatre: selectedTheatre._id });
      } else {
        // console.log(view, selectedTheatre, selectedTheatre._id);
        response = await updateShow({
          ...values,
          showId: selectedShow._id,
          theatre: selectedTheatre._id,
        });
      }
      if (response.success) {
        getData();
        toast.success(response.message);
        setView("table");      } else {
        if (response.errors && Array.isArray(response.errors)) {
          showErrorToasts(response.errors);
        } else {
          showErrorToasts(response.message || "Operation failed");
        }
      }
      dispatch(HideLoading());
    } catch (err) {
      const extractedErrors = extractErrorFromResponse(err);
      showErrorToasts(extractedErrors);
      dispatch(HideLoading());
    }
  };

  const handleCancel = () => {
    setIsShowModalOpen(false);
  };  const handleDelete = async (showId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteShow({ showId: showId });
      if (response.success) {
        toast.success(response.message);
        getData();      } else {
        if (response.errors && Array.isArray(response.errors)) {
          showErrorToasts(response.errors);
        } else {
          showErrorToasts(response.message || "Failed to delete show");
        }
      }
      dispatch(HideLoading());
    } catch (err) {
      const extractedErrors = extractErrorFromResponse(err);
      showErrorToasts(extractedErrors);
      dispatch(HideLoading());
    }
  };
  const columns = [
    {
      title: "Show Name",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <span className="show-name">{name}</span>
      ),
    },
    {
      title: "Show Date",
      dataIndex: "date",
      render: (text) => (
        <div className="show-date">
          <CalendarOutlined className="date-icon" />
          <span>{moment(text).format("MMM Do YYYY")}</span>
        </div>
      ),
    },
    {
      title: "Show Time",
      dataIndex: "time",
      render: (text) => (
        <div className="show-time">
          <ClockCircleOutlined className="time-icon" />
          <span>{moment(text, "HH:mm").format("hh:mm A")}</span>
        </div>
      ),
    },
    {
      title: "Movie",
      dataIndex: "movie",
      render: (text, data) => (
        <Tag color="blue" className="movie-tag">
          {data.movie.title}
        </Tag>
      ),
    },
    {
      title: "Ticket Price",
      dataIndex: "ticketPrice",
      key: "ticketPrice",
      render: (price) => (
        <div className="ticket-price">
          <DollarOutlined className="price-icon" />
          <span>₹{price}</span>
        </div>
      ),
    },
    {
      title: "Total Seats",
      dataIndex: "totalSeats",
      key: "totalSeats",
      render: (seats) => (
        <div className="seat-info">
          <UserOutlined className="seat-icon" />
          <span>{seats}</span>
        </div>
      ),
    },
    {
      title: "Available Seats",
      dataIndex: "seats",
      render: (text, data) => {
        const available = data.totalSeats - data.bookedSeats.length;
        const percentage = (available / data.totalSeats) * 100;
        return (
          <Tag 
            color={percentage > 70 ? 'green' : percentage > 30 ? 'orange' : 'red'}
            className="availability-tag"
          >
            {available} available
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      render: (text, data) => {
        return (
          <div className="show-actions">
            <Tooltip title="Edit Show">
              <Button
                type="text"
                size="small"
                className="action-btn edit-btn"
                icon={<EditOutlined />}
                onClick={() => {
                  setView("edit");
                  setSelectedMovie(data.movie);
                  setSelectedShow({
                    ...data,
                    date: moment(data.date).format("YYYY-MM-DD"),
                  });
                }}
              />
            </Tooltip>
            <Popconfirm
              title="Delete Show"
              description="Are you sure you want to delete this show?"
              onConfirm={() => handleDelete(data._id)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete Show">
                <Button
                  type="text"
                  size="small"
                  className="action-btn delete-btn"
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </Popconfirm>
          </div>
        );
      },
    },
  ];  useEffect(() => {
    getData();
  }, [getData]);
  return (
    <Modal
      centered
      title={
        <div className="show-modal-header">
          <h2 className="modal-title">🎬 {selectedTheatre.name}</h2>
          <p className="modal-subtitle">Manage shows and schedules</p>
        </div>
      }
      open={isShowModalOpen}
      onCancel={handleCancel}
      width={1200}
      footer={null}
      className="modern-modal show-modal"
    >
      <div className="show-modal-content">
        <div className="show-header">
          <div className="view-title">
            <h3 className="section-title">
              {view === "table"
                ? "📅 Show Schedule"
                : view === "add"
                ? "➕ Add New Show"
                : "✏️ Edit Show"}
            </h3>
            {view === "table" && (
              <p className="section-subtitle">
                Manage all shows for {selectedTheatre.name}
              </p>
            )}
          </div>
          {view === "table" && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              className="add-show-btn"
              onClick={() => setView("add")}
            >
              Add New Show
            </Button>
          )}
        </div>

        {view === "table" && (
          <div className="shows-table-wrapper">
            <Table 
              dataSource={shows} 
              columns={columns}
              className="modern-table shows-table"
              pagination={{
                pageSize: 6,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} shows`
              }}
              scroll={{ x: 1000 }}
              rowKey="_id"
            />
          </div>
        )}        {(view === "add" || view === "edit") && (
          <div className="show-form-wrapper">
            <Form
              layout="vertical"
              className="show-form"
              initialValues={view === "edit" ? selectedShow : null}
              onFinish={onFinish}
            >
              <Row gutter={[24, 16]}>
                <Col span={8}>
                  <Form.Item
                    label="Show Name"
                    name="name"
                    rules={[
                      { required: true, message: "Show name is required!" },
                    ]}
                  >
                    <Input
                      placeholder="Enter show name"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Show Date"
                    name="date"
                    rules={[
                      { required: true, message: "Show date is required!" },
                    ]}
                  >
                    <Input
                      type="date"
                      size="large"
                      className="form-input"
                      min={moment().format("YYYY-MM-DD")}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Show Time"
                    name="time"
                    rules={[
                      { required: true, message: "Show time is required!" },
                    ]}
                  >
                    <Input
                      type="time"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Select Movie"
                    name="movie"
                    rules={[{ required: true, message: "Movie is required!" }]}
                  >
                    <Select
                      placeholder="Select a movie"
                      size="large"
                      className="form-select"
                      defaultValue={selectedMovie && selectedMovie.title}
                      options={movies?.map((movie) => ({
                        key: movie._id,
                        value: movie._id,
                        label: movie.title,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Ticket Price (₹)"
                    name="ticketPrice"
                    rules={[
                      { required: true, message: "Ticket price is required!" },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Enter ticket price"
                      size="large"
                      className="form-input"
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Total Seats"
                    name="totalSeats"
                    rules={[
                      { required: true, message: "Total seats are required!" },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Enter total seats"
                      size="large"
                      className="form-input"
                      min={1}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <div className="form-actions">
                <Button
                  type="default"
                  size="large"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => setView("table")}
                  className="back-button"
                >
                  Go Back
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="submit-button"
                >
                  {view === "add" ? "Add Show" : "Update Show"}
                </Button>
              </div>
            </Form>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ShowModal;
