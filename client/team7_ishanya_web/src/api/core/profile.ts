import { api } from '../config';
import { USER_ROLES } from "../../types";

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
