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

export const getAvailableRooms = async (filterData) => {
    try {
        const response = await axios.post(`${API_URL}/Room/available`, filterData);
        
        if (response.status === 200 && response.data.success) {
            return { success: true, data: response.data.data || [] };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch rooms' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching rooms' };
    }
};

export const getEquipmentByRoom = async (roomId) => {
    try {
        const response = await axios.get(`${API_URL}/Report/room/${roomId}/equipment`);
        
        if (response.status === 200 && response.data.success) {
            return { success: true, data: response.data.data || [] };
        }
        return { success: false, message: response.data?.message || 'Không thể lấy dữ liệu thiết bị' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Lỗi kết nối server' };
    }
};