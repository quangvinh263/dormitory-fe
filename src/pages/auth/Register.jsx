import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { signUp } from '../../services/authApi';
import { getSchoolInfo, getPriorityInfo } from '../../services/publicInforApi';

// Import các UI Component
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select'; 
import Button from '../../components/ui/Button';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    gender: '',
    cccd: '',
    issuePlace: '',
    address: '',
    phone: '',
    email: '',
    school: '',
    priority: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [schools, setSchools] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [schoolResult, priorityResult] = await Promise.all([
          getSchoolInfo(),
          getPriorityInfo()
        ]);
        
        if (schoolResult.success) {
          setSchools(schoolResult.data);
          if (schoolResult.data.length > 0) {
            const firstSchoolId = schoolResult.data[0].schoolId || schoolResult.data[0].SchoolId;
            setFormData(prev => ({ ...prev, school: firstSchoolId }));
          }
        }

        if (priorityResult.success) {
          setPriorities(priorityResult.data);
          if (priorityResult.data.length > 0) {
            const firstPriorityId = priorityResult.data[0].priorityID || priorityResult.data[0].PriorityID;
            setFormData(prev => ({ ...prev, priority: firstPriorityId }));
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const registerData = {
        studentId: formData.studentId,
        fullName: formData.fullName,
        citizenId: formData.cccd,
        citizenIdIssuePlace: formData.issuePlace,
        phoneNumber: formData.phone,
        gender: formData.gender,
        email: formData.email,
        address: formData.address,
        schoolId: formData.school,
        priorityId: formData.priority,
        password: formData.password
      };

      const result = await signUp(registerData);
      console.log('Register Result:', result); // Debug log
      if (result.success) {
        navigate('/auth/verify-otp', { state: { email: formData.email } });
      } else {
        setError(result.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 my-8">
        <div className="text-center">
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

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
        
        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 text-center">
            {error}
          </div>
        )}

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
            required
          >
             <option value="">Chọn giới tính</option>
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

        {/* Hàng 3: Trường + Ưu tiên (Load từ API) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Select 
            label="Trường *" 
            name="school" 
            value={formData.school} 
            onChange={handleChange}
            required
          >
             <option value="">Chọn trường</option>
             {schools.map(school => {
               const schoolId = school.schoolId || school.SchoolId;
               const schoolName = school.schoolName || school.SchoolName;
               return (
                 <option key={schoolId} value={schoolId}>
                   {schoolName}
                 </option>
               );
             })}
          </Select>

          <Select 
            label="Đối tượng ưu tiên *" 
            name="priority" 
            value={formData.priority} 
            onChange={handleChange}
            required
          >
             <option value="">Chọn đối tượng ưu tiên</option>
             {priorities.map(priority => {
               const priorityId = priority.priorityID || priority.PriorityID;
               const priorityDesc = priority.priorityDescription || priority.PriorityDescription;
               return (
                 <option key={priorityId} value={priorityId}>
                   {priorityDesc}
                 </option>
               );
             })}
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
        <Button type="submit" className="w-full mt-4" size="lg" disabled={loading}>
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </Button>

        <p className="text-sm font-light text-gray-500 text-center">
          Đã có tài khoản? <Link to="/auth/login" className="font-medium text-primary hover:underline">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}