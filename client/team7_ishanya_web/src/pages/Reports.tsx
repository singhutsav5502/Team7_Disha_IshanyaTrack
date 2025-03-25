import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getUserId, getUserType } from "../store/slices/authSlice";
import { fetchStudents, fetchReports } from "../api";
import { FiDownload, FiSearch, FiUpload } from "react-icons/fi";

// API function to fetch reports
const fetchReportsData = async (userId, userType) => {
  try {
    const response = await fetchReports(
      userId,
      userType
    );
    return response;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};

const ReportsPage = () => {
  const userId = useSelector(getUserId);
  const userType = useSelector(getUserType);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    studentId: "",
    quarter: "Q1",
    reportUrl: ""
  });
  const [students, setStudents] = useState([]);
  const [studentMap, setStudentMap] = useState({});

  // Fetch reports and students data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch students first to get names
        const studentsData = await fetchStudents();
        setStudents(studentsData);
        
        // Create a mapping of student IDs to names
        const studentNameMap = {};
        studentsData.forEach(student => {
          studentNameMap[student.S_ID] = `${student.Fname} ${student.Lname}`;
        });
        setStudentMap(studentNameMap);
        
        // Fetch reports
        const reportsData = await fetchReportsData(userId, userType);
        
        // Add student names to report data
        const reportsWithNames = reportsData.map(report => ({
          ...report,
          StudentName: studentNameMap[report.Student_ID] || 'Unknown Student'
        }));
        
        setReports(reportsWithNames);
        setFilteredReports(reportsWithNames);
      } catch (err) {
        setError('Failed to fetch reports: ' + err.message);
        toast.error('Failed to fetch reports');
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId && userType !== null) {
      fetchData();
    }
  }, [userId, userType]);
    // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredReports(reports);
    } else {
      const filtered = reports.filter(
        (report) =>
          report.Student_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.StudentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.Quarter.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReports(filtered);
    }
  }, [searchTerm, reports]);

  // Handle report upload
  const handleUploadReport = async (e) => {
    e.preventDefault();
    
    if (!uploadData.studentId || !uploadData.quarter || !uploadData.reportUrl) {
      toast.error("All fields are required");
      return;
    }
    
    try {
      const response = await fetch('https://team7.pythonanywhere.com/reports/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: uploadData.studentId,
          quarter: uploadData.quarter,
          reportUrl: uploadData.reportUrl
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Report uploaded successfully");
        setShowUploadModal(false);
        
        // Refresh reports list
        const reportsData = await fetchReportsData(userId, userType);
        const reportsWithNames = reportsData.map(report => ({
          ...report,
          StudentName: studentMap[report.Student_ID] || 'Unknown Student'
        }));
        
        setReports(reportsWithNames);
        setFilteredReports(reportsWithNames);
        
        // Reset form
        setUploadData({
          studentId: "",
          quarter: "Q1",
          reportUrl: ""
        });
      } else {
        toast.error(data.error || "Failed to upload report");
      }
    } catch (error) {
      console.error("Error uploading report:", error);
      toast.error("An error occurred while uploading the report");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Student Reports</h1>
        
        {userType >= 1 && (
          <button 
            className="btn btn-primary" 
            onClick={() => setShowUploadModal(true)}
          >
            <FiUpload className="mr-2" />
            Upload Report
          </button>
        )}
      </div>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="form-control w-full md:w-1/3 mb-4 md:mb-0">
              <div className="input-group flex gap-5">
                <input
                  type="text"
                  placeholder="Search by student name or quarter..."
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
                <div className="stat-title">Total Reports</div>
                <div className="stat-value">{reports.length}</div>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : error ? (
            <div className="alert alert-error shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          ) : filteredReports.length === 0 ? (
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
                    ? "No reports match your search criteria."
                    : "No reports available."}
                </span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Quarter</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={`${report.Student_ID}-${report.Quarter}`}>
                      <td>{report.StudentName}</td>
                      <td>{report.Student_ID}</td>
                      <td>{report.Quarter}</td>
                      <td>
                        <a 
                          href={report.Report_URL} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-primary"
                        >
                          <FiDownload className="mr-1" />
                          View Report
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Upload Report Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Upload Student Report</h3>
            <form onSubmit={handleUploadReport}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Student
                </label>
                <select
                  value={uploadData.studentId}
                  onChange={(e) => setUploadData({ ...uploadData, studentId: e.target.value })}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select a student</option>
                  {students.map((student) => (
                    <option key={student.S_ID} value={student.S_ID}>
                      {student.Fname} {student.Lname} ({student.S_ID})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Quarter
                </label>
                <select
                  value={uploadData.quarter}
                  onChange={(e) => setUploadData({ ...uploadData, quarter: e.target.value })}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="Q1">Quarter 1</option>
                  <option value="Q2">Quarter 2</option>
                  <option value="Q3">Quarter 3</option>
                  <option value="Q4">Quarter 4</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Report URL
                </label>
                <input
                  type="url"
                  value={uploadData.reportUrl}
                  onChange={(e) => setUploadData({ ...uploadData, reportUrl: e.target.value })}
                  className="input input-bordered w-full"
                  placeholder="https://example.com/report.pdf"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Please provide a direct link to the report file (PDF, DOC, etc.)
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn btn-ghost mr-2"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Upload Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
