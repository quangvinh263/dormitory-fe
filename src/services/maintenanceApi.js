
import axios from './axiosInstance'
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/Maintenance`

/**
 * POST: api/maintenance
 * Tạo mới yêu cầu bảo trì
 * Payload (data): { description, equipmentId, images, ... }
 */
export const createMaintenanceRequest = async (data) => {
    try {
        const response = await axios.post(`${API_URL}`, data)
        // Controller trả về 201 cho create thành công
        if (response.status === 200 || response.status === 201 || response.data?.success) {
            return { success: true, data: response.data?.data ?? response.data?.requestMaintenanceId ?? response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to create maintenance request' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error creating maintenance request' }
    }
}

/**
 * GET: api/maintenance
 * Lấy danh sách yêu cầu bảo trì (có lọc theo params)
 * Params: { studentId, keyword, status, equipmentName }
 */
export const getMaintenances = async (params) => {
    try {
        const response = await axios.get(`${API_URL}`, { params })
        if (response.status === 200 || response.data?.success) {
            // Controller trả về data hoặc dto
            return { success: true, data: response.data?.data ?? response.data?.dto ?? response.data?.list ?? response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to fetch maintenance list' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching maintenance list' }
    }
}

/**
 * GET: api/maintenance/{id}
 * Lấy chi tiết một yêu cầu bảo trì theo ID
 */
export const getMaintenanceDetail = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`)
        if (response.status === 200 || response.data?.success) {
            return { success: true, data: response.data?.data ?? response.data?.dto ?? response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to fetch maintenance detail' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching maintenance detail' }
    }
}

/**
 * PATCH: api/maintenance/{id}/status
 * Cập nhật trạng thái yêu cầu bảo trì
 * Payload (data): { status, note, ... }
 */
export const updateMaintenanceStatus = async (id, data) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}/status`, data)
        if (response.status === 200 || response.data?.success) {
            return { success: true, message: response.data?.message || 'Status updated successfully' }
        }
        return { success: false, message: response.data?.message || 'Failed to update status' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error updating status' }
    }
}

/**
 * GET: api/maintenance/overview
 * Lấy tổng quan thống kê bảo trì
 */
export const getMaintenanceOverview = async () => {
    try {
        const response = await axios.get(`${API_URL}/overview`)
        if (response.status === 200 || response.data?.success) {
            return { success: true, data: response.data?.data ?? response.data?.list ?? response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to fetch overview' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching overview' }
    }
}