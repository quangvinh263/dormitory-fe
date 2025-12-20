import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BuildingOfficeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { verifyResetToken, resendOtpResetPassword } from '../../services/authApi';

// Import UI Component
import Button from '../../components/ui/Button';

export default function VerifyResetOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  // State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate('/auth/forgot-password');
    }
  }, [email, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError('');

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').slice(0, 6).split('');
    if (data.length === 6 && data.every(char => !isNaN(char))) {
      setOtp(data);
      inputRefs.current[5].focus();
    }
  };

  const handleResendOtp = async () => {
    try {
      const result = await resendOtpResetPassword(email);
      if (result.success) {
        setTimer(60);
        setError('');
        alert(result.message || 'OTP đã được gửi lại!');
      } else {
        setError(result.message || 'Gửi lại OTP thất bại');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi gửi lại OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length < 6) {
      setError("Vui lòng nhập đủ 6 số OTP");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await verifyResetToken({
        email: email,
        otp: otpCode
      });

      if (result.success) {
        // Truyền cả email và OTP token sang ResetPassword
        navigate('/auth/reset-password', { 
          state: { 
            email,
            otpToken: otpCode 
          } 
        });
      } else {
        setError(result.message || 'Mã OTP không chính xác');
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 text-center animate-fade-in">
      
      {/* Logo & Tiêu đề */}
      <div className="mb-8">
        <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
          <BuildingOfficeIcon className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Xác Thực OTP Reset Password</h1>
        <p className="text-gray-500 text-sm mt-2">
          Mã OTP đã được gửi đến <span className="font-medium text-gray-700">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Hiển thị lỗi */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 text-center">
            {error}
          </div>
        )}

        {/* Khu vực nhập OTP */}
        <div className="text-left">
          <label className="block text-sm font-bold text-gray-700 mb-2">Mã OTP</label>
          
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-10 h-12 md:w-12 md:h-14 border border-gray-300 rounded-lg text-center text-xl font-bold text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all bg-gray-50"
              />
            ))}
          </div>
        </div>

        {/* Timer đếm ngược */}
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">Nhập mã OTP 6 số đã được gửi đến email của bạn</p>
          <p className="text-sm font-medium text-gray-500">
            {timer > 0 ? (
              <>Gửi lại mã sau <span className="text-primary">{timer}s</span></>
            ) : (
              <span 
                onClick={handleResendOtp} 
                className="text-primary cursor-pointer hover:underline"
              >
                Gửi lại mã ngay
              </span>
            )}
          </p>
        </div>

        {/* Nút Xác thực */}
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Đang xác thực...' : 'Xác thực'}
        </Button>

        {/* Quay lại */}
        <div>
          <Link to="/auth/forgot-password" className="inline-flex items-center text-sm font-medium text-primary hover:underline cursor-pointer">
            <ArrowLeftIcon className="w-4 h-4 mr-1"/> Quay lại
          </Link>
        </div>
      </form>
    </div>
  );
}