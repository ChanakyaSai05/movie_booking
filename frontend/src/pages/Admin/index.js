import React from "react";
import { Tabs } from "antd";
import MovieList from "./MovieListComponent";
import TheatresTable from "./TheatresTable";

function Admin() {
  const tabItems = [
    { 
      key: "1", 
      label: "🎬 Movies", 
      children: <MovieList /> 
    },
    {
      key: "2",
      label: "🎭 Theatres",
      children: <TheatresTable />,
    },
  ];
  
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Manage movies and theatre approvals</p>
        </div>
      </div>
      <div className="dashboard-content">
        <Tabs 
          items={tabItems} 
          className="admin-tabs"
          size="large"
          type="card"
        />
      </div>
    </div>
  );
}

export default Admin;
