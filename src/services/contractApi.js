import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const handleResponse = (response) => {
    if (!response) return { success: false, message: 'No response' };
    if (response.status === 200 || response.status === 201 || response.data?.success) {
        return { success: true, data: response.data?.data ?? response.data?.dto ?? response.data };
    }
    return { success: false, message: response.data?.message || 'Request failed', raw: response.data };
};

const handleError = (error) => {
    return { success: false, message: error.response?.data?.message || error.message || 'Network error' };
};

export const getStudentContractDetail = async (accountId) => {
    try {
        const response = await axios.get(`${API_URL}/Contract/student-detail/${accountId}`);
        return { ...handleResponse(response), raw: response.data };
    } catch (error) {
        return handleError(error);
    }
};

export const getCurrentContract = async (studentId) => {
    try {
        const response = await axios.get(`${API_URL}/Contract/student/${studentId}`);
        return handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

export const requestRenewal = async (studentId, monthsToExtend) => {
    try {
        const body = { studentId, monthsToExtend };
        const response = await axios.post(`${API_URL}/Contract/request-renewal`, body);
        return handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

export const terminateContract = async (studentId) => {
    try {
        const response = await axios.post(`${API_URL}/Contract/terminate/${studentId}`);
        return handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

export const confirmExtension = async (contractId, monthsAdded) => {
    try {
        const body = { monthsAdded };
        const response = await axios.put(`${API_URL}/Contract/confirm-extension/${contractId}`, body);
        return handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

export const changeRoom = async (changeRoomRequest) => {
    try {
        const response = await axios.post(`${API_URL}/Contract/change-room`, changeRoomRequest);
        return handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

export const confirmRefund = async (confirmRefundDto) => {
    try {
        const response = await axios.post(`${API_URL}/Contract/confirm-refund`, confirmRefundDto);
        return handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

export const getDetailContract = async (contractId) => {
    try {
        const response = await axios.get(`${API_URL}/Contract/detail/${contractId}`);
        return handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

export const getContractFiltered = async (keyword, buildingName, status) => {
    try {
        const params = {};
        if (keyword) params.keyword = keyword;
        if (buildingName) params.buildingName = buildingName;
        if (status) params.status = status;
        const response = await axios.get(`${API_URL}/Contract/filtered`, { params });
        return handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

export const getContractOverview = async () => {
    try {
        const response = await axios.get(`${API_URL}/Contract/overview`);
        return handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

export const rejectRenewal = async (dto) => {
    try {
        const response = await axios.post(`${API_URL}/Contract/reject-renewal`, dto);
        return handleResponse(response);
    } catch (error) {
        return handleError(error);
    }
};

// Backwards-compatible alias used elsewhere in the app
export const getContractDetailById = getStudentContractDetail;

