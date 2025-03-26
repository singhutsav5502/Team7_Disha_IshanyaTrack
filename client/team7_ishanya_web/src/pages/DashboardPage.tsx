import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiUserCheck,
  FiFileText,
  FiCalendar,
  FiPhone,
  FiX,
  FiBook,
  FiUsers,
} from "react-icons/fi";
import { getUserType, getUserId } from "../store/slices/authSlice";
import { USER_ROLES } from "../types";
import { toast } from "react-toastify";
import {
  fetchDashboardData,
  fetchStudentAttendance,
  fetchProfileData,
  fetchEducatorDetails,
  fetchAttendanceHistory,
  fetchStudentPrograms,
} from "../api";

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
  const [studentData, setStudentData] = useState(null);
  const [attendanceData, setAttendanceData] = useState({
    total_days: 0,
    present_days: 0,
  });
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [primaryEducator, setPrimaryEducator] = useState(null);
  const [secondaryEducator, setSecondaryEducator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [studentPrograms, setStudentPrograms] = useState([]);
  const [showProgramsModal, setShowProgramsModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (accessType === USER_ROLES.STUDENT) {
          const studentProfile = await fetchProfileData(
            userId,
            USER_ROLES.STUDENT
          );
          setStudentData(studentProfile);

          const attendance = await fetchStudentAttendance(userId);
          setAttendanceData(attendance);

          if (studentProfile.Primary_E_ID) {
            const primaryEducatorData = await fetchEducatorDetails(
              studentProfile.Primary_E_ID
            );
            setPrimaryEducator(primaryEducatorData);
          }

          if (studentProfile.Secondary_E_ID) {
            const secondaryEducatorData = await fetchEducatorDetails(
              studentProfile.Secondary_E_ID
            );
            setSecondaryEducator(secondaryEducatorData);
          }

          const programs = await fetchStudentPrograms(userId);
          setStudentPrograms(programs);
        } else {
          const data = await fetchDashboardData();
          setStats(data);
        }
      } catch (err) {
        toast.error(`Failed to fetch data: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [accessType, userId]);

  const openAttendanceModal = async () => {
    if (attendanceHistory.length === 0) {
      setAttendanceLoading(true);
      try {
        const history = await fetchAttendanceHistory(userId);
        setAttendanceHistory(history.attendance_records || []);
      } catch (err) {
        toast.error(`Failed to fetch attendance history: ${err}`);
      } finally {
        setAttendanceLoading(false);
      }
    }
    setShowAttendanceModal(true);
  };

  const closeAttendanceModal = () => {
    setShowAttendanceModal(false);
  };

  const openProgramsModal = () => {
    setShowProgramsModal(true);
  };

  const closeProgramsModal = () => {
    setShowProgramsModal(false);
  };

  const renderAttendanceModal = () => {
    if (!showAttendanceModal) return null;

    return (
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Attendance History</h2>
            <button
              onClick={closeAttendanceModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>
          {attendanceLoading ? (
            <div className="flex justify-center items-center flex-grow py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : attendanceHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No attendance records found
            </p>
          ) : (
            <div className="overflow-y-scroll flex h-[50vh]">
              <table className="table w-full">
                <thead className="sticky top-0 bg-white">
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistory.map((record, index) => (
                    <tr
                      key={index}
                      className={`${record.Present ? "bg-green-100" : "bg-red-100"}`}
                    >
                      <td>{record.Date}</td>
                      <td>
                        <span
                          className={`badge ${record.Present ? "badge-success" : "badge-error"}`}
                        >
                          {record.Present ? "Present" : "Absent"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProgramsModal = () => {
    if (!showProgramsModal) return null;

    return (
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">My Programs</h2>
            <button
              onClick={closeProgramsModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>
          <div className="overflow-y-auto flex-grow">
            {studentPrograms.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                You are not enrolled in any programs.
              </p>
            ) : (
              <ul className="space-y-2">
                {studentPrograms.map((program) => (
                  <li key={program.Program_ID} className="bg-gray-100 p-3 rounded">
                    {program.Program_Name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderStudentDashboard = () => {
    if (accessType === USER_ROLES.STUDENT) {
      const attendancePercentage =
        attendanceData.total_days > 0
          ? Math.round(
              (attendanceData.present_days / attendanceData.total_days) * 100
            )
          : 0;
  
      return (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {studentData?.Fname} {studentData?.Lname}
            </h1>
            <p className="text-gray-600">
              Here's your attendance summary and educator contacts
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           
            <div className="space-y-6">
              <div
                className="card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
                onClick={openAttendanceModal}
              >
                <div className="card-body">
                  <h2 className="card-title flex items-center">
                    <FiCalendar className="mr-2" /> Attendance Summary
                  </h2>
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span>Present Days:</span>
                      <span className="font-bold">
                        {attendanceData.present_days} /{" "}
                        {attendanceData.total_days}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Attendance Rate:</span>
                      <span className="font-bold">{attendancePercentage}%</span>
                    </div>
                    <progress
                      className={`progress w-full ${
                        attendancePercentage >= 90
                          ? "progress-success"
                          : attendancePercentage >= 75
                            ? "progress-warning"
                            : "progress-error"
                      }`}
                      value={attendancePercentage}
                      max="100"
                    ></progress>
                  </div>
                </div>
              </div>
  
              <div
                className="card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
                onClick={openProgramsModal}
              >
                <div className="card-body">
                  <h2 className="card-title flex items-center">
                    <FiBook className="mr-2" /> My Programs
                  </h2>
                  <p className="mt-2">Click to view your enrolled programs</p>
                </div>
              </div>
            </div>
  
           
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title flex items-center">
                  <FiPhone className="mr-2" /> My Educators
                </h2>
                <div className="mt-4">
                  {primaryEducator ? (
                    <div className="mb-4">
                      <h3 className="font-bold">Primary Educator</h3>
                      <p>{primaryEducator.Name}</p>
                      <p className="text-sm">{primaryEducator.Designation}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-sm mr-2">Contact:</span>
                        <a
                          href={`mailto:${primaryEducator.Email}`}
                          className="text-blue-500 hover:underline text-sm mr-3"
                        >
                          {primaryEducator.Email}
                        </a>
                        <a
                          href={`tel:${primaryEducator.Phone}`}
                          className="text-blue-500 hover:underline text-sm"
                        >
                          {primaryEducator.Phone}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p>No primary educator assigned</p>
                  )}
                  {secondaryEducator && (
                    <div>
                      <h3 className="font-bold">Secondary Educator</h3>
                      <p>{secondaryEducator.Name}</p>
                      <p className="text-sm">{secondaryEducator.Designation}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-sm mr-2">Contact:</span>
                        <a
                          href={`mailto:${secondaryEducator.Email}`}
                          className="text-blue-500 hover:underline text-sm mr-3"
                        >
                          {secondaryEducator.Email}
                        </a>
                        <a
                          href={`tel:${secondaryEducator.Phone}`}
                          className="text-blue-500 hover:underline text-sm"
                        >
                          {secondaryEducator.Phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
  
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                className="btn btn-info h-24"
                onClick={() => navigate(`/profile/${userId}`)}
              >
                <FiUserCheck className="w-6 h-6 mr-2" /> My Profile
              </button>
              <button
                className="btn btn-warning h-24"
                onClick={() => navigate("/reports")}
              >
                <FiFileText className="w-6 h-6 mr-2" /> View My Reports
              </button>
            </div>
          </div>
  
          {renderAttendanceModal()}
          {renderProgramsModal()}
        </>
      );
    }
    return null;
  };
  
  const renderAdminOptions = () => {
    if (
      accessType === USER_ROLES.ADMIN ||
      accessType === USER_ROLES.SUPERUSER
    ) {
      return (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Administrative Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
            <button
              className="btn btn-primary text-white h-24"
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
              onClick={() => navigate("/my_students")}
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

  const renderNonStudentDashboard = () => {
    if (accessType !== USER_ROLES.STUDENT) {
      return (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome to the Disha portal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card bg-base-100 shadow-xl relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400"></div>
              <div className="card-body p-5">
                <p className="text-md font-medium text-gray-500">
                  Total Students
                </p>
                <p className="text-3xl font-bold mt-1">{stats.totalStudents}</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-400"></div>
              <div className="card-body p-5">
                <p className="text-md font-medium text-gray-500">
                  Total Employees
                </p>
                <p className="text-3xl font-bold mt-1">
                  {stats.totalEmployees}
                </p>
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
        </>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      {accessType === USER_ROLES.STUDENT
        ? renderStudentDashboard()
        : renderNonStudentDashboard()}
      {renderAdminOptions()}
      {renderEducatorOptions()}
    </div>
  );
};

export default DashboardPage;
