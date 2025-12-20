import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BuildingOfficeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { forgotPassword } from '../../services/authApi';

// Import UI Components
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Hàm xử lý khi bấm nút Gửi
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Vui lòng nhập email!");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await forgotPassword({ email });

      if (result.success) {
        // Chuyển hướng sang trang nhập mã OTP reset password
        navigate('/auth/verify-reset-otp', { state: { email } });
      } else {
        setError(result.message || 'Không thể gửi mã OTP. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
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
        
        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 text-center">
            {error}
          </div>
        )}

        {/* Input Email (Dùng Component Input) */}
        <div>
          <Input 
            label="Email"
            type="email"
            placeholder="example@university.edu.vn"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            required
          />
          <p className="mt-2 text-xs text-gray-500">
            Nhập email đã đăng ký để nhận mã xác thực OTP
          </p>
        </div>

        {/* Nút Gửi (Dùng Component Button) */}
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
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