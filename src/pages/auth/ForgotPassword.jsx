import { Link } from 'react-router-dom';
import { BuildingOfficeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ForgotPassword() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      
      <div className="text-center mb-8">
        <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
          <BuildingOfficeIcon className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Quên Mật Khẩu</h1>
        <p className="text-gray-500 text-sm mt-2">Nhập email để nhận mã xác thực</p>
      </div>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="example@university.edu.vn"
          />
          <p className="mt-2 text-xs text-gray-500">Nhập email đã đăng ký để nhận mã xác thực OTP</p>
        </div>

        <button type="submit" className="w-full text-white bg-primary hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all shadow-md shadow-blue-500/20 cursor-pointer">
          Gửi mã OTP
        </button>

        <div className="text-center">
          <Link to="/auth/login" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
            <ArrowLeftIcon className="w-4 h-4 mr-1"/> Quay lại đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
}