import React, { useEffect, useState } from "react";
import { Table, Button, Tag } from "antd";
import TheatreFormModal from "./TheatreFormModal";
import DeleteTheatreModal from "./DeleteTheatreModal";
import { EditOutlined, DeleteOutlined, PlusOutlined, CalendarOutlined } from "@ant-design/icons";
import { getAllTheatres } from "../../api/theatre";
import { useSelector, useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";
import ShowModal from "./ShowModal";
import toast from "react-hot-toast";

function TheatreList() {
  const { user } = useSelector((state) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [formType, setFormType] = useState("add");
  const [theatres, setTheatres] = useState([]);
  const dispatch = useDispatch();const getData = async () => {
    dispatch(ShowLoading());
    try {
      const response = await getAllTheatres(user._id);
      if (response.success) {
        const allTheatres = response.data;
        setTheatres(
          allTheatres.map(function (item) {
            return { ...item, key: `theatre-${item._id}` };
          })
        );
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (err) {
      dispatch(HideLoading());
      toast.error(err.message);
    }
  };  useEffect(() => {
    const fetchTheatres = async () => {
      dispatch(ShowLoading());
      try {
        const response = await getAllTheatres(user._id);
        if (response.success) {
          const allTheatres = response.data;
          setTheatres(
            allTheatres.map(function (item) {
              return { ...item, key: `theatre-${item._id}` };
            })
          );
        } else {
          toast.error(response.message);
        }
        dispatch(HideLoading());
      } catch (err) {
        dispatch(HideLoading());
        toast.error(err.message);
      }
    };
    
    if (user && user._id) {
      fetchTheatres();
    }
  }, [dispatch, user]);
  const columns = [
    {
      title: "Theatre Name",
      dataIndex: "name",
      key: "name",
      className: "font-weight-bold",
      render: (name) => (
        <span className="theatre-name-text">{name}</span>
      )
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      render: (address) => (
        <span className="theatre-address">{address}</span>
      )
    },
    { 
      title: "Phone", 
      dataIndex: "phone", 
      key: "phone",
      render: (phone) => (
        <span className="phone-number">{phone}</span>
      )
    },
    { 
      title: "Email", 
      dataIndex: "email", 
      key: "email",
      ellipsis: true,
      render: (email) => (
        <span className="email-address">{email}</span>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: function (status, data) {
        return (
          <Tag 
            color={data.isActive ? "green" : "orange"}
            className="status-tag"
          >
            {data.isActive ? "Approved" : "Pending/Blocked"}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, data) => {
        return (
          <div className="theatre-actions">
            <Button
              type="default"
              size="small"
              className="action-btn edit-btn"
              icon={<EditOutlined />}
              onClick={() => {
                setIsModalOpen(true);
                setFormType("edit");
                setSelectedTheatre(data);
              }}
              title="Edit Theatre"
            />
            <Button
              type="default"
              size="small"
              className="action-btn delete-btn"
              icon={<DeleteOutlined />}
              onClick={() => {
                setIsDeleteModalOpen(true);
                setSelectedTheatre(data);
              }}
              title="Delete Theatre"
            />
            {data.isActive && (
              <Button
                type="primary"
                size="small"
                className="action-btn shows-btn"
                icon={<CalendarOutlined />}
                onClick={() => {
                  setIsShowModalOpen(true);
                  setSelectedTheatre(data);
                }}
                title="Manage Shows"
              >
                Shows
              </Button>
            )}
          </div>
        );
      },
    },
  ];  return (
    <div className="theatre-list-container">
      <div className="theatre-list-header">
        <div className="header-content">
          {/* <h3>My Theatres</h3> */}
          <p>Manage your theatre properties and show schedules</p>
        </div>
        <Button
          type="primary"
          className="add-theatre-btn"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsModalOpen(true);
            setFormType("add");
          }}
        >
          Add Theatre
        </Button>
      </div>
      
      {theatres && theatres.length > 0 ? (
        <div className="table-wrapper">
          <Table 
            columns={columns} 
            dataSource={theatres}
            className="modern-table"
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} theatres`
            }}
            scroll={{ x: 800 }}
          />
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🏢</div>
          <h3>No Theatres Yet</h3>
          <p>Start by adding your first theatre to begin managing shows and bookings.</p>
          <Button
            type="primary"
            className="start-btn"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsModalOpen(true);
              setFormType("add");
            }}
          >
            Add Your First Theatre
          </Button>
        </div>
      )}
      
      {isModalOpen && (
        <TheatreFormModal
          isModalOpen={isModalOpen}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
          setIsModalOpen={setIsModalOpen}
          formType={formType}
          getData={getData}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteTheatreModal
          isDeleteModalOpen={isDeleteModalOpen}
          selectedTheatre={selectedTheatre}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          getData={getData}
          setSelectedTheatre={setSelectedTheatre}
        />
      )}
      {isShowModalOpen && (
        <ShowModal
          isShowModalOpen={isShowModalOpen}
          setIsShowModalOpen={setIsShowModalOpen}
          selectedTheatre={selectedTheatre}
        />
      )}
    </div>
  );
}

export default TheatreList;
