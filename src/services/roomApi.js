import { data } from "react-router-dom";
import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const getRegistrationRooms = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/Room/registration`, data);
        if (response.status === 200 || response.data.success) {
            return { success: true, data: response.data?.data || [] };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch registration rooms' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching registration rooms' };
    }
};

export const getAvailableRooms = async (filterData) => {
    try {
        const response = await axios.post(`${API_URL}/Room/available`, filterData);
        
        if (response.status === 200 && response.data.success) {
            return { success: true, data: response.data.data || [] };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch rooms' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching rooms' };
    }
};

export const getEquipmentByRoom = async (roomId) => {
    try {
        const response = await axios.get(`${API_URL}/Report/room/${roomId}/equipment`);
        
        if (response.status === 200 && response.data.success) {
            return { success: true, data: response.data.data || [] };
        }
        return { success: false, message: response.data?.message || 'Không thể lấy dữ liệu thiết bị' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Lỗi kết nối server' };
    }
};

export const getRoomDetailsForManager = async (accountId) => {
    try {
        const response = await axios.get(`${API_URL}/Room/manager/${accountId}`);
        if (response.status === 200 || response.data.success) {
            return { success: true, data: response.data?.data || [] };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch room details for manager' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching room details for manager' };
    }
};

export const updateRoom = async (data) => {
    try {
        const response = await axios.put(`${API_URL}/Room`, data);
        if (response.status === 200 || response.data.success) {
            return { success: true, message: response.data?.message || null };
        }
        return { success: false, message: response.data?.message || 'Failed to update room' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error updating room' };
    }
};

export const createRoom = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/Room`, data);
        if (response.status === 200 || response.data.success) {
            return { success: true, message: response.data?.message || null };
        }
        return { success: false, message: response.data?.message || 'Failed to create room' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error creating room' };
    }
};