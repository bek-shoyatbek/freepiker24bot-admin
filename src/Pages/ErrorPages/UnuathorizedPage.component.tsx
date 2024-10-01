import React from "react";
import "./ErrorPages.css";

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <h1>403</h1>
        <h2>Unauthorized</h2>
        <p>Sorry, you don't have permission to access this page.</p>
        <a href="/" className="home-link">
          Go to Homepage
        </a>
      </div>
    </div>
  );
};
