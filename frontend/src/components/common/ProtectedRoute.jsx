import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

/**
 * Protects routes that require authentication
 */
export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />
}

/**
 * Protects routes that require superadmin role
 */
export const SuperAdminRoute = () => {
  const { isAuthenticated, isSuperAdmin } = useAuth()
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  if (!isSuperAdmin) return <Navigate to="/admin/dashboard" replace />
  return <Outlet />
}
