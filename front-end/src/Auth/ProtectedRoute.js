import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../costumComponents/Loading';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // state to track authentication status

  useEffect(() => {
    const verifyAuth = () => {
      axios.get('http://localhost:8000/api/checkAuth', {withCredentials: true,})
      .then(res=>setIsAuthenticated(res.data.user))
      .catch(err=>setIsAuthenticated(false))
    };
    verifyAuth();
  }, []);

  if(isAuthenticated === null){
    return <Loading/>
  }

  if (isAuthenticated) {
    return children;  // If authenticated, render the protected route content
  }
  
  return <Navigate to="/log-in" />;  // If not authenticated, redirect to login page
};

export default ProtectedRoute;
