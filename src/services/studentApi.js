import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const getStudentInfo = async (accountId) => {
  try {
    
    const response = await axios.get(`${API_URL}/Student`, 
      { params: { accountId } }
    );
    
    console.log('Student API Response:', response.data);
    
    if (response.status === 200 && response.data) {
        return { 
          success: true, 
          data: response.data.student
        };
    }
    return { success: false, message: response.data?.message || 'Failed to fetch student info' };
  } catch (error) {
    console.error('Student API Error:', error);
    console.error('Error details:', error.response?.data);
    return { success: false, message: error.response?.data?.message || 'Error fetching student info' };
  }
};

export const updateStudentInfo = async (data) => {
  try {
    const requestBody = {
      studentID: data.studentId,
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      schoolID: data.schoolId,
      priorityID: data.priorityId || null,
      citizenIDIssuePlace: data.citizenIDIssuePlace
    };

    console.log('Update Student Request:', requestBody);

    const response = await axios.put(`${API_URL}/Student/update-info`, requestBody);
    
    console.log('Update Student Response:', response.data);
    
    if (response.status === 200 || response.status === 204) {
      return { 
        success: true, 
        message: response.data?.message || 'Cập nhật thông tin thành công'
      };
    }
    return { success: false, message: response.data?.message || 'Failed to update student info' };
  } catch (error) {
    console.error('Update Student API Error:', error);
    console.error('Error details:', error.response?.data);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Error updating student info' 
    };
  }
};

export const createRelative = async (relativeData, studentId) => {
  try {
    const requestBody = {
      fullName: relativeData.fullName,
      relationship: relativeData.relationship,
      phoneNumber: relativeData.phoneNumber,
      address: relativeData.address,
      occupation: relativeData.occupation,
      studentID: studentId
    };

    console.log('Create Relative Request:', requestBody);

    const response = await axios.post(`${API_URL}/Student/create-relative`, requestBody);
    
    console.log('Create Relative Response:', response.data);
    
    if (response.status === 200 || response.status === 201) {
      return { 
        success: true, 
        message: 'Thêm người thân thành công',
        data: response.data 
      };
    }
    return { success: false, message: response.data?.message || 'Failed to create relative' };
  } catch (error) {
    console.error('Create Relative API Error:', error);
    console.error('Error details:', error.response?.data);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Error creating relative' 
    };
  }
};

export const updateRelative = async (relativeData) => {
  try {
    const requestBody = {
      relativeID: relativeData.relativeID || relativeData.id,
      fullName: relativeData.fullName,
      relationship: relativeData.relationship,
      phoneNumber: relativeData.phoneNumber,
      address: relativeData.address,
      occupation: relativeData.occupation
    };

    console.log('Update Relative Request:', requestBody);

    const response = await axios.post(`${API_URL}/Student/update-relative`, requestBody);
    
    console.log('Update Relative Response:', response.data);
    
    if (response.status === 200 || response.status === 204) {
      return { 
        success: true, 
        message: 'Cập nhật người thân thành công'
      };
    }
    return { success: false, message: response.data?.message || 'Failed to update relative' };
  } catch (error) {
    console.error('Update Relative API Error:', error);
    console.error('Error details:', error.response?.data);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Error updating relative' 
    };
  }
};

export const deleteRelative = async (relativeId) => {
  try {
    console.log('Delete Relative ID:', relativeId);

    const response = await axios.delete(`${API_URL}/Student/delete-relative/${relativeId}`);
    
    console.log('Delete Relative Response:', response.data);
    
    if (response.status === 200 || response.status === 204) {
      return { 
        success: true, 
        message: response.data?.message || 'Xóa người thân thành công'
      };
    }
    return { success: false, message: response.data?.message || 'Failed to delete relative' };
  } catch (error) {
    console.error('Delete Relative API Error:', error);
    console.error('Error details:', error.response?.data);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Error deleting relative' 
    };
  }
};