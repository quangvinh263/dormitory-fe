import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const getRoomTypesInRegistration = async () => {
    try {
        const response = await axios.get(`${API_URL}/RoomType/registration`);
        if (response.status === 200 || response.data.success) {
            return { success: true, data: response.data?.data || [] };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch room types' };
    }
    catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching room types' };
    }
};

export const updateRoomType = async (data) => {
    try {
        const response = await axios.put(`${API_URL}/RoomType`, data);
        if (response.status === 200 || response.data.success) {
            return { success: true, data: response.data?.data };
        }
        return { success: false, message: response.data?.message || 'Failed to update room type' };
    }
    catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error updating room type' };
    }
};

export const createRoomType = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/RoomType`, data);
        if (response.status === 200 || response.data.success) {
            return { success: true, message: response.data?.message };
        }
        return { success: false, message: response.data?.message || 'Failed to create room type' };
    }
    catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error creating room type' };
    }
};

export const deleteRoomType = async (roomTypeId) => {
    try {
        const response = await axios.delete(`${API_URL}/RoomType/${roomTypeId}`);
        if (response.status === 200 || response.data.success) {
            return { success: true, message: response.data?.message };
        }
        return { success: false, message: response.data?.message || 'Failed to delete room type' };
    }
    catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error deleting room type' };
    }
};