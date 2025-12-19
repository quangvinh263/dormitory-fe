import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// Import UI Components chung
import Section from '../../components/shared/Section';

// Import các Feature Components đã tách
import PersonalInfoSection from '../../components/features/student/PersonalInfoSection';
import RelativeListSection from '../../components/features/student/RelativeListSection';

// --- MOCK DATA ---
const MOCK_DATA = {
  fullName: 'Trần Thị B',
  studentId: 'SV2024001',
  gender: 'Nữ',
  email: 'student@dorm.vn',
  phone: '0901234567',
  cccd: '079203001234',
  issuePlace: 'Công an TP. Hà Nội',
  school: 'bk',
  priority: 'none',
  address: '123 Đường Giải Phóng, Hà Nội',
  relatives: [
    { id: 1, name: 'Trần Văn A', relation: 'Bố', job: 'Nông dân', phone: '0912345678', address: 'Hà Nội' },
    { id: 2, name: 'Nguyễn Thị C', relation: 'Mẹ', job: 'Giáo viên', phone: '0987654321', address: 'Hà Nội' }
  ]
};

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(MOCK_DATA);

  // --- LOGIC XỬ LÝ ---
  
  // 1. Xử lý sửa thông tin cá nhân
  const handleInfoChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. Xử lý sửa thông tin người thân
  const handleRelativeChange = (index, field, value) => {
    const newRelatives = [...formData.relatives];
    newRelatives[index][field] = value;
    setFormData(prev => ({ ...prev, relatives: newRelatives }));
  };

  // 3. Các hành động khác
  const addRelative = () => {
    const newRelative = { id: Date.now(), name: '', relation: '', job: '', phone: '', address: '' };
    setFormData(prev => ({ ...prev, relatives: [...prev.relatives, newRelative] }));
  };

  const removeRelative = (index) => {
    const newRelatives = formData.relatives.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, relatives: newRelatives }));
  };

  const handleSave = () => {
    console.log("Saving...", formData);
    alert("Cập nhật thành công!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(MOCK_DATA);
    setIsEditing(false);
  };

  // --- RENDER GIAO DIỆN ---
  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Header Link */}
      <div>
         <Link to="/student" className="inline-flex items-center text-base text-stone-800 hover:text-primary mb-2 pl-4">
           <ArrowLeftIcon className="w-4 h-4 mr-2"/> Quay lại 
         </Link>
      </div>

      {/* BLOCK 1: THÔNG TIN CÁ NHÂN */}
      <PersonalInfoSection 
        data={formData}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onCancel={handleCancel}
        onSave={handleSave}
        onChange={handleInfoChange}
      />

      {/* BLOCK 2: DANH SÁCH NGƯỜI THÂN */}
      <RelativeListSection 
        relatives={formData.relatives}
        isEditing={isEditing}
        onAdd={addRelative}
        onChange={handleRelativeChange}
        onRemove={removeRelative}
      />

      {/* BLOCK 3: LƯU Ý */}
      <Section className="bg-blue-50/50 border-blue-100">
         <h3 className="font-bold text-blue-800 text-sm mb-3">Lưu ý</h3>
         <ul className="list-disc pl-5 text-sm text-blue-700/80 space-y-2">
           <li>Các trường có dấu (*) là bắt buộc.</li>
           <li>Mã sinh viên và CCCD không thể chỉnh sửa sau khi đã xác thực.</li>
           <li>Vui lòng cập nhật số điện thoại người thân chính xác để nhà trường liên hệ khi cần thiết.</li>
           <li>Email phải đúng định dạng (ví dụ: example@email.com).</li>
           <li>Số điện thoại phải bắt đầu bằng số 0 và có 10 chữ số.</li>
           <li>Thay đổi sẽ có hiệu lực ngay sau khi lưu thành công.</li>
         </ul>
      </Section>
    </div>
  );
}