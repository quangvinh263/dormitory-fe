import { Link } from 'react-router-dom';
import { BuildingOfficeIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function ResetPassword() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      
      <div className="text-center mb-8">
        <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
          <BuildingOfficeIcon className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Đặt Lại Mật Khẩu</h1>
        <p className="text-gray-500 text-sm mt-2">Vui lòng thiết lập mật khẩu mới cho tài khoản</p>
      </div>

      <form className="space-y-5">
        
        {/* Mật khẩu mới */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="password" 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary block transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Xác nhận mật khẩu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CheckCircleIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="password" 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary block transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Gợi ý mật khẩu an toàn */}
        <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700 space-y-1">
            <p className="font-bold">Yêu cầu mật khẩu:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-blue-600/80">
                <li>Tối thiểu 8 ký tự</li>
                <li>Bao gồm chữ hoa và chữ thường</li>
                <li>Có ít nhất 1 số hoặc ký tự đặc biệt</li>
            </ul>
        </div>

        <button type="submit" className="w-full text-white bg-primary hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all shadow-md shadow-blue-500/20 cursor-pointer">
          Đổi mật khẩu
        </button>

        <p className="text-sm font-light text-gray-500 text-center">
           <Link to="/auth/login" className="font-medium text-primary hover:underline">Quay lại đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}