import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyOtp from './pages/auth/VerifyOtp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- NHÓM AUTH (Login/Register) --- */}
        <Route path="/auth" element={<AuthLayout />}>
           <Route path="login" element={<Login />} />
           <Route path="register" element={<Register />} />
           <Route path="forgot-password" element={<ForgotPassword />} />
           <Route path="verify-otp" element={<VerifyOtp />} />
           <Route path="reset-password" element={<ResetPassword />} />
           
           {/* Nếu người dùng gõ /auth trơ trọi -> Chuyển về login */}
           <Route index element={<Navigate to="/auth/login" replace />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}