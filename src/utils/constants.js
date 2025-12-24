// 1. Định nghĩa danh sách Role 
export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  STUDENT: 'Student',
};

// 2. Định nghĩa cấu hình giao diện chung (Màu sắc, Tiêu đề)
export const ROLE_THEME = {
  [ROLES.ADMIN]: {
    colorClass: 'bg-blue-600',
    title: 'Quản Trị Hệ Thống',
  },
  [ROLES.MANAGER]: {
    colorClass: 'bg-green-600',
    title: 'Quản Lý Tòa Nhà',
  },
  [ROLES.STUDENT]: {
    colorClass: 'bg-purple-600',
    title: 'Ký Túc Xá Sinh Viên',
  },
};