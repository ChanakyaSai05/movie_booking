import React, { useState, useEffect } from "react";
import { getAllTheatresForAdmin, updateTheatre } from "../../api/theatre";
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import { Table, Button, Tag } from "antd";
import toast from "react-hot-toast";

function TheatresTable() {
  const [theatres, setTheatres] = useState([]);
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllTheatresForAdmin();
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
      console.log(err);
      toast.error(err.message);
    }
  };  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(ShowLoading());
        const response = await getAllTheatresForAdmin();
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
        console.log(err);
        toast.error(err.message);
        dispatch(HideLoading());
      }
    };
    fetchData();
  }, [dispatch]);

  const handleStatusChange = async (theatre) => {
    try {
      dispatch(ShowLoading());
      const values = {
        ...theatre,
        theatreId: theatre._id,
        isActive: !theatre.isActive,
      };      const response = await updateTheatre(values);
      if (response.success) {
        toast.success(response.message);
        getData();
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  const columns = [
    { 
      title: "Theatre Name", 
      dataIndex: "name", 
      key: "name",
      className: "font-weight-bold"
    },
    { 
      title: "Address", 
      dataIndex: "address", 
      key: "address",
      ellipsis: true
    },
    {
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
      render: (text, data) => {
        return (
          <span className="owner-name">
            {data.owner && data.owner.name}
          </span>
        );
      },
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
      render: (status, data) => {
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
          <div className="action-buttons">
            <Button 
              type={data.isActive ? "default" : "primary"}
              className={data.isActive ? "block-btn" : "approve-btn"}
              onClick={() => handleStatusChange(data)}
              size="small"
            >
              {data.isActive ? "Block" : "Approve"}
            </Button>
          </div>
        );
      },
    },
  ];  return (
    <div className="theatres-table-container">
      {theatres && theatres.length > 0 ? (
        <div className="table-wrapper">
          <div className="table-header">
            <h3>Theatre Management</h3>
            <p>Approve or block theatre registrations</p>
          </div>
          <Table 
            dataSource={theatres} 
            columns={columns}
            className="modern-table"
            pagination={{
              pageSize: 10,
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
          <div className="empty-icon">🎭</div>
          <h3>No Theatres Found</h3>
          <p>No theatre registration requests at this time.</p>
        </div>
      )}
    </div>
  );
}

export default TheatresTable;
