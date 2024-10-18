import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, allowedRoles }) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  if (!loggedInUser) {
    // If not logged in, redirect to login
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(loggedInUser.role)) {
    // If the user doesn't have the appropriate role, show unauthorized message or redirect
    return <Navigate to="/unauthorized" />;
  }

  // Render the component if authorized
  return <Component />;
};

export default PrivateRoute;
