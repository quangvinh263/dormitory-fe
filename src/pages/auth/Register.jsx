import { Link } from 'react-router-dom';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function Register() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 my-8">
      
      <div className="text-center mb-8">
        <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
          <BuildingOfficeIcon className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Đăng Ký Tài Khoản Sinh Viên</h1>
        <p className="text-gray-500 text-sm mt-2">Vui lòng điền đầy đủ thông tin để đăng ký</p>
      </div>

      <form className="space-y-5">
        {/* Hàng 1: MSSV + Họ tên */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã số sinh viên *</label>
            <input type="text" placeholder="SV2024001" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
            <input type="text" placeholder="Nguyễn Văn A" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>
        </div>

        {/* Hàng 2: CCCD + SĐT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số CCCD *</label>
            <input type="text" placeholder="001234567890" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
            <input type="tel" placeholder="0912345678" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>
        </div>

        {/* Email */}
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
           <input type="email" placeholder="student@university.edu.vn" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
        </div>

        {/* Hàng 3: Trường + Ưu tiên */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trường *</label>
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
               <option>Đại học Công nghệ Thông tin</option>
               <option>Đại học Bách Khoa</option>
               <option>Đại học Khoa học Tự nhiên</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đối tượng ưu tiên</label>
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
               <option>Không có</option>
               <option>Con thương binh/liệt sĩ</option>
               <option>Hộ nghèo/Cận nghèo</option>
               <option>Sinh viên khuyết tật</option>
            </select>
          </div>
        </div>

        {/* Hàng 4: Mật khẩu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
            <input type="password" placeholder="Tối thiểu 8 ký tự" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu *</label>
            <input type="password" placeholder="Nhập lại mật khẩu" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>
        </div>

        <button type="submit" className="w-full mt-4 text-white bg-primary hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all shadow-md shadow-blue-500/20 cursor-pointer">
          Đăng ký
        </button>

        <p className="text-sm font-light text-gray-500 text-center">
          Đã có tài khoản? <Link to="/auth/login" className="font-medium text-primary hover:underline">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}