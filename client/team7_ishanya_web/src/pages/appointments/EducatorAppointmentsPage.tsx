import React, { useState, useEffect } from "react";
import { fetchEducatorAppointments, fetchAllAppointments, completeAppointment } from "../../api";
import { toast } from "react-toastify";
import { FiCheck, FiSearch, FiCalendar, FiClock } from "react-icons/fi";
import { useSelector } from "react-redux";
import { getUserId, getUserType } from "../../store/slices/authSlice";
import { USER_ROLES } from "../../types";
import { format } from "date-fns";
import { AxiosError } from "axios";

interface Appointment {
  Appointment_ID: number;
  Query_ID: number;
  Educator_ID: string;
  Scheduled_Date: string;
  Status: 'Scheduled' | 'Completed' | 'Cancelled';
  Notes: string;
  Created_At: string;
  Parent_Name: string;
  Parent_Email: string;
  Student_Name: string;
  Query: string;
  Educator_Name?: string; // Added for admin view
}

const EducatorAppointmentsPage: React.FC = () => {
  const userId = useSelector(getUserId);
  const userType = useSelector(getUserType);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAssessmentModal, setShowAssessmentModal] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [assessmentComments, setAssessmentComments] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [educatorFilter, setEducatorFilter] = useState<string>("all");
  const [uniqueEducators, setUniqueEducators] = useState<{id: string, name: string}[]>([]);

  // Check if user is an educator, admin, or superuser
  const isEducator = userType === USER_ROLES.EDUCATOR;
  const isAdminOrHigher = userType === USER_ROLES.ADMIN || userType === USER_ROLES.SUPERUSER;
  const canViewAllAppointments = isAdminOrHigher;

  // Fetch appointments based on user role
  useEffect(() => {
    const getAppointments = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        let appointmentsData;
        
        if (canViewAllAppointments) {
          // Admin or superuser - fetch all appointments
          appointmentsData = await fetchAllAppointments();
        } else if (isEducator) {
          // Educator - fetch only their appointments
          appointmentsData = await fetchEducatorAppointments(userId);
        } else {
          // Not authorized
          return;
        }
        
        setAppointments(appointmentsData);
        setFilteredAppointments(appointmentsData);
        
        // Extract unique educators for filtering (admin view only)
        if (canViewAllAppointments && appointmentsData.length > 0) {
          const educators = appointmentsData.reduce((acc: {id: string, name: string}[], appointment) => {
            if (appointment.Educator_ID && appointment.Educator_Name) {
              const exists = acc.some(e => e.id === appointment.Educator_ID);
              if (!exists) {
                acc.push({
                  id: appointment.Educator_ID,
                  name: appointment.Educator_Name
                });
              }
            }
            return acc;
          }, []);
          setUniqueEducators(educators);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          const { response } = error;
          if (response) {
            console.error(`Error fetching appointments: ${response.data.error}`);
            console.error(`Error details: ${response.data.details}`);
            console.error(`Status code: ${response.status}`);
            toast.error(`Failed to load appointments: ${response.data.error}`);
          } else {
            console.error("Network error or server is unreachable");
            toast.error("Network error or server is unreachable");
          }
        } else {
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred while loading appointments");
        }
      } finally {
        setLoading(false);
      }
    };

    getAppointments();
  }, [userId, userType, canViewAllAppointments, isEducator]);

  // Handle search and filter
  useEffect(() => {
    let filtered = [...appointments];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(appointment => appointment.Status === statusFilter);
    }
    
    // Apply educator filter (admin view only)
    if (canViewAllAppointments && educatorFilter !== "all") {
      filtered = filtered.filter(appointment => appointment.Educator_ID === educatorFilter);
    }
    
    // Apply search term
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (appointment) =>
          appointment.Parent_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.Parent_Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.Student_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.Query?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (appointment.Educator_Name && appointment.Educator_Name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredAppointments(filtered);
  }, [searchTerm, appointments, statusFilter, educatorFilter, canViewAllAppointments]);

  // Open assessment modal
  const openAssessmentModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setAssessmentComments("");
    setShowAssessmentModal(true);
  };

  // Close assessment modal
  const closeAssessmentModal = () => {
    setSelectedAppointment(null);
    setAssessmentComments("");
    setShowAssessmentModal(false);
  };

  // Handle completing appointment and adding assessment
  const handleCompleteAppointment = async () => {
    if (!selectedAppointment || !assessmentComments) {
      toast.error("Please add assessment comments");
      return;
    }

    try {
      // Use the educator ID from the appointment if admin is completing it
      const educatorId = isEducator ? userId as string : selectedAppointment.Educator_ID;
      
      const response = await completeAppointment(
        selectedAppointment.Appointment_ID,
        educatorId,
        { comment: assessmentComments }
      );

      if (response.success) {
        toast.success("Appointment completed and assessment added successfully");
        
        // Update local state
        const updatedAppointments = appointments.map(appointment => 
          appointment.Appointment_ID === selectedAppointment.Appointment_ID
            ? { ...appointment, Status: 'Completed' as 'Completed' }
            : appointment
        );
        
        setAppointments(updatedAppointments);
        closeAssessmentModal();
      } else {
        toast.error(response.message || "Failed to complete appointment");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const { response } = error;
        if (response) {
          console.error(`Error completing appointment: ${response.data.error}`);
          toast.error(`Failed to complete appointment: ${response.data.error}`);
        } else {
          console.error("Network error or server is unreachable");
          toast.error("Network error or server is unreachable");
        }
      } else {
        console.error("Error completing appointment:", error);
        toast.error("An unexpected error occurred while completing the appointment");
      }
    }
  };

  if (!isEducator && !isAdminOrHigher) {
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
      <h1 className="text-3xl font-bold mb-6">
        {canViewAllAppointments ? "All Appointments" : "My Appointments"}
      </h1>

      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="form-control w-full md:w-1/3 mb-4 md:mb-0">
              <div className="input-group flex gap-5">
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-square">
                  <FiSearch className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 mb-4 md:mb-0">
              <select 
                className="select select-bordered" 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
              </select>
              
              {canViewAllAppointments && uniqueEducators.length > 0 && (
                <select 
                  className="select select-bordered mt-2 md:mt-0" 
                  value={educatorFilter}
                  onChange={(e) => setEducatorFilter(e.target.value)}
                >
                  <option value="all">All Educators</option>
                  {uniqueEducators.map(educator => (
                    <option key={educator.id} value={educator.id}>
                      {educator.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Total Appointments</div>
                <div className="stat-value">{appointments.length}</div>
                <div className="stat-desc">
                  {appointments.filter(a => a.Status === 'Scheduled').length} scheduled
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : filteredAppointments.length === 0 ? (
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
                    ? "No appointments match your search criteria."
                    : "No appointments found."}
                </span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Parent Name</th>
                    <th>Student Name</th>
                    {canViewAllAppointments && <th>Educator</th>}
                    <th>Scheduled Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.Appointment_ID} className="hover">
                      <td>{appointment.Appointment_ID}</td>
                      <td>{appointment.Parent_Name}</td>
                      <td>{appointment.Student_Name || "-"}</td>
                      {canViewAllAppointments && <td>{appointment.Educator_Name}</td>}
                      <td>
                        <div className="flex items-center">
                          <FiCalendar className="mr-2" />
                          {format(new Date(appointment.Scheduled_Date), "MMM d, yyyy")}
                          <FiClock className="ml-3 mr-1" />
                          {format(new Date(appointment.Scheduled_Date), "h:mm a")}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          appointment.Status === 'Completed' 
                            ? 'badge-success' 
                            : 'badge-primary'
                        }`}>
                          {appointment.Status}
                        </span>
                      </td>
                      <td>
                        {appointment.Status === 'Scheduled' && (
                          <button
                            className="btn btn-sm btn-primary text-white"
                            onClick={() => openAssessmentModal(appointment)}
                          >
                            <FiCheck className="mr-1" />
                            Complete
                          </button>
                        )}
                        {appointment.Status === 'Completed' && (
                          <span className="text-sm text-gray-500">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Assessment Modal */}
      {showAssessmentModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Complete Appointment & Add Assessment</h2>
            
            <div className="mb-4">
              <p><strong>Parent:</strong> {selectedAppointment.Parent_Name}</p>
              <p><strong>Student:</strong> {selectedAppointment.Student_Name || "N/A"}</p>
              <p><strong>Email:</strong> {selectedAppointment.Parent_Email}</p>
              {canViewAllAppointments && (
                <p><strong>Educator:</strong> {selectedAppointment.Educator_Name}</p>
              )}
              <p><strong>Scheduled Date:</strong> {selectedAppointment.Scheduled_Date && 
                format(new Date(selectedAppointment.Scheduled_Date), "MMMM d, yyyy h:mm a")}</p>
            </div>
            
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">Assessment Comments</span>
              </label>
              <textarea 
                className="textarea textarea-bordered h-32" 
                placeholder="Enter your assessment comments here..."
                value={assessmentComments}
                onChange={(e) => setAssessmentComments(e.target.value)}
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                className="btn btn-ghost" 
                onClick={closeAssessmentModal}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary text-white" 
                onClick={handleCompleteAppointment}
              >
                Complete & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducatorAppointmentsPage;
