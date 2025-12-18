import { Link } from 'react-router-dom';
import { BuildingOfficeIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function Login() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      
      {/* Header: Logo & Title */}
      <div className="text-center mb-8">
        <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
          <BuildingOfficeIcon className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Hệ Thống Quản Lý Ký Túc Xá</h1>
        <p className="text-gray-500 text-sm mt-2">Đăng nhập để tiếp tục</p>
      </div>

      {/* Form */}
      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="email" 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary block transition-colors"
              placeholder="example@university.edu.vn"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
             <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
             <Link to="/auth/forgot-password" class="text-xs font-medium text-primary hover:underline">Quên mật khẩu?</Link>
          </div>
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

        <button type="submit" className="w-full text-white bg-primary hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all shadow-md shadow-blue-500/20 cursor-pointer">
          Đăng nhập
        </button>

        <p className="text-sm font-light text-gray-500 text-center">
          Chưa có tài khoản? <Link to="/auth/register" className="font-medium text-primary hover:underline">Đăng ký ngay</Link>
        </p>
      </form>

      {/* Demo Account Info (Như trong ảnh) */}
      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400 mb-2">Tài khoản demo:</p>
        <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">
           <p>Admin: <span className="font-mono text-gray-700">admin@dorm.vn / password</span></p>
           <p>Trưởng tòa: <span className="font-mono text-gray-700">manager@dorm.vn / password</span></p>
           <p>Sinh viên: <span className="font-mono text-gray-700">student@dorm.vn / password</span></p>
        </div>
      </div>
    </div>
  );
}