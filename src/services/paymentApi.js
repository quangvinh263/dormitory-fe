import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const confirmPayment = async (payload) => {
  try {
    // payload: { paymentId, invoiceId, type }
    const response = await axios.post(`${API_URL}/Payment/confirm`, payload);
    if (response.status === 200 || response.status === 201 || response.data?.success) {
      return { success: true, data: response.data, statusCode: response.status };
    }
    return { success: false, message: response.data?.message || 'Failed to confirm payment', statusCode: response.status, raw: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || error.message || 'Network error', statusCode: error.response?.status, raw: error.response?.data };
  }
};

export const getPaymentStatus = async (paymentId) => {
  try {
    const response = await axios.get(`${API_URL}/Payment/status/${paymentId}`);
    if (response.status === 200 || response.data?.success) {
      return { success: true, data: response.data, statusCode: response.status };
    }
    return { success: false, message: response.data?.message || 'Failed to fetch payment status', statusCode: response.status, raw: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || error.message || 'Network error', statusCode: error.response?.status, raw: error.response?.data };
  }
};
