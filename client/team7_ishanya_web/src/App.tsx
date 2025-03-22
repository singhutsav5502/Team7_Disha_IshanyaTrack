import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from './store'
import { verifyAuth } from './store/slices/authSlice'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import DashboardPage from './pages/DashboardPage'
import ManageStudentsPage from './pages/ManageStudentsPage'
import ManageEmployeesPage from './pages/ManageEmployeesPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import { USER_ROLES } from './types'

function App() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(verifyAuth())
  }, [dispatch])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      
      <Route path="/profile/:id" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      
      <Route path="/manage/students" element={
        <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
          <ManageStudentsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/manage/employees" element={
        <ProtectedRoute requiredRole={USER_ROLES.SUPERUSER}>
          <ManageEmployeesPage />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
