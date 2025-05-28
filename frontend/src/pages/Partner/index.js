import React from "react";
import TheatreList from "./TheatreList";
import { Tabs } from "antd";

function Partner() {
  const items = [
    { 
      key: "1", 
      label: "🏢 My Theatres", 
      children: <TheatreList /> 
    }
  ];
  
  return (
    <div className="partner-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Partner Dashboard</h1>
          <p className="dashboard-subtitle">Manage your theatres and show schedules</p>
        </div>
      </div>
      <div className="dashboard-content">
        <Tabs 
          items={items} 
          className="partner-tabs"
          size="large"
          type="card"
        />
      </div>
    </div>
  );
}

export default Partner;
