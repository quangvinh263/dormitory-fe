import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const signUp = async(data) => {
  try {
    const response = await axios.post(`${API_URL}/Auth/Register`, data);
    if (response.status === 200 && response.data.success) {
        return { success: true, message: response.data?.message || 'Sign up successful' };
    }
    return { success: false, message: response.data?.message || 'Sign up failed' };
    } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Sign up error' };
  } 
};

export const signIn = async(data) => {
  try {
    const response = await axios.post(`${API_URL}/Auth/Login`, data);
    if (response.status === 200 && response.data.success) {
        return { 
            success: true, 
            accesstoken: response.data.accesstoken, 
            refreshtoken: response.data.refreshtoken, 
            accountId: response.data.accountId, 
            role: response.data.role
         };
    }
    return { success: false, message: response.data?.message || 'Sign in failed' };
    } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Sign in error' };
  }
};

export const signOut = async (refreshToken) => {
  try {
    if (!refreshToken) return { success: false, message: 'No refresh token provided' };
    const response = await axios.post(`${API_URL}/Auth/LogOut`, { refreshToken });
    if (response.status === 200 || response.data.success) {
      return { success: true, message: response.data?.message || 'Signed out' };
    }
    return { success: false, message: response.data?.message || 'Sign out failed' };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Sign out error' };
  }
};