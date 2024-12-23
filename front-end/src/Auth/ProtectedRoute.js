import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkAuth } from './check-auth';  // Import the checkAuth function

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // state to track authentication status

  useEffect(() => {
    const verifyAuth = async () => {
      const authenticated = await checkAuth();  // Check if the user is authenticated
      setIsAuthenticated(authenticated);
    };
    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;  // You can show a loading spinner while checking authentication
  }

  if (isAuthenticated) {
    return children;  // If authenticated, render the protected route content
  }

  return <Navigate to="/log-in" />;  // If not authenticated, redirect to login page
};

export default ProtectedRoute;
