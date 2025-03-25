import { api } from "../config";
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


// Fetch all appointments (for admin/superuser)
export const fetchAllAppointments = async () => {
  try {
    const response = await api.get('/all-appointments');
    return response.data;
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    throw error;
  }
};
