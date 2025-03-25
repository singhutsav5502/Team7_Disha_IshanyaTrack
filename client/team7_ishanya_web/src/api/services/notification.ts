import { api, API_BASE_URL } from '../config';
import axios from 'axios';

export const sendNotifications = async (studentIds, title, body) => {
  try {
    if (studentIds.length === 1) {
      return await sendNotificationToStudent(studentIds[0], title, body);
    }
    else {
      return await sendAppNotifications(studentIds, title, body);
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
    throw error;
  }
};

export const sendAppNotifications = async (studentIds: string[], title: string, body: string) => {
  try {
    const response = await api.post('/notify-multiple', {
      student_ids: studentIds,
      title,
      body
    });
    return response.data;
  } catch (error) {
    console.error("Error sending app notifications:", error);
    throw error;
  }
};

export const sendEmailBroadcast = async (subject: string, body: string, sendToStudentParents: boolean, sendToEmployees: boolean) => {
  try {
    const response = await api.post('/send-email-broadcast', {
      subject,
      body,
      sendToStudentParents,
      sendToEmployees
    });
    return response.data;
  } catch (error) {
    console.error("Error sending email broadcast:", error);
    throw error;
  }
};

export const saveNotificationToken = async (studentId: string, token: string) => {
  try {
    const formData = new FormData();
    formData.append('student_id', studentId);
    formData.append('token', token);

    const response = await axios.post(`${API_BASE_URL}/save-token`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error saving notification token:", error);
    throw error;
  }
};

export const sendNotificationToStudent = async (studentId: string, title: string, body: string) => {
  try {
    const response = await api.post(`/notify/${studentId}`, { title, body });
    return response.data;
  } catch (error) {
    console.error("Error sending notification to student:", error);
    throw error;
  }
};
