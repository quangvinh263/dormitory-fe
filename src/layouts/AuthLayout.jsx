import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    // Nền xanh nhạt bao phủ toàn màn hình
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 font-sans">
      <Outlet /> {/* Nơi hiển thị Login/Register/Forgot nằm ở giữa */}
    </div>
  );
}