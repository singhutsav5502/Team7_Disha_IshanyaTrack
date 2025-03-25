import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getUserId, getProgramData } from "../store/slices/authSlice";
import {
  fetchStudents,
  fetchStudentPerformance,
  updateStudentPerformance,
  addOrUpdateAttendance,
} from "../api";
import { FiSearch, FiCalendar, FiEdit } from "react-icons/fi";

const MyStudentsPage = () => {
  const navigate = useNavigate();
  const userId = useSelector(getUserId);
  const programData = useSelector(getProgramData);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentProgramMap, setStudentProgramMap] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Attendance Modal State
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    S_ID: "",
    Date: new Date().toISOString().split("T")[0],
    Present: true,
  });

  // Metrics Modal State
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState(1);
  const [performanceData, setPerformanceData] = useState(null);
  const [additionalMetrics, setAdditionalMetrics] = useState([]);
  const [newMetricName, setNewMetricName] = useState("");
  const [newMetricValue, setNewMetricValue] = useState(3);
  const [newMetricComment, setNewMetricComment] = useState("");

  // Create a mapping of students to their programs
  useEffect(() => {
    if (programData && Array.isArray(programData)) {
      const mapping = {};
      programData.forEach((program) => {
        if (program.Student_IDs && Array.isArray(program.Student_IDs)) {
          program.Student_IDs.forEach((studentId) => {
            if (!mapping[studentId]) {
              mapping[studentId] = [];
            }
            mapping[studentId].push({
              programId: program.Program_ID,
              programName: program.Program_Name,
            });
          });
        }
      });
      setStudentProgramMap(mapping);
    }
  }, [programData]);

  // Fetch students data
  useEffect(() => {
    const getStudents = async () => {
      setLoading(true);
      try {
        const studentsData = await fetchStudents();

        // Find programs where the educator is assigned
        const educatorPrograms = programData.filter(
          (program) =>
            program.Employee_IDs &&
            Array.isArray(program.Employee_IDs) &&
            program.Employee_IDs.includes(userId)
        );

        // Get all student IDs from these programs
        const assignedStudentIds = new Set();
        educatorPrograms.forEach((program) => {
          if (program.Student_IDs && Array.isArray(program.Student_IDs)) {
            program.Student_IDs.forEach((id) => assignedStudentIds.add(id));
          }
        });

        // Filter students to only those assigned to the educator's programs
        const myStudents = studentsData.filter(
          (student) =>
            assignedStudentIds.has(student.S_ID) ||
            student.Primary_E_ID === userId ||
            student.Secondary_E_ID === userId
        );

        setStudents(myStudents);
        setFilteredStudents(myStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Failed to load students data");
      } finally {
        setLoading(false);
      }
    };

    if (userId && programData) {
      getStudents();
    }
  }, [userId, programData]);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        (student) =>
          student.S_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${student.Fname} ${student.Lname}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  // Navigate to student details page
  const handleViewStudent = (studentId) => {
    navigate(`/profile/${studentId}`);
  };

  // Handle adding attendance
  const handleAddAttendance = (student, event) => {
    event.stopPropagation();
    setSelectedStudent(student);
    setAttendanceData((prev) => ({ ...prev, S_ID: student.S_ID }));
    setShowAttendanceModal(true);
  };
  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addOrUpdateAttendance(attendanceData);
      if (response.success) {
        toast.success(response.message);
        setShowAttendanceModal(false);
        // Optionally, refresh the attendance data here
      } else {
        toast.error(response.message || "Failed to record/update attendance");
      }
    } catch (error) {
      console.error("Error recording/updating attendance:", error);
      toast.error("An error occurred while recording/updating attendance");
    }
  };
  

  // Handle editing metrics
  const handleEditMetrics = async (student, event) => {
    event.stopPropagation();
    setSelectedStudent(student);
    await fetchPerformanceData(student.S_ID, 1); // Default to first quarter
    setShowMetricsModal(true);
  };
  const handleRemoveMetric = (index) => {
    const updatedMetrics = [...additionalMetrics];
    updatedMetrics.splice(index, 1);
    setAdditionalMetrics(updatedMetrics);
    toast.info("Metric removed");
  };
  // Fetch performance data for a specific quarter
  const fetchPerformanceData = async (studentId, quarter) => {
    try {
      const data = await fetchStudentPerformance(studentId, quarter);
      setPerformanceData(data);

      // Parse additional metrics from JSON if they exist
      if (data && data.Additional_Metrics) {
        try {
          const metricsObj = JSON.parse(data.Additional_Metrics);
          const metricsArray = Object.keys(metricsObj).map((key) => ({
            name: key,
            value: metricsObj[key].Value,
            comment: metricsObj[key].Comment || "",
          }));
          setAdditionalMetrics(metricsArray);
        } catch (e) {
          setAdditionalMetrics([]);
          console.error("Error parsing additional metrics:", e);
        }
      } else {
        setAdditionalMetrics([]);
      }
    } catch (error) {
      console.error("Error fetching performance data:", error);
      toast.error("Failed to load performance data");
      setPerformanceData(null);
      setAdditionalMetrics([]);
    }
  };

  // Handle quarter change
  const handleQuarterChange = async (quarter) => {
    setSelectedQuarter(quarter);
    if (selectedStudent) {
      await fetchPerformanceData(selectedStudent.S_ID, quarter);
    }
  };

  // Add a new metric
  const handleAddMetric = () => {
    if (!newMetricName.trim()) {
      toast.error("Metric name is required");
      return;
    }

    // Check if metric with same name already exists
    const existingIndex = additionalMetrics.findIndex(
      (m) => m.name === newMetricName
    );

    if (existingIndex >= 0) {
      // Update existing metric
      const updatedMetrics = [...additionalMetrics];
      updatedMetrics[existingIndex] = {
        name: newMetricName,
        value: newMetricValue,
        comment: newMetricComment,
      };
      setAdditionalMetrics(updatedMetrics);
      toast.info("Existing metric updated");
    } else {
      // Add new metric
      setAdditionalMetrics([
        ...additionalMetrics,
        {
          name: newMetricName,
          value: newMetricValue,
          comment: newMetricComment,
        },
      ]);
    }

    // Reset form
    setNewMetricName("");
    setNewMetricValue(3);
    setNewMetricComment("");
  };

  // Handle saving all metrics
  const handleSaveMetrics = async () => {
    if (!performanceData || !selectedStudent) return;

    try {
      // Convert additional metrics array to object format
      const metricsObject = {};
      additionalMetrics.forEach((metric) => {
        metricsObject[metric.name] = {
          Value: metric.value,
          Comment: metric.comment,
        };
      });

      // Prepare updated performance data
      const updatedData = {
        ...performanceData,
        Cognitive_score: parseFloat(performanceData.Cognitive_score) || 3,
        Communication_score:
          parseFloat(performanceData.Communication_score) || 3,
        Reasoning_score: parseFloat(performanceData.Reasoning_score) || 3,
        Additional_Metrics: JSON.stringify(metricsObject),
      };

      // Send update to server
      await updateStudentPerformance(
        selectedStudent.S_ID,
        selectedQuarter,
        updatedData
      );
      toast.success("Performance metrics updated successfully");
      setShowMetricsModal(false);
    } catch (error) {
      console.error("Error updating performance metrics:", error);
      toast.error("Failed to update performance metrics");
    }
  };

  // Get program name for a student
  const getStudentProgram = (studentId) => {
    const programs = studentProgramMap[studentId];
    if (programs && programs.length > 0) {
      return programs[0].programName;
    }
    return "Not Assigned";
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Students</h1>

      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="form-control w-full md:w-1/3 mb-4 md:mb-0">
              <div className="input-group flex gap-5">
                <input
                  type="text"
                  placeholder="Search by ID or name..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-square">
                  <FiSearch className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Total Students</div>
                <div className="stat-value">{students.length}</div>
                <div className="stat-desc">Assigned to you</div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="alert alert-info shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current flex-shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>
                  {searchTerm
                    ? "No students match your search criteria."
                    : "No students are currently assigned to you."}
                </span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Program</th>
                    <th>Session Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.S_ID}
                      className="hover cursor-pointer"
                      onClick={() => handleViewStudent(student.S_ID)}
                    >
                      <td>{student.S_ID}</td>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-content rounded-full">
                            <img
                              src={`https://avatar.iran.liara.run/public/${student.Gender === "Male" ? "boy" : student.Gender === "Female" ? "girl" : "girl"}?username=[${student.Fname?.[0]}${student.Lname?.[0]}]`}
                              alt="avatar-image"
                            />
                          </div>
                          <div>
                            <div className="font-bold">
                              {student.Fname} {student.Lname}
                            </div>
                            <div className="text-sm opacity-50">
                              {student.Primary_Diagnosis}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{getStudentProgram(student.S_ID)}</td>
                      <td>{student.Session_Type}</td>
                      <td>
                        <div
                          className={`badge ${
                            student.Status === "Active"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {student.Status}
                        </div>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={(e) => handleAddAttendance(student, e)}
                          >
                            <FiCalendar className="mr-1" />
                            Add Attendance
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={(e) => handleEditMetrics(student, e)}
                          >
                            <FiEdit className="mr-1" />
                            Edit Metrics
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Record Attendance</h3>
            <form onSubmit={handleAttendanceSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="student-id"
                >
                  Student ID
                </label>
                <input
                  id="student-id"
                  type="text"
                  value={attendanceData.S_ID}
                  className="input input-bordered w-full"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="date"
                >
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={attendanceData.Date}
                  onChange={(e) =>
                    setAttendanceData((prev) => ({
                      ...prev,
                      Date: e.target.value,
                    }))
                  }
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="flex items-center cursor-pointer">
                  <span className="label-text mr-2">Present</span>
                  <input
                    type="checkbox"
                    checked={attendanceData.Present}
                    onChange={(e) =>
                      setAttendanceData((prev) => ({
                        ...prev,
                        Present: e.target.checked,
                      }))
                    }
                    className="checkbox checkbox-primary"
                  />
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn btn-ghost mr-2"
                  onClick={() => setShowAttendanceModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMetricsModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 overflow-y-scroll">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-3xl w-full">
            <h3 className="text-2xl font-bold mb-4">
              Performance Metrics - {selectedStudent?.Fname}{" "}
              {selectedStudent?.Lname}
            </h3>

            {/* Quarter Selection */}
            <div className="tabs tabs-boxed mb-4">
              {[1, 2, 3, 4].map((quarter) => (
                <a
                  key={quarter}
                  className={`tab ${selectedQuarter === quarter ? "tab-active" : ""}`}
                  onClick={() => handleQuarterChange(quarter)}
                >
                  Quarter {quarter}
                </a>
              ))}
            </div>

            {performanceData ? (
              <div className="space-y-6">
                {/* Core Metrics */}
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body">
                    <h4 className="text-lg font-semibold">Core Metrics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">
                            Cognitive Score (%)
                          </span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={performanceData.Cognitive_score || 3}
                          onChange={(e) =>
                            setPerformanceData({
                              ...performanceData,
                              Cognitive_score: Math.min(
                                100,
                                Math.max(1, parseInt(e.target.value) || 1)
                              ),
                            })
                          }
                          className="input input-bordered"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">
                            Communication Score (%)
                          </span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={performanceData.Communication_score || 3}
                          onChange={(e) =>
                            setPerformanceData({
                              ...performanceData,
                              Communication_score: Math.min(
                                100,
                                Math.max(1, parseInt(e.target.value) || 1)
                              ),
                            })
                          }
                          className="input input-bordered"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">
                            Reasoning Score (%)
                          </span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={performanceData.Reasoning_score || 3}
                          onChange={(e) =>
                            setPerformanceData({
                              ...performanceData,
                              Reasoning_score: Math.min(
                                100,
                                Math.max(1, parseInt(e.target.value) || 1)
                              ),
                            })
                          }
                          className="input input-bordered"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body">
                    <h4 className="text-lg font-semibold">
                      Additional Metrics
                    </h4>

                    {/* Existing Additional Metrics */}
                    {additionalMetrics.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="table w-full">
                          <thead>
                            <tr>
                              <th>Metric Name</th>
                              <th>Value (1-5)</th>
                              <th>Comment</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {additionalMetrics.map((metric, index) => (
                              <tr key={index}>
                                <td>{metric.name}</td>
                                <td>
                                  <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={metric.value}
                                    onChange={(e) => {
                                      const newValue = Math.min(
                                        5,
                                        Math.max(
                                          1,
                                          parseInt(e.target.value) || 1
                                        )
                                      );
                                      const updatedMetrics = [
                                        ...additionalMetrics,
                                      ];
                                      updatedMetrics[index].value = newValue;
                                      setAdditionalMetrics(updatedMetrics);
                                    }}
                                    className="input input-bordered w-20"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={metric.comment}
                                    onChange={(e) => {
                                      const updatedMetrics = [
                                        ...additionalMetrics,
                                      ];
                                      updatedMetrics[index].comment =
                                        e.target.value;
                                      setAdditionalMetrics(updatedMetrics);
                                    }}
                                    className="input input-bordered w-full"
                                  />
                                </td>
                                <td>
                                  <button
                                    className="btn btn-error btn-sm"
                                    onClick={() => handleRemoveMetric(index)}
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="alert alert-info">
                        <span>No additional metrics added yet.</span>
                      </div>
                    )}

                    {/* Add New Metric Form */}
                    <div className="divider">Add New Metric</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Metric Name</span>
                        </label>
                        <input
                          type="text"
                          value={newMetricName}
                          onChange={(e) => setNewMetricName(e.target.value)}
                          className="input input-bordered"
                          placeholder="e.g., Social Skills"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Value (1-5)</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={newMetricValue}
                          onChange={(e) =>
                            setNewMetricValue(
                              Math.min(
                                5,
                                Math.max(1, parseInt(e.target.value) || 1)
                              )
                            )
                          }
                          className="input input-bordered"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Comment</span>
                        </label>
                        <input
                          type="text"
                          value={newMetricComment}
                          onChange={(e) => setNewMetricComment(e.target.value)}
                          className="input input-bordered"
                          placeholder="Optional comment"
                        />
                      </div>
                    </div>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={handleAddMetric}
                    >
                      Add Metric
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="btn btn-ghost mr-2"
                onClick={() => setShowMetricsModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveMetrics}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyStudentsPage;
