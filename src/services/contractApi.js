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