import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Header from '../components/shared/Header';
import MenuTabs from '../components/shared/MenuTabs';
import { ROLE_MENUS } from '../utils/menuConfig';
import { ROLES } from '../utils/constants';

export default function MainLayout() {

  const location = useLocation();

  // 1. CHỌN VAI TRÒ ĐỂ TEST (Đổi giá trị này để xem 3 màn hình khác nhau)
  // Các giá trị: ROLES.ADMIN | ROLES.MANAGER | ROLES.STUDENT
  let currentRole = ROLES.STUDENT; 
  if (location.pathname.startsWith('/admin')) {
    currentRole = ROLES.ADMIN;
  }
  else if (location.pathname.startsWith('/manager')) {
    currentRole = ROLES.MANAGER;
  }
  // 2. Dữ liệu giả lập (Sau này lấy từ API/Context)
  const MOCK_USERS = {
    [ROLES.ADMIN]:   { role: ROLES.ADMIN, name: 'Quản Trị Viên', code: 'ADMIN', email: 'admin@dorm.vn' },
    [ROLES.MANAGER]: { role: ROLES.MANAGER, name: 'Nguyễn Văn A', code: 'TT001', email: 'manager@dorm.vn' },
    [ROLES.STUDENT]: { role: ROLES.STUDENT, name: 'Trần Thị B', code: 'SV2024001', email: 'student@dorm.vn' },
  };

  const currentUser = MOCK_USERS[currentRole];
  const menus = ROLE_MENUS[currentRole] || [];

  const hideTabsPaths = ['/profile', '/student/registration', '/student/payment'];

  const shouldHideTabs = hideTabsPaths.some(path => location.pathname.includes(path));

  // Bảo vệ: Nếu không có user (chưa login) -> Đá về trang login
  if (!currentUser) {
     return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 flex flex-col">
      
      {/* 1. Header (Truyền user vào để nó tự biết hiển thị màu gì, tên gì) */}
      <Header user={currentUser} />

      {/* 2. Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Menu Tabs (Truyền danh sách menu tương ứng) */}
        {!shouldHideTabs && <MenuTabs menus={menus} />}

        {/* Nơi hiển thị các trang con (Dashboard, List,...) */}
        <div className="min-h-[500px] animate-fade-in-up">
           <Outlet />
        </div>

      </main>
      
      {/* 3. Footer */}
      <footer className="py-6 text-center text-xs text-gray-400 border-t border-gray-200 mt-auto bg-white">
        &copy; 2025 Dormitory Management System.
      </footer>
    </div>
  );
}