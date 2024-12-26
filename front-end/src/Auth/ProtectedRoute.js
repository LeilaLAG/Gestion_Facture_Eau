import React, { createContext, useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../costumComponents/Loading';

const userContext = createContext()

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // state to track authentication status
  const [user , setUser] = useState(null)

  useEffect(() => {
    const verifyAuth = () => {
      axios.get('http://localhost:8000/api/checkAuth', {withCredentials: true,})
      .then(res=>{setIsAuthenticated(res.data.user) ; setUser(res.data.userInfo)})
      .catch(err=>setIsAuthenticated(false))
    };
    verifyAuth();
    
    const interval = setInterval(() => {
      axios.get('http://localhost:8000/api/checkAuth', { withCredentials: true })
        .then(res => console.log('Session refreshed'))
        .catch(err => console.error('Session expired:', err));
    }, 55 * 60 * 1000); // Refresh every 55 minutes
  
    return () => clearInterval(interval);
  }, []);

  if(isAuthenticated === null){
    return <Loading/>
  }

  if (isAuthenticated) {
    return(
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
    )
  }
  
  return <Navigate to="/log-in" />;  // If not authenticated, redirect to login page
};

export default ProtectedRoute;
export const useUser = () => useContext(userContext);

