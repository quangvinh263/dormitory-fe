import axios from './axiosInstance'
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`


export const getStudentContractDetail = async (accountId) => {
    try {
        const response = await axios.get(`${API_URL}/Contract/students/${accountId}`)
        if (response.status === 200 || response.data?.success) {
            return { success: true, data: response.data?.data ?? response.data?.dto ?? response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to fetch contract details' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching contract details' }
    }
}

export const getCurrentContract = async (studentId) => {
    try {
        const response = await axios.get(`${API_URL}/Contract/student/${studentId}/current`)
        if (response.status === 200 || response.data?.success) {
            return { success: true, data: response.data?.data ?? response.data?.dto ?? response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to fetch current contract' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching current contract' }
    }
}

export const createRenewalRequest = async (studentId, monthsToExtend) => {
    try {
        const body = { studentId, monthsToExtend }
        const response = await axios.post(`${API_URL}/contract/renewals`, body)
        if (response.status === 201 || response.data?.success) {
            return { success: true, data: response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to create renewal request' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error creating renewal request' }
    }
}

export const terminateContract = async (studentId) => {
    try {
        const response = await axios.post(`${API_URL}/Contract/terminate/${studentId}`)
        if (response.status === 200 || response.data?.success) {
            return { success: true, data: response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to terminate contract' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error terminating contract' }
    }
}

export const confirmExtension = async (contractId, monthsAdded) => {
    try {
        const response = await axios.put(`${API_URL}/Contract/confirm-extension/${contractId}`, { monthsAdded })
        if (response.status === 200 || response.data?.success) {
            return { success: true, data: response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to confirm extension' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error confirming extension' }
    }
}

export const changeRoom = async (payload) => {
    try {
        const response = await axios.post(`${API_URL}/Contract/change-room`, payload)
        if (response.status === 200 || response.data?.success) {
            return { success: true, data: response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to change room' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error changing room' }
    }
}

export const confirmRefund = async (payload) => {
    try {
        const response = await axios.post(`${API_URL}/Contract/confirm-refund`, payload)
        if (response.status === 200 || response.data?.success) {
            return { success: true, data: response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to confirm refund' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error confirming refund' }
    }
}

export const getDetailContract = async (contractId) => {
    try {
        const response = await axios.get(`${API_URL}/Contract/detail/${contractId}`)
        if (response.status === 200 || response.data?.success) {
            return { success: true, data: response.data?.dto ?? response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to fetch contract detail' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching contract detail' }
    }
}

export const getContractFiltered = async (keyword, buildingName, status) => {
    try {
        const params = {}
        if (keyword) params.keyword = keyword
        if (buildingName) params.buildingName = buildingName
        if (status) params.status = status
        const response = await axios.get(`${API_URL}/Contract/filtered`, { params })
        if (response.status === 200 || response.data?.success) {
            return { success: true, data: response.data?.dto ?? response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to fetch contracts' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching contracts' }
    }
}

export const getContractOverview = async () => {
    try {
        const response = await axios.get(`${API_URL}/Contract/overview`)
        if (response.status === 200 || response.data?.success) {
            return { success: true, data: response.data?.stat ?? response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to fetch overview' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching overview' }
    }
}

export const rejectRenewal = async (dto) => {
    try {
        const response = await axios.post(`${API_URL}/Contract/reject-renewal`, dto)
        if (response.status === 200 || response.data?.success) {
            return { success: true, data: response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to reject renewal' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error rejecting renewal' }
    }
}

export const getPendingRequest = async (studentId) => {
    try {
        const response = await axios.get(`${API_URL}/contract/pending-renewals?studentId=${studentId}`)
        if (response.status === 200 || response.data?.success) {
            return { success: true, data: response.data }
        }
        return { success: false, message: response.data?.message || 'Failed to get pending request renew' }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error rejecting renewal' }
    }
}


// alias
export const getContractDetailById = getStudentContractDetail
