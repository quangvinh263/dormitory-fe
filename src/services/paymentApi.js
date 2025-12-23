import axios from './axiosInstance'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}`

export const createZaloPayLinkForRegistration = async (registrationId) => {
  try {
    const response = await axios.post(`${API_URL}/Payment/zalo/registration`, { registrationId })
    if (response.status === 200 || response.data?.success) return { success: true, data: response.data }
    return { success: false, message: response.data?.message || 'Failed to create payment link for registration' }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error creating payment link for registration' }
  }
}

export const createZaloPayLinkForRenewal = async (receiptId) => {
  try {
    const response = await axios.post(`${API_URL}/Payment/zalo/renewal`, { receiptId })
    if (response.status === 200 || response.data?.success) return { success: true, data: response.data }
    return { success: false, message: response.data?.message || 'Failed to create payment link for renewal' }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error creating payment link for renewal' }
  }
}

export const createZaloPayLinkForUtility = async (utilityId, accountId) => {
  try {
    const response = await axios.post(`${API_URL}/Payment/zalo/utility`, { utilityId, accountId })
    if (response.status === 200 || response.data?.success) return { success: true, data: response.data }
    return { success: false, message: response.data?.message || 'Failed to create payment link for utility' }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error creating payment link for utility' }
  }
}

export const createZaloPayLinkForHealthInsurance = async (insuranceId) => {
  try {
    const response = await axios.post(`${API_URL}/Payment/zalo/insurance`, { insuranceId })
    if (response.status === 200 || response.data?.success) return { success: true, data: response.data }
    return { success: false, message: response.data?.message || 'Failed to create payment link for insurance' }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error creating payment link for insurance' }
  }
}

export const createZaloPayLinkForRoomChange = async (receiptId) => {
  try {
    const response = await axios.post(`${API_URL}/Payment/zalo/room-change`, { receiptId })
    if (response.status === 200 || response.data?.success) return { success: true, data: response.data }
    return { success: false, message: response.data?.message || 'Failed to create payment link for room change' }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error creating payment link for room change' }
  }
}

export const processZaloPayCallback = async (payload) => {
  try {
    const response = await axios.post(`${API_URL}/Payment/zalo/callback`, payload)
    if (response.status === 200 || response.data?.success) return { success: true, data: response.data }
    return { success: false, message: response.data?.message || 'Failed to process ZaloPay callback' }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error processing ZaloPay callback' }
  }
}

export default {
  createZaloPayLinkForRegistration,
  createZaloPayLinkForRenewal,
  createZaloPayLinkForUtility,
  createZaloPayLinkForHealthInsurance,
  createZaloPayLinkForRoomChange,
  processZaloPayCallback,
}

