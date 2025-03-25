import { api, API_BASE_URL } from '../config';

export const fetchStudents = async () => {
  try {
    const response = await api.get('/students');
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
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

export const create_new_student = async (studentData) => {
  try {
    const response = await api.post('/create_new_student', studentData);
    return response.data;
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
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
