import React from 'react';
import Cookies from 'js-cookie';
import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const location = useLocation();
  if (Cookies.get('token_log')) {
    return children;
  }
  return <Navigate to="/login" state={{ from: location }} />;
}
