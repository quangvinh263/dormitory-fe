import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const getSchoolInfo = async () => {
  try {
    const response = await axios.get(`${API_URL}/PublicInformation/Schools`);
    if (response.status === 200 && response.data) {
        return { success: true, data: response.data.schools || [] };
    }
    return { success: false, message: response.data?.message || 'Failed to fetch school info' };
    } catch (error) {
    console.error('School API Error:', error);
    return { success: false, message: error.response?.data?.message || 'Error fetching school info' };
  }
};

export const getPriorityInfo = async () => {
  try {
    const response = await axios.get(`${API_URL}/PublicInformation/Priorities`);
    if (response.status === 200 && response.data) {
        return { success: true, data: response.data.priorities || [] };
    }
    return { success: false, message: response.data?.message || 'Failed to fetch priority info' };
    } catch (error) {
    console.error('Priority API Error:', error);
    return { success: false, message: error.response?.data?.message || 'Error fetching priority info' };
  }
};