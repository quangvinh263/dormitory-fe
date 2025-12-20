import axios from "axios";

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