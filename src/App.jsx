import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

//Import  Layouts
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

// Import Pages - Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyOtp from './pages/auth/VerifyOtp';
import VerifyResetOtp from './pages/auth/VerifyResetOtp';

// Import Pages - Admin
import AdminDashboard from './pages/admin/Dashboard';

// Import Pages - Manager
import ManagerDashboard from './pages/manager/Dashboard';

// Import Pages - Student
import StudentDashboard from './pages/student/Dashboard';
import Profile from './pages/student/Profile';
import StudentContract from './pages/student/Contract';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- NHÓM AUTH (Login/Register) --- */}
        <Route path="/auth" element={<AuthLayout />}>
           <Route index element={<Navigate to="/auth/login" replace />} />
           <Route path="login" element={<Login />} />
           <Route path="register" element={<Register />} />
           <Route path="forgot-password" element={<ForgotPassword />} />
           <Route path="verify-reset-otp" element={<VerifyResetOtp />} />
           <Route path="verify-otp" element={<VerifyOtp />} />
           <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<MainLayout />}>
          
          {/* Mặc định vào trang login nếu gõ domain gốc */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* --- ADMIN ROUTES --- */}
          <Route path="/admin">
            <Route index element={<AdminDashboard />} />
            <Route path="managers" element={<div>Trang Quản lý Trưởng tòa</div>} />
            <Route path="reports" element={<div>Trang Báo cáo thống kê</div>} />
            <Route path="settings" element={<div>Trang Cấu hình</div>} />
          </Route>
          
          {/* --- MANAGER ROUTES (Trưởng tòa) --- */}
          <Route path="/manager">
            <Route index element={<ManagerDashboard />} />
            <Route path="requests" element={<div>Trang Đơn đăng ký</div>} />
            <Route path="rooms" element={<div>Trang Quản lý phòng</div>} />
            {/* Các route khác sẽ thêm sau */}
          </Route>
          
          {/* --- STUDENT ROUTES (Sinh viên) --- */}
          <Route path="/student">
             <Route index element={<StudentDashboard />} />
             <Route path="profile" element={<Profile />} />
             <Route path="contract" element={<StudentContract />} />
             <Route path="bills" element={<div>Trang Hóa đơn</div>} />
          </Route>

        </Route>

        {/* Trang 404 Not Found */}
        <Route path="*" element={<div className="text-center mt-20 text-gray-500">404 - Trang không tồn tại</div>} />

      </Routes>
    </BrowserRouter>
  );
}