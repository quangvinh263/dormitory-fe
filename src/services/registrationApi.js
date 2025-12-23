import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const createRegistration = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/Registration/create`, data);
        if (response.status === 201 || response.data.success) {
            return { success: true, message: response.data?.message, registrationId: response.data?.registrationId || 'Registration created successfully' };
        }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Failed to create registration' };
    }
};

export const createZaloLink = async (registrationId) => {
    try {
        const response = await axios.post(`${API_URL}/Payment/create-zalopay-link/registration/${registrationId}`);
        console.log('Create ZaloPay Link API Response:', response.data); // Debug log
        
        if (response.status === 200) {
            return { 
                success: response.data?.isSuccess || false,  // ✅ Đổi từ IsSuccess sang isSuccess
                message: response.data?.message || '',        // ✅ Đổi từ Message sang message
                paymentId: response.data?.paymentId || '',    // ✅ Đổi từ PaymentId sang paymentId
                paymentUrl: response.data?.paymentUrl || ''   // ✅ Đổi từ PaymentUrl sang paymentUrl
            };
        }
        return { success: false, message: 'Failed to create ZaloPay link' };
    } catch (error) {
        console.error('Create ZaloPay Link Error:', error.response?.data);
        return { 
            success: false, 
            message: error.response?.data?.message || error.response?.data?.Message || 'Failed to create ZaloPay link' 
        };
    }
};