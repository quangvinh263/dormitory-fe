import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const getViolationStatsForManager = async (accountId) => {
    try {
        const response = await axios.get(`${API_URL}/BuildingManager/dashboard-stats/${accountId}`);
        if (response.status === 200 || response.data.success) {
            return { success: true, data: response.data?.data || {} };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch violation stats for manager' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching violation stats for manager' };
    }
};

export const getReceiptsForManager = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/BuildingManager/receipts`, data);   
        if (response.status === 200 || response.data.success) {
            return { success: true, data: response.data?.data || [] };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch receipts for manager' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching receipts for manager' };
    }
};