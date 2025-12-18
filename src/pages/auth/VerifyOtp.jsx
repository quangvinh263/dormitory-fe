import { Link } from 'react-router-dom';
import { BuildingOfficeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function VerifyOtp() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 text-center">
      
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

      <form className="space-y-6">
        
        {/* Label */}
        <div className="text-left">
             <label className="block text-sm font-bold text-gray-700 mb-2">Mã OTP</label>
             
             {/* 6 Ô nhập OTP */}
             <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength="1"
                        className="w-10 h-12 md:w-12 md:h-14 border border-gray-300 rounded-lg text-center text-xl font-bold text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all bg-gray-50"
                    />
                ))}
             </div>
        </div>

        {/* Text phụ & Timer */}
        <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">Nhập mã OTP 6 số đã được gửi đến email của bạn</p>
            <p className="text-sm font-medium text-gray-500">
                Gửi lại mã sau <span className="text-primary">57s</span>
            </p>
        </div>

        {/* Nút bấm */}
        <button type="submit" className="w-full text-white bg-primary hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all shadow-md shadow-blue-500/20 cursor-pointer">
          Xác thực
        </button>

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