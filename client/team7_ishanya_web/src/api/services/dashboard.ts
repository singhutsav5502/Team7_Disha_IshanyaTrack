import { api } from '../config';

export const fetchDashboardData = async () => {
  try {
    const response = await api.get('/dashboard-stats');
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
