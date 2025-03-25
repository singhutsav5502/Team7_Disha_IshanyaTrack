import { api } from '../config';

export const fetchProgramData = async () => {
  try {
    const response = await api.get('/programs');
    return response.data;
  } catch (error) {
    console.error("Error fetching program mapping:", error);
    throw error;
  }
};

export const addProgram = async (programData: { Program_Name: string }) => {
  try {
    const response = await api.post('/api/programs', programData);
    return response.data;
  } catch (error) {
    console.error('Error adding program:', error);
    throw error;
  }
};

export const removeProgram = async (programId: string) => {
  try {
    const response = await api.delete(`/api/programs/${programId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing program:', error);
    throw error;
  }
};

export const addEducatorToProgram = async (programId: string, educatorId: string) => {
  try {
    const response = await api.post(`/api/programs/${programId}/educators`, { educatorId });
    return response.data;
  } catch (error) {
    console.error('Error adding educator to program:', error);
    throw error;
  }
};

export const addStudentToProgram = async (programId: string, studentId: string) => {
  try {
    const response = await api.post(`/api/programs/${programId}/students`, { studentId });
    return response.data;
  } catch (error) {
    console.error('Error adding student to program:', error);
    throw error;
  }
};
