import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "./tokenApi";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
});

// 🧠 Hàm kiểm tra token hết hạn (Giữ nguyên)
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
}

// ⭐ HÀM MỚI: Logic lấy token hợp lệ (Dùng chung cho Axios và SignalR)
export const getValidAccessToken = async () => {
  let token = localStorage.getItem("accessToken"); // Hoặc "accessToken" tùy key bạn lưu
  const refreshToken = localStorage.getItem("refreshToken");

  // Nếu không có token nào -> chịu thua
  if (!token) return null;

  // Nếu token chưa hết hạn -> dùng luôn
  if (!isTokenExpired(token)) {
    return token;
  }

  // Nếu hết hạn mà có refreshToken -> Thử refresh
  if (refreshToken) {
    try {
      console.log("🔄 Token expired. Refreshing...");
      const result = await refreshAccessToken(refreshToken);
      
      if (result?.success && result.token) {
        // Lưu token mới
        localStorage.setItem("token", result.token);
        return result.token;
      }
    } catch (error) {
      console.error("Refresh token failed", error);
    }
  }

  // Nếu refresh thất bại hoặc không có refreshToken -> Đăng xuất
  console.log("Session expired. Logging out...");
  localStorage.clear();
  window.location.href = "/signin";
  return null;
};

// 🛠️ Sửa lại Interceptor để dùng hàm getValidAccessToken cho gọn
api.interceptors.request.use(async (config) => {
  const token = await getValidAccessToken(); // Gọi hàm chung

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor response (Giữ nguyên)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.clear();
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;