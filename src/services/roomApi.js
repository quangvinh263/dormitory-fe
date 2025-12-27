import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const getRegistrationRooms = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/Room/registration`, data);
        if (response.status === 200 || response.data.success) {
            return { success: true, data: response.data?.data || [] };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch registration rooms' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching registration rooms' };
    }
};

export const getRoomDetailsForManager = async (accountId) => {
    try {
        const response = await axios.get(`${API_URL}/Room/manager/${accountId}`);
        if (response.status === 200 || response.data.success) {
            return { success: true, data: response.data?.data || [] };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch room details for manager' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching room details for manager' };
    }
};