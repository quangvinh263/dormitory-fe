import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const getBillsByStudent = async (accountId) => {
    try {
        const response = await axios.get(`${API_URL}/UtilityBill/by-student/${accountId}`);
        if (response.status === 200) {
            return { success: true, data: response.data?.data || [] };
        }
        return { success: false, error: 'Failed to fetch bills.' };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getZaloPayLink = async (billId, accountId) => {
    try {
        const response = await axios.post(
            `${API_URL}/Payment/create-zalopay-link/utility/${billId}`,
            null,
            { params: { accountId } }
        );
        
        console.log('ZaloPay API response:', response);
        
        if (response.status === 200 || response.status === 201) {
            return {
                success: response.data?.isSuccess || false,
                message: response.data?.message || '',
                paymentId: response.data?.paymentId || '',
                paymentUrl: response.data?.paymentUrl || ''
            };
        }
        return { success: false, error: 'Failed to fetch ZaloPay link.' };
    } catch (error) {
        return { 
            success: false, 
            error: error.response?.data?.message || error.message 
        };
    }
};

export const getBillsByManager = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/UtilityBill/by-manager`, data);   
        console.log('API Response:', response);
        if (response.status === 200) {
            return { success: true, data: response.data?.data || [] };
        }
        return { success: false, error: 'Failed to fetch bills.' };
    } catch (error) {
        return { success: false, error: error.message };
    }
};