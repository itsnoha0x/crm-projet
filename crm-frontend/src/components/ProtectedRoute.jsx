import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { hasRole } = useAuth() ?? {};

  if (!allowedRoles) return children;

  if (!hasRole?.(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
