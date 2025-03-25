import { api } from '../config';

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

export const create_new_educator = async (educatorData) => {
  try {
    const response = await api.post('/create_new_educator', educatorData);
    return response.data;
  } catch (error) {
    console.error("Error creating educator:", error);
    throw error;
  }
};

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

export const fetchEducatorDetails = async (educatorId: string) => {
  try {
    const response = await api.post('/get_employee_by_id', { Employee_ID: educatorId });
    return response.data;
  } catch (error) {
    console.error("Error fetching educator details:", error);
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

export const deleteEmployee = async (employeeId: string) => {
  try {
    const response = await api.delete(`/delete-employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};
