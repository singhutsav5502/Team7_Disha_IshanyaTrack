import { api } from '../config';

export const addOrUpdateAttendance = async (attendanceData) => {
  try {
    const response = await api.post('/attendance', attendanceData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error('Network error');
    }
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

export const fetchAttendanceHistory = async (studentId: string) => {
  try {
    const response = await api.get(`/attendance/history/${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    throw error;
  }
};
