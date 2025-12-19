import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

// Import các UI Component
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select'; 
import Button from '../../components/ui/Button';

export default function Register() {
  const navigate = useNavigate();

  // 1. Khởi tạo State chứa dữ liệu Form
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    gender: '',
    cccd: '',
    issuePlace: '',
    address: '',
    phone: '',
    email: '',
    school: 'uit', // Giá trị mặc định
    priority: 'none',
    password: '',
    confirmPassword: ''
  });

  // 2. Hàm xử lý nhập liệu chung cho tất cả các ô
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Hàm xử lý Đăng ký
  const handleRegister = (e) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu khớp nhau
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    // Giả lập gọi API thành công
    console.log('Dữ liệu đăng ký:', formData);
    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    navigate('/student/registration');
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 my-8 animate-fade-in">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
          <BuildingOfficeIcon className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Đăng Ký Tài Khoản Sinh Viên</h1>
        <p className="text-gray-500 text-sm mt-2">Vui lòng điền đầy đủ thông tin để đăng ký</p>
      </div>

      {/* Form */}
      <form onSubmit={handleRegister} className="space-y-5">
        
        {/* Hàng 1: MSSV + Họ tên */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Input 
            label="Mã số sinh viên *" 
            name="studentId" 
            placeholder="SV2024001" 
            value={formData.studentId} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Họ và tên *" 
            name="fullName" 
            placeholder="Nguyễn Văn A" 
            value={formData.fullName} 
            onChange={handleChange} 
            required 
          />
          <Select 
            label="Giới tính *" 
            name="gender" 
            value={formData.gender} 
            onChange={handleChange}
          >
             <option value="male">Nam</option>
             <option value="female">Nữ</option>
          </Select>
        </div>

        {/* Hàng 2: CCCD + SĐT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Input 
            label="Số CCCD *" 
            name="cccd" 
            placeholder="001234567890" 
            value={formData.cccd} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Nơi cấp *" 
            name="issuePlace" 
            placeholder="Nơi cấp CCCD" 
            value={formData.issuePlace} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Số điện thoại *" 
            name="phone" 
            type="tel"
            placeholder="0912345678" 
            value={formData.phone} 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* Email */}
        <Input 
          label="Email *" 
          name="email" 
          type="email"
          placeholder="student@university.edu.vn" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />

        <Input 
          label="Địa chỉ *" 
          name="address" 
          type="text"
          placeholder="123 Đường ABC, Quận 1, TP.HCM" 
          value={formData.address} 
          onChange={handleChange} 
          required 
        />

        {/* Hàng 3: Trường + Ưu tiên (Dùng Component Select) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Select 
            label="Trường *" 
            name="school" 
            value={formData.school} 
            onChange={handleChange}
          >
             <option value="uit">Đại học Công nghệ Thông tin</option>
             <option value="bk">Đại học Bách Khoa</option>
             <option value="khtn">Đại học Khoa học Tự nhiên</option>
             <option value="nv">Đại học Nhân Văn</option>
          </Select>

          <Select 
            label="Đối tượng ưu tiên" 
            name="priority" 
            value={formData.priority} 
            onChange={handleChange}
          >
             <option value="none">Không có</option>
             <option value="lietsi">Con thương binh/liệt sĩ</option>
             <option value="ngheo">Hộ nghèo/Cận nghèo</option>
             <option value="khuyettat">Sinh viên khuyết tật</option>
          </Select>
        </div>

        {/* Hàng 4: Mật khẩu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input 
            label="Mật khẩu *" 
            name="password" 
            type="password"
            placeholder="Tối thiểu 8 ký tự" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Xác nhận mật khẩu *" 
            name="confirmPassword" 
            type="password"
            placeholder="Nhập lại mật khẩu" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* Nút Đăng ký */}
        <Button type="submit" className="w-full mt-4" size="lg">
          Đăng ký
        </Button>

        <p className="text-sm font-light text-gray-500 text-center">
          Đã có tài khoản? <Link to="/auth/login" className="font-medium text-primary hover:underline">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}