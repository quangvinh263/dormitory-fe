import axios from './axiosInstance';
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const getExpiredContracts = async (beforeDate) => {
    try {
        const response = await axios.get(`${API_URL}/Report/expired-contracts`, {
            params: { beforeDate: beforeDate }
        });
        if (response.status === 200 || response.data?.success) {
            return { success: true, data: response.data?.data };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch expired contracts' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching expired contracts' };
    }   
};

export const getContractsByStudentId = async (studentId) => {
    try {
        const response = await axios.get(`${API_URL}/Report/student/${studentId}/contracts`);
        if (response.status === 200 && response.data?.success) {
            return { success: true, data: response.data?.data || [] };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch student contracts' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching student contracts' };
    }
};