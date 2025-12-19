import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BuildingOfficeIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

// Import các UI Component đã tách
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';


export default function Login() {
  const navigate = useNavigate();
  
  // 1. Quản lý dữ liệu form
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Hàm xử lý khi nhập liệu
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Xóa lỗi khi người dùng gõ lại
  };

  // 2. Hàm xử lý đăng nhập (Giả lập)
  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Logic Fake Login đơn giản để test chuyển trang
    if (email === 'admin@dorm.vn' && password === 'password') {
       navigate('/admin'); // Chuyển sang Dashboard Admin
    } else if (email === 'manager@dorm.vn' && password === 'password') {
       navigate('/manager'); // Chuyển sang Dashboard Manager
    } else if (email === 'student@dorm.vn' && password === 'password') {
       navigate('/student'); // Chuyển sang Dashboard Student
    } else {
       setError('Email hoặc mật khẩu không chính xác (Xem gợi ý bên dưới)');
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 animate-fade-in">
      
      {/* Header: Logo & Title */}
      <div className="text-center mb-8">
        <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
          <BuildingOfficeIcon className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Hệ Thống Quản Lý Ký Túc Xá</h1>
        <p className="text-gray-500 text-sm mt-2">Đăng nhập để tiếp tục</p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        
        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 text-center">
            {error}
          </div>
        )}

        {/* INPUT EMAIL (Dùng Component Input) */}
        <Input 
          label="Email"
          type="email"
          name="email"
          placeholder="example@university.edu.vn"
          icon={<EnvelopeIcon className="w-5 h-5"/>}
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* INPUT PASSWORD */}
        <div>
          {/* Label & Link Quên mật khẩu nằm chung 1 dòng nên ta viết tay phần label này */}
          <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <Link to="/auth/forgot-password" class="text-xs font-medium text-primary hover:underline">
                Quên mật khẩu?
              </Link>
          </div>
          {/* Gọi Component Input nhưng không truyền label (vì đã viết ở trên) */}
          <Input 
            type="password"
            name="password"
            placeholder="••••••••"
            icon={<LockClosedIcon className="w-5 h-5"/>}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* BUTTON LOGIN (Dùng Component Button) */}
        <Button type="submit" className="w-full" size="lg">
          Đăng nhập
        </Button>

        <p className="text-sm font-light text-gray-500 text-center">
          Chưa có tài khoản? <Link to="/auth/register" className="font-medium text-primary hover:underline">Đăng ký ngay</Link>
        </p>
      </form>

      {/* Demo Account Info */}
      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400 mb-2">Tài khoản demo:</p>
        <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">
           <p>Admin: <span className="font-mono text-gray-700 font-bold">admin@dorm.vn / password</span></p>
           <p>Trưởng tòa: <span className="font-mono text-gray-700 font-bold">manager@dorm.vn / password</span></p>
           <p>Sinh viên: <span className="font-mono text-gray-700 font-bold">student@dorm.vn / password</span></p>
        </div>
      </div>
    </div>
  );
}