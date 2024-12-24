import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // state to track authentication status

  useEffect(() => {
    const verifyAuth = async () => {
      await axios.get('http://localhost:8000/api/checkAuth', {withCredentials: true,})
      .then(res=>setIsAuthenticated(res.data.accessToken))
      .catch(err=>console.log('Error authenticating'))
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
