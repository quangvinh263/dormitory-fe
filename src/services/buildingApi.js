import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const getBuildingsForRegistration = async () => {
    try {
        const response = await axios.get(`${API_URL}/Building/registration`);
        if (response.status === 200 || response.data.success) {
            return { success: true, data: response.data?.data || [] };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch buildings' };
    }
    catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching buildings' };
    }
};

export const getBuildingsWithManager = async (buildingId) => {
    try {
        const response = await axios.get(`${API_URL}/Building/manager/${buildingId}`);
        if (response.status === 200 || response.data.success) {
            return { success: true, data: response.data?.data || [] };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch buildings with manager' };
    }
    catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching buildings with manager' };
    }
};

export const getRoomsResponseByManager = async (managerId) => {
    try {
        const response = await axios.get(`${API_URL}/Building/manager/rooms/${managerId}`);
        if (response.status === 200 || response.data.success) {
            return { success: true, data: response.data?.data || [] };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch rooms by manager' };
    }
    catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching rooms by manager' };
    }
};

export const createBuilding = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/Building`, data);
        if (response.status === 200 || response.data.success) {
            return { success: true, message: response.data?.message || null };
        }
        return { success: false, message: response.data?.message || 'Failed to create building' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error creating building' };
    }
};

export const updateBuilding = async (data) => {
    try {
        const response = await axios.put(`${API_URL}/Building`, data);
        if (response.status === 200 || response.data.success) {
            return { success: true, message: response.data?.message || null };
        }
        return { success: false, message: response.data?.message || 'Failed to update building' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error updating building' };
    }
};