import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiUsers, FiUserCheck, FiBook, FiFileText } from "react-icons/fi";
import { getUserType, getUserId } from "../store/slices/authSlice";
import { USER_ROLES } from "../types";
import { toast } from "react-toastify";
import { fetchDashboardData } from "../api";

const DashboardPage = () => {
  const navigate = useNavigate();
  const accessType = useSelector(getUserType);
  const userId = useSelector(getUserId);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEmployees: 0,
    totalPrograms: 0,
    totalReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const data = await fetchDashboardData();
        setStats({
          totalStudents: data.totalStudents,
          totalEmployees: data.totalEmployees,
          totalPrograms: data.totalPrograms,
          totalReports: data.totalReports,
        });
      } catch (err) {
        toast.error(`Failed to fetch dashboard data with error: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const renderAdminOptions = () => {
    if (accessType === USER_ROLES.ADMIN || accessType === USER_ROLES.SUPERUSER) {
      return (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Administrative Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              className="btn btn-primary h-24"
              onClick={() => navigate("/manage/students")}
            >
              <FiUsers className="w-6 h-6 mr-2" /> Manage Students
            </button>
            <button
              className="btn btn-success h-24"
              onClick={() => navigate("/manage/employees")}
            >
              <FiUserCheck className="w-6 h-6 mr-2" /> Manage Employees
            </button>
            <button
              className="btn btn-secondary h-24"
              onClick={() => navigate("/manage/programs")}
            >
              <FiBook className="w-6 h-6 mr-2" /> Manage Programs
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderEducatorOptions = () => {
    if (
      accessType &&
      (accessType === USER_ROLES.EDUCATOR || accessType >= USER_ROLES.ADMIN)
    ) {
      return (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Educator Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              className="btn btn-accent h-24"
              onClick={() => navigate("/my-students")}
            >
              <FiUsers className="w-6 h-6 mr-2" /> My Students
            </button>
            <button
              className="btn btn-warning h-24"
              onClick={() => navigate("/reports")}
            >
              <FiFileText className="w-6 h-6 mr-2" /> Manage Reports
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderStudentOptions = () => {
    if (accessType === USER_ROLES.STUDENT) {
      return (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Student Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              className="btn btn-info h-24"
              onClick={() => navigate(`/profile/${userId}`)}
            >
              <FiUserCheck className="w-6 h-6 mr-2" /> My Profile
            </button>
            <button
              className="btn btn-warning h-24"
              onClick={() => navigate("/my-reports")}
            >
              <FiFileText className="w-6 h-6 mr-2" /> View My Reports
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Ishanya India portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400"></div>
          <div className="card-body p-5">
            <p className="text-md font-medium text-gray-500">Total Students</p>
            <p className="text-3xl font-bold mt-1">{stats.totalStudents}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-400"></div>
          <div className="card-body p-5">
            <p className="text-md font-medium text-gray-500">Total Employees</p>
            <p className="text-3xl font-bold mt-1">{stats.totalEmployees}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-400"></div>
          <div className="card-body p-5">
            <p className="text-md font-medium text-gray-500">Programs</p>
            <p className="text-3xl font-bold mt-1">{stats.totalPrograms}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400"></div>
          <div className="card-body p-5">
            <p className="text-md font-medium text-gray-500">
              Reports Generated
            </p>
            <p className="text-3xl font-bold mt-1">{stats.totalReports}</p>
          </div>
        </div>
      </div>

      {renderAdminOptions()}
      {renderEducatorOptions()}
      {renderStudentOptions()}
    </div>
  );
};

export default DashboardPage;
