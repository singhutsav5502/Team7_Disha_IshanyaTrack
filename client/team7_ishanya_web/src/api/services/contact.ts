import { api } from '../config';

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
