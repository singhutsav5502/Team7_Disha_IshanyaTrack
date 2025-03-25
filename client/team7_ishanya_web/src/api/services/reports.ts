import { api, API_BASE_URL } from '../config';

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
