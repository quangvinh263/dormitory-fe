import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const getLastestNotifications = async (accountId) => {
  try {
    console.log('🔍 Fetching notifications for accountId:', accountId);
    console.log('🔗 API URL:', `${API_URL}/Notification/latest/${accountId}`);
    
    
    const response = await axios.get(`${API_URL}/Notification/latest/${accountId}`); 
    
    console.log('✅ Notification Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error("Status code:", error.response?.status);
    return { success: false, data: [] };
  }
};

export const markNotificationAsRead = async (notiId) => {
  try {
    const response = await axios.put(`${API_URL}/Notification/mark-as-read/${notiId}`);
    if (response.status === 200) {
      return { success: true, message: 'Notification marked as read' };
    }
    return { success: false, message: 'Failed to mark notification as read' };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error marking notification as read' };
  }
};