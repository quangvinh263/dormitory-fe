import axios from './axiosInstance'
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/RoomEquipment`

/**
 * GET: api/RoomEquipment/{roomId}
 * Lấy chi tiết một yêu cầu bảo trì theo ID
 */
export const getEquipmentsByRoomId = async (roomId) => {
    try {
        const response = await axios.get(`${API_URL}/roomId=${roomId}`)
        if (response.status === 200 || response.data?.success) {
            return { success: true, data: response.data?.data ?? response.data?.dto ?? response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to fetch maintenance detail' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching maintenance detail' }
    }
}

/**
 * POST: api/RoomEquipment/
 */
export const changeStatus = async (dto) => {
    try {
        const response = await axios.post(`${API_URL}`, dto)
        if (response.status === 200 || response.data?.success) {
            return { success: true, message: response.data?.message || 'Status updated successfully' }
        }
        return { success: false, message: response.data?.message || 'Failed to update status' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error updating status' }
    }
}