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
import ManagerManagement from './pages/admin/ManagerManagement';
import BuildingManagement from './pages/admin/BuildingManagement';
import Report from './pages/admin/Report';

// Import Pages - Manager
import ManagerDashboard from './pages/manager/Dashboard';
import UtilityManagement from './pages/manager/Utility';
import RoomManagement from './pages/manager/Room';
import MaintenanceDashboard from './pages/manager/Maintenance';
import ViolationDashboard from './pages/manager/Violation';
import ContractManagement from './pages/manager/Contract';
import BillManagement from './pages/manager/Bill';

// Import Pages - Student
import StudentDashboard from './pages/student/Dashboard';
import Profile from './pages/student/Profile';
import StudentContract from './pages/student/Contract';
import Registration from './pages/student/Registration';
import Payment from './pages/student/Payment';
import RenewContract from './pages/student/RenewContract';
import Maintenance from './pages/student/Maintenance';
import Utility from './pages/student/Utility';
import PaymentSuccess from './pages/student/UbilityPaymentSuccess';
import Insurance from './pages/student/Insurance';
import Violations from './pages/student/Violations';
import UtilityPayment from './pages/student/UtilityPayment';

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
            <Route path="managers" element={<ManagerManagement />} />
            <Route path="buildings" element={<BuildingManagement />} />
            <Route path="reports" element={<Report />} />
            <Route path="settings" element={<div>Trang Cấu hình</div>} />
          </Route>
          
          {/* --- MANAGER ROUTES (Trưởng tòa) --- */}
          <Route path="/manager">
            <Route index element={<ManagerDashboard />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route path="utilities" element={<UtilityManagement />} />
            <Route path="maintenance" element={<MaintenanceDashboard />} />
            <Route path="violations" element={<ViolationDashboard />} />
            <Route path="contracts" element={<ContractManagement />} />
            <Route path="bills" element={<BillManagement />} />


            {/* Các route khác sẽ thêm sau */}
          </Route>
          
          {/* --- STUDENT ROUTES (Sinh viên) --- */}
          <Route path="/student">
             <Route index element={<StudentDashboard />} />
             <Route path="profile" element={<Profile />} />
             <Route path="contract" element={<StudentContract />} />
             <Route path="extension" element={<RenewContract />} />
             <Route path="registration" element={<Registration />} />
             <Route path="payment" element={<Payment />} />
             <Route path="maintenance" element={<Maintenance />} />
             <Route path="utility" element={<Utility />} />
             <Route path="payment-success" element={<PaymentSuccess />} />
             <Route path="insurance" element={<Insurance />} />
             <Route path="violations" element={<Violations />} />
             <Route path="utility/payment" element={<UtilityPayment />} />
          </Route>

        </Route>

        {/* Trang 404 Not Found */}
        <Route path="*" element={<div className="text-center mt-20 text-gray-500">404 - Trang không tồn tại</div>} />

      </Routes>
    </BrowserRouter>
  );
}