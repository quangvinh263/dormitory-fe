import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const getContractDetailById = async (contractId) => {
  try {
    const response = await axios.get(`${API_URL}/Contract/student-detail/${contractId}`);
    if (response.status === 200 || response.status === 201) {
        return { success: true, data: response.data?.data || [] };
    }
    return { success: false, message: response.data?.message || 'Failed to fetch contract details' };
    }
    catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching contract details' };
    }
};

export const requestRenewal = async (payload) => {
    try {
        const response = await axios.post(`${API_URL}/Contract/renewal-request`, payload);
        if (response.status === 200 || response.status === 201 || response.data?.success) {
            return { success: true, message: response.data?.message || 'Renewal request created', invoiceId: response.data?.invoiceId || response.data?.data || '' };
        }
        return { success: false, message: response.data?.message || 'Failed to create renewal request' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error creating renewal request' };
    }
};

export const getCurrentContract = async (studentId) => {
    try {
        const response = await axios.get(`${API_URL}/Contract/student/${studentId}`);
        if (response.status === 200 || response.status === 201) {
            return { success: true, data: response.data?.data || response.data?.dto || null };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch current contract' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching current contract' };
    }
};

export const terminateContract = async (studentId) => {
    try {
        const response = await axios.post(`${API_URL}/Contract/terminate/${studentId}`);
        if (response.status === 200 || response.status === 201 || response.data?.success) {
            return { success: true, message: response.data?.message || 'Contract terminated' };
        }
        return { success: false, message: response.data?.message || 'Failed to terminate contract' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error terminating contract' };
    }
};

export const confirmExtension = async (contractId, payload) => {
    try {
        const response = await axios.put(`${API_URL}/Contract/confirm-extension/${contractId}`, payload);
        if (response.status === 200 || response.status === 201 || response.data?.success) {
            return { success: true, message: response.data?.message || 'Extension confirmed' };
        }
        return { success: false, message: response.data?.message || 'Failed to confirm extension' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error confirming extension' };
    }
};

export const changeRoom = async (payload) => {
    try {
        const response = await axios.post(`${API_URL}/Contract/change-room`, payload);
        if (response.status === 200 || response.status === 201 || response.data?.success) {
            return { success: true, message: response.data?.message || 'Room changed' };
        }
        return { success: false, message: response.data?.message || 'Failed to change room' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error changing room' };
    }
};

export const confirmRefund = async (payload) => {
    try {
        const response = await axios.post(`${API_URL}/Contract/confirm-refund`, payload);
        if (response.status === 200 || response.status === 201 || response.data?.success) {
            return { success: true, message: response.data?.message || 'Refund confirmed' };
        }
        return { success: false, message: response.data?.message || 'Failed to confirm refund' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error confirming refund' };
    }
};

export const getDetailContract = async (contractId) => {
    try {
        const response = await axios.get(`${API_URL}/Contract/detail/${contractId}`);
        if (response.status === 200 || response.status === 201) {
            return { success: true, data: response.data?.data || response.data?.dto || null };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch contract detail' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching contract detail' };
    }
};

export const getContractFiltered = async (params = {}) => {
    try {
        const response = await axios.get(`${API_URL}/Contract/filtered`, { params });
        if (response.status === 200 || response.status === 201) {
            return { success: true, data: response.data?.data || response.data?.dto || [] };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch filtered contracts' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching filtered contracts' };
    }
};

export const getContractOverview = async () => {
    try {
        const response = await axios.get(`${API_URL}/Contract/overview`);
        if (response.status === 200 || response.status === 201) {
            return { success: true, data: response.data?.data || response.data?.stat || {} };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch contract overview' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching contract overview' };
    }
};

export const rejectRenewal = async (payload) => {
    try {
        const response = await axios.post(`${API_URL}/Contract/reject-renewal`, payload);
        if (response.status === 200 || response.status === 201 || response.data?.success) {
            return { success: true, message: response.data?.message || 'Renewal rejected' };
        }
        return { success: false, message: response.data?.message || 'Failed to reject renewal' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error rejecting renewal' };
    }
};

export const getStudentContractDetail = async (accountId) => {
    try {
        const response = await axios.get(`${API_URL}/Contract/student-detail/${accountId}`);
        if (response.status === 200 || response.status === 201) {
            return { success: true, data: response.data?.data || response.data?.dto || null };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch student contract detail' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching student contract detail' };
    }
};
