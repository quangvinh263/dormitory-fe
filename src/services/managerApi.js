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

export const getAllManagers = async () => {
    try {
        const response = await axios.get(`${API_URL}/BuildingManager`);
        if (response.status === 200 || response.data.success) {
            return { success: true, data: response.data?.data || [] };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch managers' };
    }
    catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching managers' };
    }
};

export const updateManager = async (data) => {
    try {
        const response = await axios.put(`${API_URL}/BuildingManager`, data);
        if (response.status === 200 || response.data.success) {
            return { success: true, message: response.data?.message || null };
        }
        return { success: false, message: response.data?.message || 'Failed to update manager' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error updating manager' };
    }
};

export const createManager = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/BuildingManager`, data);
        if (response.status === 200 || response.data.success) {
            return { success: true, message: response.data?.message || null };
        }
        return { success: false, message: response.data?.message || 'Failed to create manager' };
    }
    catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error creating manager' };
    }
};

export const deleteManager = async (managerId) => {
    try {
        const response = await axios.delete(`${API_URL}/BuildingManager/${managerId}`);
        if (response.status === 200 || response.data.success) {
            return { success: true, message: response.data?.message || null };
        }
        return { success: false, message: response.data?.message || 'Failed to delete manager' };
    }
    catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error deleting manager' };
    }
};

export const getManagerInfo = async (accountId) => {
    try {
        const response = await axios.get(`${API_URL}/BuildingManager/account/${accountId}`);
        if (response.status === 200 || response.data.success) {
            return { success: true, message: response.data?.message || null };
        }
        return { success: false, message: response.data?.message || 'Failed to retrived data manager' };
    }
    catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error retrived data manager' };
    }
};