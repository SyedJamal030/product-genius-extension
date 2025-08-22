import React from "react";
import { UseMountStatus } from "../hooks/MountStatus";
import LoadingSpinner from "./LoadingSpinner";
import "./component.css";

const PluginStatusDashboard = () => {
  const { pgEnabled, loading, checkWrapperExistence, lastChecked } = UseMountStatus();

  const statusIcon = pgEnabled ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="check-icon"
    >
      <path d="M9 16.17l-4.17-4.17L3.41 13 9 18.59 20.59 7 19.17 5.59z" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="alert-icon-svg"
    >
      <path d="M12 2L1 21h22L12 2zm0 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 2 0v4a1 1 0 0 1-1 1z" />
    </svg>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="plugin-monitor-container">
      <div className="plugin-monitor-header">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="icon"
        >
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
          <path d="M12 7a5 5 0 0 0-5 5h2a3 3 0 0 1 3-3V7z" />
          <path d="M12 17a5 5 0 0 0 5-5h-2a3 3 0 0 1-3 3v2z" />
        </svg>
        <span>Plugin Monitor</span>
      </div>
      <div className="document-title">
        <h1>System Status Dashboard</h1>
        <p>Monitor your plugin installation and activity status</p>
      </div>
      <div className={`status-card ${pgEnabled ? "active" : "inactive"}`}>
        <div className="status-icon">{statusIcon}</div>
        <h2 className="status-heading">
          Plugin Status: {pgEnabled ? "Active" : "Inactive"}
        </h2>
        <p className="status-message">
          Plugin is {pgEnabled ? "installed and running" : "not found"}
        </p>
      </div>
      <button className="refresh-button" onClick={checkWrapperExistence}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="refresh-icon"
        >
          <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.25 4.31L4.85 18a10.09 10.09 0 0 1-.85-4c0-5.52 4.48-10 10-10zM12 18v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.25-4.31l1.15-1.15c.89 1.5 1.4 3.23 1.4 5.46 0 5.52-4.48 10-10 10z" />
        </svg>
        Refresh Status
      </button>
      <div className="system-info-card">
        <div className="system-info-header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="alert-icon"
          >
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
          System Information
        </div>
        <div className="info-row">
          <div className="info-label">Component ID:</div>
          <div className="info-value">pg-app-wrapper</div>
        </div>
        <div className="info-row">
          <div className="info-label">Last Checked:</div>
          <div className="info-value">{lastChecked}</div>
        </div>
      </div>
    </div>
  );
};

export default PluginStatusDashboard;
