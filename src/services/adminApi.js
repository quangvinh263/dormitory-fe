import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const getStatsOverviewForAdmin = async () => {
    try {
        const response = await axios.get(`${API_URL}/Report/admin-overview`);
        if (response.status === 200 || response.data.success) {
            return { success: true, data: response.data?.data || {} };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch violation stats for manager' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching violation stats for manager' };
    }
};


export const getStatsBuildingForAdmin = async () => {
    try {
        const response = await axios.get(`${API_URL}/Report/admin-stat-building`);
        if (response.status === 200 || response.data.success) {
            return { success: true, data: response.data?.data || {} };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch violation stats for manager' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching violation stats for manager' };
    }
};

export const createParameterConfig = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/Parameter/CreateNewParameter`, data);
        if (response.status === 200 || response.data.success) {
            return { success: true, message: response.data?.message || 'Parameter created successfully' };
        }
        return { success: false, message: response.data?.message || 'Failed to create parameter' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error creating parameter' };
    }
};

