import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store";
import { verifyAuth } from "./store/slices/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import ManageStudentsPage from "./pages/Manage/ManageStudentsPage";
import ManageEmployeesPage from "./pages/Manage/ManageEmployeesPage";
import ManageProgramsPage from "./pages/Manage/ManageProgramsPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import CreateStudentPage from "./pages/Create/CreateStudent";
import CreateEmployeePage from "./pages/Create/CreateEmployee";
import CreateEducatorPage from "./pages/Create/CreateEducator";
import ManagePermission from "./pages/Manage/ManagePermission";
import MyStudents from "./pages/MyStudents";
import { USER_ROLES } from "./types";
import Navbar from "./components/Navbar";
import ContactQueriesPage from "./pages/Manage/ContactQueriesPage";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(verifyAuth());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole={USER_ROLES.STUDENT}>
            <>
              <Navbar />
              <DashboardPage />
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/queries"
        element={
          <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
            <>
              <Navbar />
              <ContactQueriesPage />
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my_students"
        element={
          <ProtectedRoute requiredRole={USER_ROLES.EDUCATOR}>
            <>
              <Navbar />
              <MyStudents />
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <ProtectedRoute requiredRole={USER_ROLES.STUDENT}>
            <>
              <Navbar />
              <ProfilePage />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage/students"
        element={
          <ProtectedRoute requiredRole={USER_ROLES.EDUCATOR}>
            <>
              <Navbar />
              <ManageStudentsPage />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage/employees"
        element={
          <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
            <>
              <Navbar />
              <ManageEmployeesPage />
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/programs"
        element={
          <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
            <>
              <Navbar />
              <ManageProgramsPage />
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/permissions"
        element={
          <ProtectedRoute requiredRole={USER_ROLES.SUPERUSER}>
            <>
              <Navbar />
              <ManagePermission />
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/create/student"
        element={
          <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
            <>
              <Navbar />
              <CreateStudentPage />
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/create/employee"
        element={
          <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
            <>
              <Navbar />
              <CreateEmployeePage />
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/create/educator"
        element={
          <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
            <>
              <Navbar />
              <CreateEducatorPage />
            </>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
