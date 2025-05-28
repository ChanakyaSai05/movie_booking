import React from "react";
import Bookings from "./Bookings";
import { useSelector } from "react-redux";
import { UserOutlined, BookOutlined } from "@ant-design/icons";

function Profile() {
  const { user } = useSelector(state => state.users);
  
  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <div className="header-content">
          <div className="user-info">
            <div className="user-avatar">
              <UserOutlined />
            </div>
            <div className="user-details">
              <h1 className="user-name">Welcome, {user?.name}</h1>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="profile-content">
        <div className="section-header">
          <BookOutlined className="section-icon" />
          <div>
            <h2 className="section-title">My Bookings</h2>
            <p className="section-subtitle">View and manage your movie reservations</p>
          </div>
        </div>
        <Bookings />
      </div>
    </div>
  );
}

export default Profile;
