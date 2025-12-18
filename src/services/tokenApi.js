import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios.post(`${API_URL}/Auth/Refresh`, { refreshToken });
        if (response.status === 200 && response.data.success) {
            localStorage.setItem("token", response.data.accesstoken);
            return {
                success: true,
                token: response.data.accesstoken,
            };
        }
        return { success: false, message: response.data?.message || 'Token refresh failed' };
    }
    catch (error) {
        return { success: false, message: error.response?.data?.message || 'Token refresh error' };
    }
};