import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ allowedRoles }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAuthorization = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const verifyToken = await axios.get('https://vdzgxgqr-4080.asse.devtunnels.ms/auth/validasidata/user', {
            headers: {
              Authorization: `Bearer ${token}`, // Fix: Use backticks for template literals
            },
          });

          const roles = verifyToken.data.user.role;
          console.log(roles); // Fix: Ensure 'roles' is an array

          setIsAuthorized(allowedRoles.some(role => roles.includes(role))); // Fix: Check if any allowed role matches the user's roles
        } catch (error) {
          console.error('Error verifying token:', error);
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, [allowedRoles]);

  if (isAuthorized === null) {
    // Still checking authorization, you might want to render a loading spinner here
    return null;
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/error" />;
};

export default ProtectedRoute;
