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

export const getAllViolationsForManager = async (accountId) => {
    try {
        const response = await axios.get(`${API_URL}/Violation/manager/${accountId}`);
        if (response.status === 200 || response.data.success) {
            return { success: true, data: response.data?.data || [] };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch all violations for manager' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching all violations for manager' };
    }
};

export const updateViolationResolution = async (data) => {
    try {
        console.log('Updating violation resolution with data:', data);
        const response = await axios.put(`${API_URL}/Violation/resolution`, data);
        if (response.status === 200 || response.data.success) {
            return { success: true, message: response.data?.message || null };
        }
        return { success: false, message: response.data?.message || 'Failed to update violation resolution' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error updating violation resolution' };
    }
};

export const createViolationReport = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/Violation`, data);
        if (response.status === 200 || response.data.success) {
            return { success: true, message: response.data?.message || null };
        }
        return { success: false, message: response.data?.message || 'Failed to create violation report' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error creating violation report' };
    }
};