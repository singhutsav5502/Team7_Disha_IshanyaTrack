import { api } from '../config';

export const login = async (Id: string, pwd: string) => {
  try {
    const response = await api.post('/login', { Id, pwd });
    return { id: Id, ...response.data };
  } catch (error) {
    console.error("Error during login:", error);
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
