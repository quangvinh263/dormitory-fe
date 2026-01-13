import axios from './axiosInstance';
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

// Helper function để download file Excel
const downloadFile = (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

export const getExpiredContracts = async (beforeDate) => {
    try {
        const response = await axios.get(`${API_URL}/Report/expired-contracts`, {
            params: { beforeDate: beforeDate }
        });
        if (response.status === 200 || response.data?.success) {
            return { success: true, data: response.data?.data };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch expired contracts' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching expired contracts' };
    }   
};

export const getContractsByStudentId = async (studentId) => {
    try {
        const response = await axios.get(`${API_URL}/Report/student/${studentId}/contracts`);
        if (response.status === 200 && response.data?.success) {
            return { success: true, data: response.data?.data || [] };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch student contracts' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching student contracts' };
    }
};

export const getPriorityStudents = async () => {
    try {
        const response = await axios.get(`${API_URL}/Report/priority`);
        if (response.status === 200 && response.data?.success) {
            return { success: true, data: response.data?.data || [] };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch priority students' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching priority students' };
    }
};

export const getManagers = async () => {
    try {
        const response = await axios.get(`${API_URL}/Report/managers`);
        if (response.status === 200 && response.data?.success) {
            return { success: true, data: response.data?.data || [] };
        }
        return { success: false, message: response.data?.message || 'Failed to fetch managers' };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error fetching managers' };
    }
};

// ==================== EXPORT FUNCTIONS ====================

export const exportAvailableRooms = async () => {
    try {
        const response = await axios.get(`${API_URL}/Report/export/available-rooms`, {
            responseType: 'blob'
        });
        downloadFile(response.data, 'BaoCao_PhongTrong.xlsx');
        return { success: true };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error exporting available rooms' };
    }
};

export const exportExpiredContracts = async (beforeDate) => {
    try {
        const response = await axios.get(`${API_URL}/Report/export/expired-contracts`, {
            params: { beforeDate: beforeDate },
            responseType: 'blob'
        });
        downloadFile(response.data, 'BaoCao_HopDongHetHan.xlsx');
        return { success: true };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error exporting expired contracts' };
    }
};

export const exportStudentContracts = async (studentId) => {
  try {
    const response = await axios.get(`/Report/export-student-contracts/${studentId}`, {
      responseType: 'blob'
    });
    
    // Tạo file download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `HopDong_SinhVien_${studentId}_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return { success: true };
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, message: error.response?.data?.message || 'Xuất file thất bại' };
  }
};

export const exportPriorityStudents = async () => {
    try {
        const response = await axios.get(`${API_URL}/Report/export/priority-students`, {
            responseType: 'blob'
        });
        downloadFile(response.data, 'BaoCao_SinhVienUuTien.xlsx');
        return { success: true };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error exporting priority students' };
    }
};

export const exportRoomEquipment = async (roomId) => {
    try {
        const response = await axios.get(`${API_URL}/Report/export/room-equipment/${roomId}`, {
            responseType: 'blob'
        });
        downloadFile(response.data, `BaoCao_ThietBi_${roomId}.xlsx`);
        return { success: true };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error exporting room equipment' };
    }
};

export const exportManagers = async () => {
    try {
        const response = await axios.get(`${API_URL}/Report/export/managers`, {
            responseType: 'blob'
        });
        downloadFile(response.data, 'BaoCao_TruongPhong.xlsx');
        return { success: true };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error exporting managers' };
    }
};