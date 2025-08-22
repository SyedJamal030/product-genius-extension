import React from "react";

const UnderDevelopment = () => {
  return (
    <div className="underdevelopment-card status-card inactive">
      <div className="status-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="alert-icon-svg"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <h3 className="status-heading">Under Development</h3>
      <p className="status-message">
        This module is currently under development. Please check back later for
        updates.
      </p>
      <span className="operational-tag">In Progress</span>
    </div>
  );
};

export default UnderDevelopment;
