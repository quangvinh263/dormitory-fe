import axios from './axiosInstance'
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/health-insurances`

/**
 * GET: api/health-insurances
 * Lấy danh sách BHYT có lọc (keyword, hospitalName, year, status)
 * Params truyền vào dạng object: { keyword: '', year: 2024, ... }
 */
export const getHealthInsurances = async (params) => {
    try {
        const response = await axios.get(`${API_URL}`, { params })
        if (response.status === 200 || response.data?.success) {
            return { success: true, data: response.data?.data ?? response.data?.dto ?? response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to fetch insurance list' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching insurance list' }
    }
}

/**
 * GET: api/health-insurances/{id}
 * Lấy chi tiết BHYT theo Insurance ID
 */
export const getDetailHealthInsurance = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`)
        if (response.status === 200 || response.data?.success) {
            return { success: true, data: response.data?.data ?? response.data?.dto ?? response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to fetch insurance detail' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching insurance detail' }
    }
}

export const getHealthInsurancePrice = async (year) => {
    try {
        // params: { year } sẽ tự động chuyển thành ?year=2025 trên URL
        const response = await axios.get(`${API_URL}/prices`, { params: { year } })

        if (response.status === 200 || response.data?.success) {
            return { 
                success: true, 
                data: response.data?.data ?? response.data?.dto ?? response.data 
            }
        }
        return { 
            success: false, 
            message: response.data?.message || 'Failed to fetch insurance price' 
        }
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Error fetching insurance price' 
        }
    }
}

/**
 * GET: api/health-insurances/students/{studentId}
 * Lấy BHYT theo Student ID
 */
export const getStudentInsurance = async (studentId) => {
    try {
        const response = await axios.get(`${API_URL}/students/${studentId}`)
        if (response.status === 200 || response.data?.success) {
            return { success: true, data: response.data?.data ?? response.data?.dto ?? response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to fetch student insurance' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching student insurance' }
    }
}

/**
 * POST: api/health-insurances
 * Đăng ký mới BHYT
 * Payload: { studentId, hospitalId, cardNumber }
 */
export const registerInsurance = async (data) => {
    try {
        const response = await axios.post(`${API_URL}`, data)
        // Controller trả về 201 Created khi thành công
        if (response.status === 200 || response.status === 201 || response.data?.success) {
            return { success: true, data: response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to register insurance' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error registering insurance' }
    }
}

/**
 * POST: api/health-insurances/{id}/payment-confirmations
 * Xác nhận thanh toán
 */
export const confirmInsurancePayment = async (id) => {
    try {
        const response = await axios.post(`${API_URL}/${id}/payment-confirmations`, {})
        if (response.status === 200 || response.data?.success) {
            return { success: true, message: response.data?.message || 'Payment confirmed successfully' }
        }
        return { success: false, message: response.data?.message || 'Failed to confirm payment' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error confirming payment' }
    }
}

/**
 * POST: api/health-insurances/prices
 * Tạo cấu hình giá BHYT mới
 * Payload: { ...CreateHealthPriceDTO }
 */
export const createHealthPrice = async (priceData) => {
    try {
        const response = await axios.post(`${API_URL}/prices`, priceData)
        if (response.status === 200 || response.status === 201 || response.data?.success) {
            return { success: true, data: response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to create health price' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error creating health price' }
    }
}

