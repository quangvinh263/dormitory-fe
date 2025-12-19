import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BuildingOfficeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

// Import UI Component
import Button from '../../components/ui/Button';

export default function VerifyOtp() {
  const navigate = useNavigate();
  
  // 1. State quản lý 6 ô OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  // 2. State quản lý thời gian đếm ngược (57 giây)
  const [timer, setTimer] = useState(57);
  
  // 3. Ref để điều khiển focus của các ô input
  const inputRefs = useRef([]);

  // Hàm đếm ngược thời gian
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Hàm xử lý khi nhập số
  const handleChange = (index, e) => {
    const value = e.target.value;

    // Chỉ cho phép nhập số
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Lấy ký tự cuối cùng vừa nhập
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Logic: Nếu nhập xong thì tự focus sang ô tiếp theo
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Hàm xử lý nút Backspace (Xóa lùi)
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      // Nếu ô hiện tại rỗng và nhấn xóa -> lùi về ô trước
      inputRefs.current[index - 1].focus();
    }
  };

  // Hàm xử lý Paste (Copy cả chuỗi 6 số dán vào)
  const handlePaste = (e) => {
      e.preventDefault();
      const data = e.clipboardData.getData('text').slice(0, 6).split('');
      if (data.length === 6 && data.every(char => !isNaN(char))) {
          setOtp(data);
          // Focus vào ô cuối
          inputRefs.current[5].focus();
      }
  };

  // Hàm Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length < 6) {
        alert("Vui lòng nhập đủ 6 số OTP");
        return;
    }

    console.log("Mã OTP:", otpCode);
    // Chuyển sang trang đặt lại mật khẩu
    navigate('/auth/reset-password');
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 text-center animate-fade-in">
      
      {/* Logo & Tiêu đề */}
      <div className="mb-8">
        <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
          <BuildingOfficeIcon className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Xác Thực OTP</h1>
        <p className="text-gray-500 text-sm mt-2">
          Mã OTP đã được gửi đến <span className="font-medium text-gray-700">admin@dorm.vn</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Khu vực nhập OTP */}
        <div className="text-left">
             <label className="block text-sm font-bold text-gray-700 mb-2">Mã OTP</label>
             
             <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)} // Gán ref
                        type="text"
                        maxLength="1" // Chỉ cho nhập 1 ký tự
                        value={digit}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste} // Hỗ trợ dán
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
                        onClick={() => setTimer(60)} 
                        className="text-primary cursor-pointer hover:underline"
                    >
                        Gửi lại mã ngay
                    </span>
                )}
            </p>
        </div>

        {/* Nút Xác thực (Dùng Button Component) */}
        <Button type="submit" className="w-full" size="lg">
          Xác thực
        </Button>

        {/* Quay lại */}
        <div>
          <Link to="/auth/forgot-password" class="inline-flex items-center text-sm font-medium text-primary hover:underline cursor-pointer">
            <ArrowLeftIcon className="w-4 h-4 mr-1"/> Quay lại
          </Link>
        </div>
      </form>
    </div>
  );
}