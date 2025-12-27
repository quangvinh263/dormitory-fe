import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios.get(`${API_URL}/Auth/Refresh/${refreshToken}`);
        if (response.status === 200) {
            localStorage.setItem("accessToken", response.data.accessToken);
            return {
                success: true,
                token: response.data.accessToken,
            };
        }
        return { success: false, message: response.data?.message || 'Token refresh failed' };
    }
    catch (error) {
        return { success: false, message: error.response?.data?.message || 'Token refresh error' };
    }
};