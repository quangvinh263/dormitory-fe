import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const getStudentInfo = async (accountId) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.get(`${API_URL}/Student`, 
      { params: { accountId } }
    );
    
    console.log('Student API Response:', response.data);
    
    if (response.status === 200 && response.data) {
        return { 
          success: true, 
          data: response.data.student // Lấy student từ response
        };
    }
    return { success: false, message: response.data?.message || 'Failed to fetch student info' };
  } catch (error) {
    console.error('Student API Error:', error);
    console.error('Error details:', error.response?.data);
    return { success: false, message: error.response?.data?.message || 'Error fetching student info' };
  }
};