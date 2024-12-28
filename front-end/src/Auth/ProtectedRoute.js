import React, { createContext, useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../costumComponents/Loading';

const userContext = createContext();

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // State to track authentication status
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await axios.post('http://localhost:8000/api/checkAuth', {}, { withCredentials: true });
        setIsAuthenticated(res.data.user);
        setUser(res.data.userInfo);
      } catch (err) {
        console.error('Authentication failed:', err);
        setIsAuthenticated(false);
      }
    };

    const refreshAuthToken = async () => {
      try {
        await axios.post('http://localhost:8000/api/refresh-token', {}, { withCredentials: true });
        console.log('Session refreshed');
      } catch (err) {
        console.error('Session expired:', err);
        setIsAuthenticated(false);
      }
    };

    // Verify auth and refresh token immediately
    verifyAuth();
    refreshAuthToken();

    // Set up periodic token refresh
    const interval = setInterval(refreshAuthToken, 55 * 60 * 1000); 

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="vh-100 w-100 d-flex justify-content-center align-items-center">
        <Loading />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <userContext.Provider value={{ user, setUser }}>
        {children}
      </userContext.Provider>
    );
  }

  return <Navigate to="/log-in" />; // If not authenticated, redirect to login page
};

export default ProtectedRoute;
export const useUser = () => useContext(userContext);
