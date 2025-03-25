import axios from 'axios';
import { USER_ROLES } from "../types";

const API_BASE_URL = "https://team7.pythonanywhere.com";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const login = async (Id: string, pwd: string) => {
  try {
    const response = await api.post('/login', { Id, pwd });
    return { id: Id, ...response.data };
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const fetchProfileData = async (id: string, userType: number) => {
  try {
    let endpoint = '';
    let payload = {};

    if (userType === USER_ROLES.STUDENT) {
      endpoint = '/get_student_by_id';
      payload = { S_ID: id };
    } else {
      endpoint = '/get_employee_by_id';
      payload = { Employee_ID: id };
    }

    const response = await api.post(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw error;
  }
};

export const fetchUserType = async (userId: string) => {
  try {
    const response = await api.post('/get-user-type', { Id: userId });
    return response.data;
  } catch (error) {
    console.error("Error fetching user type:", error);
    throw error;
  }
};

// Employee-related API calls
export const fetchEmployees = async () => {
  try {
    const response = await api.get('/employees');
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const fetchEmployeeImage = async (employeeId: string): Promise<string | null> => {
  try {
    const response = await api.post('/get_employee_image', { id: employeeId });
    return response.data.imageUrl;
  } catch (error) {
    console.error('Error fetching employee image:', error);
    throw error;
  }
};

// Student-related API calls
export const fetchStudents = async () => {
  try {
    const response = await api.get('/students');
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

export const fetchEducatorMapping = async () => {
  try {
    const response = await api.get('/educator_mapping');
    return response.data;
  } catch (error) {
    console.error("Error fetching educator mapping:", error);
    throw error;
  }
};

export const fetchProgramData = async () => {
  try {
    const response = await api.get('/programs');
    return response.data;
  } catch (error) {
    console.error("Error fetching program mapping:", error);
    throw error;
  }
};

export const fetchStudentImage = async (studentId: string): Promise<string | null> => {
  try {
    const response = await api.post('/get_student_image', { id: studentId });
    return response.data.imageUrl;
  } catch (error) {
    console.error('Error fetching student image:', error);
    throw error;
  }
};

// Profile update API calls
export const updateProfileData = async (id: string, userType: number, formData) => {
  try {
    let endpoint = "";

    if (userType === USER_ROLES.STUDENT) {
      endpoint = '/update_student_data';
    } else if (userType > USER_ROLES.STUDENT) {
      endpoint = '/update_employee_data';
    } else {
      throw new Error("Invalid user type");
    }

    const response = await api.post(endpoint, formData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile data:", error);
    throw error;
  }
};

// Dashboard data API call
export const fetchDashboardData = async () => {
  try {
    const response = await api.get('/dashboard-stats');
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

// Add a new program
export const addProgram = async (programData: { Program_Name: string }) => {
  try {
    const response = await api.post('/api/programs', programData);
    return response.data;
  } catch (error) {
    console.error('Error adding program:', error);
    throw error;
  }
};

// Remove an existing program
export const removeProgram = async (programId: string) => {
  try {
    const response = await api.delete(`/api/programs/${programId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing program:', error);
    throw error;
  }
};

// Add educator to program
export const addEducatorToProgram = async (programId: string, educatorId: string) => {
  try {
    const response = await api.post(`/api/programs/${programId}/educators`, { educatorId });
    return response.data;
  } catch (error) {
    console.error('Error adding educator to program:', error);
    throw error;
  }
};

// Add student to program
export const addStudentToProgram = async (programId: string, studentId: string) => {
  try {
    const response = await api.post(`/api/programs/${programId}/students`, { studentId });
    return response.data;
  } catch (error) {
    console.error('Error adding student to program:', error);
    throw error;
  }
};

export const create_new_educator = async (educatorData) => {
  try {
    const response = await api.post('/create_new_educator', educatorData);
    return response.data;
  } catch (error) {
    console.error("Error creating educator:", error);
    throw error;
  }
};

export const create_new_student = async (studentData) => {
  try {
    const response = await api.post('/create_new_student', studentData);
    return response.data;
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
};

export const create_new_employee = async (employeeData) => {
  try {
    const response = await api.post('/create_new_employee', employeeData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message
    };
  }
};

// API function to update employee role
export const updateEmployeeRole = async (employeeId: string, roleType: number) => {
  try {
    const response = await api.post('/update-employee-role', {
      Employee_ID: employeeId,
      Type: roleType
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Error updating employee role:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message
    };
  }
};

export const submitContactQuery = async (queryData: {
  Parent_Name: string;
  Parent_Email: string;
  Student_Name: string;
  Query: string;
}) => {
  try {
    const response = await api.post('/contact-query', queryData);

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Error submitting contact query:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message
    };
  }
};

export const fetchContactQueries = async () => {
  try {
    const response = await api.get('/contact-queries');
    return response.data;
  } catch (error) {
    console.error("Error fetching contact queries:", error);
    throw error;
  }
};

// Resolve (delete) a contact query
export const resolveContactQuery = async (queryId: number) => {
  try {
    await api.delete(`/contact-query/${queryId}`);

    return {
      success: true,
      message: 'Query resolved successfully'
    };
  } catch (error) {
    console.error("Error resolving contact query:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message
    };
  }
};

export const addOrUpdateAttendance = async (attendanceData) => {
  try {
    const response = await api.post('/attendance', attendanceData);
    return response.data;
  } catch (error) {
    console.error('Error adding attendance:', error);
    throw error;
  }
};

export const fetchStudentAttendance = async (studentId: string) => {
  try {
    const response = await api.get(`/attendance/${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    throw error;
  }
};

// Add function to fetch educator details
export const fetchEducatorDetails = async (educatorId: string) => {
  try {
    const response = await api.post('/get_employee_by_id', { Employee_ID: educatorId });
    return response.data;
  } catch (error) {
    console.error("Error fetching educator details:", error);
    throw error;
  }
};

export const fetchAttendanceHistory = async (studentId: string) => {
  try {
    const response = await api.get(`/attendance/history/${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    throw error;
  }
};

// New API calls for broadcast functionality
export const sendNotifications = async (studentIds, title, body) => {
  try {
    if (studentIds.length === 1) {
      return await sendNotificationToStudent(studentIds[0], title, body);
    }
    else {
      return await sendAppNotifications(studentIds, title, body);
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
    throw error;
  }
};

export const sendAppNotifications = async (studentIds: string[], title: string, body: string) => {
  try {
    const response = await api.post('/notify-multiple', {
      student_ids: studentIds,
      title,
      body
    });
    return response.data;
  } catch (error) {
    console.error("Error sending app notifications:", error);
    throw error;
  }
};

export const sendEmailBroadcast = async (subject: string, body: string, sendToStudentParents: boolean, sendToEmployees: boolean) => {
  try {
    const response = await api.post('/send-email-broadcast', {
      subject,
      body,
      sendToStudentParents,
      sendToEmployees
    });
    return response.data;
  } catch (error) {
    console.error("Error sending email broadcast:", error);
    throw error;
  }
};

export const saveNotificationToken = async (studentId: string, token: string) => {
  try {
    const formData = new FormData();
    formData.append('student_id', studentId);
    formData.append('token', token);

    const response = await axios.post(`${API_BASE_URL}/save-token`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error saving notification token:", error);
    throw error;
  }
};

export const sendNotificationToStudent = async (studentId: string, title: string, body: string) => {
  try {
    const response = await api.post(`/notify/${studentId}`, { title, body });
    return response.data;
  } catch (error) {
    console.error("Error sending notification to student:", error);
    throw error;
  }
};

export const updatePassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await api.post('/update-password', {
      userId,
      currentPassword,
      newPassword
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Error updating password:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message
    };
  }
};
export const fetchStudentPrograms = async (studentId: string) => {
  try {
    const response = await api.get(`/get_student_programs?student_id=${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student programs:", error);
    throw error;
  }
};

export const fetchReports = async (userId: string, userType: number) => {
  try {
    const response = await api.post(`${API_BASE_URL}/reports`, { userId, userType });
    return response.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};

export const addReport = async (studentId: string, quarter: string, reportUrl: string) => {
  try {
    const response = await api.post(`${API_BASE_URL}/reports/add`, {
      studentId,
      quarter,
      reportUrl
    });
    return response.data;
  } catch (error) {
    console.error("Error adding report:", error);
    throw error;
  }
};

export const deleteEmployee = async (employeeId: string) => {
  try {
    const response = await api.delete(`${API_BASE_URL}/delete-employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};

export const fetchStudentPerformance = async (studentId: string, quarter: number) => {
  try {
    const tableName = `Performance_${quarter}`;
    const response = await api.post(`${API_BASE_URL}/get_student_performance`, { 
      studentId, 
      tableName 
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching student performance for quarter ${quarter}:`, error);
    throw error;
  }
};

export const updateStudentPerformance = async (studentId: string, quarter: number, performanceData: any) => {
  try {
    const tableName = `Performance_${quarter}`;
    const response = await api.post(`${API_BASE_URL}/update_student_performance`, {
      studentId,
      tableName,
      performanceData
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating student performance for quarter ${quarter}:`, error);
    throw error;
  }
};

// Schedule an appointment
export const scheduleAppointment = async (queryId: number, educatorId: string, scheduledDate: string, notes: string = '') => {
  try {
    const response = await api.post('/schedule-appointment', {
      query_id: queryId,
      educator_id: educatorId,
      scheduled_date: scheduledDate,
      notes
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error("Error scheduling appointment:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message
    };
  }
};

// Get appointments for an educator
export const fetchEducatorAppointments = async (educatorId: string) => {
  try {
    const response = await api.get(`/educator-appointments/${educatorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching educator appointments:", error);
    throw error;
  }
};

// Complete appointment and add assessment
export const completeAppointment = async (appointmentId: number, educatorId: string, comments: any) => {
  try {
    const response = await api.post('/complete-appointment', {
      appointment_id: appointmentId,
      educator_id: educatorId,
      comments
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error("Error completing appointment:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message
    };
  }
};

// Get all assessments for admin
export const fetchAllAssessments = async (decisionStatus: string | null = null) => {
  try {
    let url = '/admin/assessments';
    if (decisionStatus) {
      url += `?decision_status=${decisionStatus}`;
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
};

// Make enrollment decision
export const makeEnrollmentDecision = async (assessmentId: number, enroll: boolean) => {
  try {
    const response = await api.post('/make-enrollment-decision', {
      assessment_id: assessmentId,
      enroll
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error("Error making enrollment decision:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message
    };
  }
};
