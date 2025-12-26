import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const getViolationStatsForManager = async (accountId) => {
    try {
        const response = await axios.get(`${API_URL}/Violation/manager/dashboard/${accountId}`);
        if (response.status === 200 || response.data.success) {
            return { success: true, data: response.data?.data || {} };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch violation stats for manager' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching violation stats for manager' };
    }
};

export const getViolationsByStudent = async (studentId) => {
    try {
        const response = await axios.get(`${API_URL}/Violation/student/${studentId}`);
        if (response.status === 200 || response.data.success) {
            return { success: true, data: response.data?.data || [] };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch violations for student' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching violations for student' };
    }
};