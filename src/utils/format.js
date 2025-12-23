export const getInitials = (name) => {
  if (!name) return 'U';
  const words = name.trim().split(' ');
  const last = words[words.length - 1][0];
  const first = words.length > 1 ? words[words.length - 2][0] : '';
  return (first + last).toUpperCase();
};  

export const formatTime = (dateString) => {
  if (!dateString) return "";
  
  // Parse UTC time và convert sang giờ Việt Nam (UTC+7)
  const date = new Date(dateString);
  
  // Option 1: Dùng toLocaleString với timezone
  return date.toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  

  return date.toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDate = (dateString) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);

  return date.toLocaleDateString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatTimeOnly = (dateString) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  
  return date.toLocaleTimeString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return "";

  // 1. Chuyển đổi input thành đối tượng Date
  // Lưu ý: Nếu chuỗi từ Backend thiếu 'Z' ở cuối, ta mặc định coi nó là UTC để tính toán cho đúng
  const dateStr = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
  const date = new Date(dateStr);

  const now = new Date();
  
  // Tính khoảng cách (milliseconds)
  const diffMs = now - date; 
  
  // Chuyển đổi sang các đơn vị
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  // --- LOGIC HIỂN THỊ ---

  // Trường hợp thời gian tương lai (do lệch đồng hồ vài giây)
  if (diffSeconds < 0) return "Vừa xong";

  if (diffSeconds < 60) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;

  // Quá 7 ngày → hiển thị ngày tháng theo giờ VN (dùng lại hàm formatDateTime của bạn)
  return formatDateTime(dateString);
};