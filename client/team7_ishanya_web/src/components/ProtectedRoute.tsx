import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { RootState } from '../store'

interface ProtectedRouteProps {
  children: React.JSX.Element;
  requiredRole?: number;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, userType } = useSelector((state: RootState) => state.auth)
  const location = useLocation()

  // Check if user is authenticated and has required role
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If a specific role is required, check if user has sufficient permissions
  if (requiredRole !== undefined && userType !== null && userType < requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute
