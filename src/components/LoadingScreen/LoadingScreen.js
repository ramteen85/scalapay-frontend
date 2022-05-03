import React from 'react';
import MDSpinner from 'react-md-spinner';
import '../../pages/Login/Login.css';

function LoadingScreen(props) {
  return (
    <div className="login-box">
      <div className="loading-container">
        <h2 className="login-heading">{props.message}</h2>
        <MDSpinner />
      </div>
    </div>
  );
}

export default LoadingScreen;
