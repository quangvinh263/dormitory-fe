import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BuildingOfficeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

// Import UI Components
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  // Hàm xử lý khi bấm nút Gửi
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Giả lập logic gửi OTP
    if (!email) {
      alert("Vui lòng nhập email!");
      return;
    }

    console.log(`Đang gửi OTP tới: ${email}`);
    // Chuyển hướng sang trang nhập mã OTP
    navigate('/auth/verify-otp');
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 animate-fade-in">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
          <BuildingOfficeIcon className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Quên Mật Khẩu</h1>
        <p className="text-gray-500 text-sm mt-2">Nhập email để nhận mã xác thực</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Input Email (Dùng Component Input) */}
        <div>
          <Input 
            label="Email"
            type="email"
            placeholder="example@university.edu.vn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="mt-2 text-xs text-gray-500">
            Nhập email đã đăng ký để nhận mã xác thực OTP
          </p>
        </div>

        {/* Nút Gửi (Dùng Component Button) */}
        <Button type="submit" className="w-full" size="lg">
          Gửi mã OTP
        </Button>

        {/* Link quay lại */}
        <div className="text-center">
          <Link to="/auth/login" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
            <ArrowLeftIcon className="w-4 h-4 mr-1"/> Quay lại đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
}