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

export const resendOtpVerifyEmail = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/Auth/ResendOTPVerifyEmail`, { email });
    if (response.status === 200 && response.data.success) {
        return { success: true, message: response.data?.message || 'OTP resent successfully' };
    }
    return { success: false, message: response.data?.message || 'Failed to resend OTP' };
    } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error resending OTP' };
  }
};

export const verifyEmail = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/Auth/VerifyEmail`, data);
    if (response.status === 200 && response.data.success) {
        return { success: true, message: response.data?.message || 'Email verified successfully' };
    }
    return { success: false, message: response.data?.message || 'Email verification failed' };
    } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Email verification error' };
  } 
};

export const signIn = async(data) => {
  try {
    const response = await axios.post(`${API_URL}/Auth/Login`, data);
    if (response.status === 200 && response.data.success) {
        return { 
            success: true, 
            message: response.data?.message || 'Sign in successful',
            accesstoken: response.data.accesstoken, 
            refreshtoken: response.data.refreshtoken, 
            accountId: response.data.accountId
         };
    }
    return { success: false, message: response.data?.message || 'Sign in failed' };
    } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Sign in error' };
  }
};

export const forgotPassword = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/Auth/ForgotPassword`, data);
    if (response.status === 200 && response.data.success) {
        return { success: true, message: response.data?.message || 'Password reset email sent' };
    }
    return { success: false, message: response.data?.message || 'Failed to send password reset email' };
    }
    catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error sending password reset email' };
  }
};

export const resendOtpResetPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/Auth/ResendOTPResetPassword`, { email });
    if (response.status === 200 && response.data.success) {
        return { success: true, message: response.data?.message || 'OTP resent successfully' };
    }
    return { success: false, message: response.data?.message || 'Failed to resend OTP' };
    } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error resending OTP' };
  } 
};

export const verifyResetToken = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/Auth/VerifyResetToken`, data);
    if (response.status === 200 && response.data.success) {
        return { success: true, message: response.data?.message || 'Reset token is valid' };
    }
    return { success: false, message: response.data?.message || 'Invalid reset token' };
    } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error verifying reset token' };
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/Auth/ResetPassword`, data);
    if (response.status === 200 && response.data.success) {
        return { success: true, message: response.data?.message || 'Password reset successful' };
    }
    return { success: false, message: response.data?.message || 'Password reset failed' };
    } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error resetting password' };
  }
};

export const signOut = async (refreshToken) => {
  try {
    if (!refreshToken) return { success: false, message: 'No refresh token provided' };
    const response = await axios.post(`${API_URL}/Auth/Logout`, { refreshToken });
    if (response.status === 200 || response.data.success) {
      return { success: true, message: response.data?.message || 'Signed out' };
    }
    return { success: false, message: response.data?.message || 'Sign out failed' };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Sign out error' };
  }
};