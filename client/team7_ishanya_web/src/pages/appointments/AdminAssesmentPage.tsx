import React, { useState, useEffect } from "react";
import { fetchAllAssessments, makeEnrollmentDecision } from "../../api";
import { toast } from "react-toastify";
import { FiSearch, FiCheck, FiX, FiUser, FiEye } from "react-icons/fi";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { getUserType } from "../../store/slices/authSlice";
import { USER_ROLES } from "../../types";

interface Assessment {
  Assessment_ID: number;
  Appointment_ID: number;
  Educator_ID: string;
  Assessment_Date: string;
  Comments: string;
  Decision_Made: boolean;
  Enrollment_Decision: boolean | null;
  Is_Visible: boolean;
  Parent_Name: string;
  Parent_Email: string;
  Student_Name: string;
  Educator_Name: string;
}

const AdminAssessmentsPage: React.FC = () => {
  const userType = useSelector(getUserType);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [decisionFilter, setDecisionFilter] = useState<string>("pending");
  const [showDecisionModal, setShowDecisionModal] = useState<boolean>(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  const isAdminOrHigher = userType === USER_ROLES.ADMIN || userType === USER_ROLES.SUPERUSER;

  useEffect(() => {
    const getAssessments = async () => {
      if (!isAdminOrHigher) return;
      
      setLoading(true);
      try {
        const data = await fetchAllAssessments(decisionFilter);
        setAssessments(data);
        setFilteredAssessments(data);
      } catch (error) {
        console.error("Error fetching assessments:", error);
        toast.error("Failed to load assessments");
      } finally {
        setLoading(false);
      }
    };

    getAssessments();
  }, [isAdminOrHigher, decisionFilter]);

  useEffect(() => {
    const filtered = assessments.filter(
      (assessment) =>
        assessment.Parent_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.Student_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.Educator_Name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAssessments(filtered);
  }, [searchTerm, assessments]);

  const openDecisionModal = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setShowDecisionModal(true);
  };

  const closeDecisionModal = () => {
    setSelectedAssessment(null);
    setShowDecisionModal(false);
  };

  const handleEnrollmentDecision = async (enroll: boolean) => {
    if (!selectedAssessment) return;

    try {
      const response = await makeEnrollmentDecision(selectedAssessment.Assessment_ID, enroll);
      
      if (response.success) {
        toast.success(`Student ${enroll ? 'enrolled' : 'not enrolled'} successfully`);
        
        const updatedAssessments = assessments.map(assessment => 
          assessment.Assessment_ID === selectedAssessment.Assessment_ID
            ? { ...assessment, Decision_Made: true, Enrollment_Decision: enroll }
            : assessment
        );
        
        setAssessments(updatedAssessments);
        closeDecisionModal();
      } else {
        toast.error(response.message || "Failed to make enrollment decision");
      }
    } catch (error) {
      console.error("Error making enrollment decision:", error);
      toast.error("An error occurred while making the enrollment decision");
    }
  };

  // Parse JSON comments safely
  const parseComments = (commentsStr: string) => {
    try {
      if (typeof commentsStr === 'string') {
        const parsed = JSON.parse(commentsStr);
        return parsed.comment || "No comments available";
      }
      return "No comments available";
    } catch (e) {
      console.error("Error parsing comments:", e);
      return "Error displaying comments";
    }
  };

  if (!isAdminOrHigher) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Access Denied</h1>
        <div className="alert alert-error">
          <div>
            <span>You don't have permission to view this page.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Manage Assessments</h1>

      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="form-control w-full md:w-1/3 mb-4 md:mb-0">
              <div className="input-group flex gap-5">
                <input
                  type="text"
                  placeholder="Search assessments..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-square">
                  <FiSearch className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex gap-2 mb-4 md:mb-0">
              <select 
                className="select select-bordered" 
                value={decisionFilter}
                onChange={(e) => setDecisionFilter(e.target.value)}
              >
                <option value="pending">Pending Decisions</option>
                <option value="decided">Decided</option>
                <option value="all">All Assessments</option>
              </select>
            </div>
            
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Total Assessments</div>
                <div className="stat-value">{assessments.length}</div>
                <div className="stat-desc">
                  {assessments.filter(a => !a.Decision_Made).length} pending
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : filteredAssessments.length === 0 ? (
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
                    ? "No assessments match your search criteria."
                    : "No assessments found."}
                </span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student Name</th>
                    <th>Educator</th>
                    <th>Assessment Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssessments.map((assessment) => (
                    <tr key={assessment.Assessment_ID} className="hover">
                      <td>{assessment.Assessment_ID}</td>
                      <td>{assessment.Student_Name}</td>
                      <td>{assessment.Educator_Name}</td>
                      <td>{format(new Date(assessment.Assessment_Date), "MMM d, yyyy")}</td>
                      <td>
                        <span className={`badge ${
                          assessment.Decision_Made
                            ? assessment.Enrollment_Decision
                              ? 'badge-success'
                              : 'badge-error'
                            : 'badge-warning'
                        }`}>
                          {assessment.Decision_Made
                            ? assessment.Enrollment_Decision
                              ? 'Enrolled'
                              : 'Not Enrolled'
                            : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => openDecisionModal(assessment)}
                        >
                          {!assessment.Decision_Made ? (
                            <>
                              <FiUser className="mr-1" />
                              Make Decision
                            </>
                          ) : (
                            <>
                              <FiEye className="mr-1" />
                              View Details
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Decision Modal */}
      {showDecisionModal && selectedAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Enrollment Decision</h2>
            
            <div className="mb-4">
              <p><strong>Student:</strong> {selectedAssessment.Student_Name}</p>
              <p><strong>Educator:</strong> {selectedAssessment.Educator_Name}</p>
              <p><strong>Assessment Date:</strong> {format(new Date(selectedAssessment.Assessment_Date), "MMMM d, yyyy")}</p>
              <p><strong>Comments:</strong></p>
              <div className="bg-gray-100 p-3 rounded mt-2 whitespace-pre-wrap">
                {parseComments(selectedAssessment.Comments)}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              {selectedAssessment.Decision_Made ? (
                <button 
                  className="btn btn-primary" 
                  onClick={closeDecisionModal}
                >
                  Close
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-ghost" 
                    onClick={closeDecisionModal}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-error" 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to not enroll this student?")) {
                        handleEnrollmentDecision(false);
                      }
                    }}
                  >
                    <FiX className="mr-1" />
                    Do Not Enroll
                  </button>
                  <button 
                    className="btn btn-success" 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to enroll this student?")) {
                        handleEnrollmentDecision(true);
                      }
                    }}
                  >
                    <FiCheck className="mr-1" />
                    Enroll
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAssessmentsPage;
