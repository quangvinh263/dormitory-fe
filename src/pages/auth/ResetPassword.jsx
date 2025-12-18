import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BuildingOfficeIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// Import UI Components
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ResetPassword() {
  const navigate = useNavigate();
  
  // State lưu mật khẩu
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Hàm xử lý đổi mật khẩu
  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Kiểm tra độ dài (Demo đơn giản)
    if (password.length < 8) {
      alert("Mật khẩu phải có ít nhất 8 ký tự!");
      return;
    }

    // 2. Kiểm tra khớp mật khẩu
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    // 3. Giả lập thành công
    console.log("Đổi mật khẩu thành công:", password);
    alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
    navigate('/auth/login');
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 animate-fade-in">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
          <BuildingOfficeIcon className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Đặt Lại Mật Khẩu</h1>
        <p className="text-gray-500 text-sm mt-2">Vui lòng thiết lập mật khẩu mới cho tài khoản</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Mật khẩu mới */}
        <Input 
          label="Mật khẩu mới"
          type="password"
          placeholder="••••••••"
          icon={<LockClosedIcon className="w-5 h-5"/>}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Xác nhận mật khẩu */}
        <Input 
          label="Xác nhận mật khẩu"
          type="password"
          placeholder="••••••••"
          icon={<CheckCircleIcon className="w-5 h-5"/>}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {/* Gợi ý mật khẩu an toàn (Giữ nguyên UI này vì nó đặc thù, không cần component hóa) */}
        <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700 space-y-1">
            <p className="font-bold">Yêu cầu mật khẩu:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-blue-600/80">
                <li>Tối thiểu 8 ký tự</li>
                <li>Bao gồm chữ hoa và chữ thường</li>
                <li>Có ít nhất 1 số hoặc ký tự đặc biệt</li>
            </ul>
        </div>

        {/* Nút Đổi mật khẩu */}
        <Button type="submit" className="w-full" size="lg">
          Đổi mật khẩu
        </Button>

        <p className="text-sm font-light text-gray-500 text-center">
           <Link to="/auth/login" className="font-medium text-primary hover:underline">Quay lại đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}