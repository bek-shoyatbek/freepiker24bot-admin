import React from "react";
import "./ErrorPages.css";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Oops! The page you are looking for doesn't exist.</p>
        <a href="/home" className="home-link">
          Go to Homepage
        </a>
      </div>
    </div>
  );
};
