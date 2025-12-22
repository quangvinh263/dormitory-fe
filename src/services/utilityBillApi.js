import axios from "axios";

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