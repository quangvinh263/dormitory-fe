import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon, EnvelopeIcon, PhoneIcon, IdentificationIcon, 
  MapPinIcon, AcademicCapIcon, ArrowLeftIcon, PlusIcon 
} from '@heroicons/react/24/outline';

// Import UI Components chung
import Section from '../../components/shared/Section';
import Button from   '../../components/ui/Button';

// Import Components tách riêng cho tính năng Profile
import ProfileField from '../../components/features/student/ProfileField';
import RelativeCard from '../../components/features/student/RelativeCard';

// --- MOCK DATA ---
const MOCK_DATA = {
  fullName: 'Trần Thị B',
  studentId: 'SV2024001',
  email: 'student@dorm.vn',
  phone: '0901234567',
  cccd: '079203001234',
  cccdPlace: 'Công an TP. Hà Nội',
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

  // Logic xử lý (Giữ nguyên như cũ)
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRelativeChange = (index, field, value) => {
    const newRelatives = [...formData.relatives];
    newRelatives[index][field] = value;
    setFormData(prev => ({ ...prev, relatives: newRelatives }));
  };

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

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
         <Link to="/student" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-2">
           <ArrowLeftIcon className="w-4 h-4 mr-1"/> Quay lại
         </Link>
         <h1 className="text-2xl font-bold text-gray-900">Thông Tin Cá Nhân</h1>
         <p className="text-gray-500 text-sm">Quản lý và cập nhật thông tin hồ sơ của bạn</p>
      </div>

      {/* --- PHẦN 1: THÔNG TIN CÁ NHÂN --- */}
      <Section className="relative">
        {!isEditing && (
           <Button className="absolute top-6 right-6" size="sm" variant="primary" onClick={() => setIsEditing(true)}>
             Chỉnh sửa
           </Button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
           <ProfileField label="Họ và tên *" icon={<UserIcon/>} value={formData.fullName} isEditing={isEditing} onChange={(v) => handleChange('fullName', v)} disabled />
           <ProfileField label="Mã sinh viên" icon={<IdentificationIcon/>} value={formData.studentId} isEditing={isEditing} disabled />
           <ProfileField label="Email *" icon={<EnvelopeIcon/>} value={formData.email} isEditing={isEditing} disabled />
           <ProfileField label="Số điện thoại *" icon={<PhoneIcon/>} value={formData.phone} isEditing={isEditing} onChange={(v) => handleChange('phone', v)} />
           <ProfileField label="CCCD/CMND *" icon={<IdentificationIcon/>} value={formData.cccd} isEditing={isEditing} disabled />
           <ProfileField label="Nơi cấp CCCD" icon={<MapPinIcon/>} value={formData.cccdPlace} isEditing={isEditing} onChange={(v) => handleChange('cccdPlace', v)} />

           <ProfileField 
              type="select" label="Trường học" icon={<AcademicCapIcon/>} 
              value={formData.school} isEditing={isEditing} 
              onChange={(v) => handleChange('school', v)}
              options={[
                { value: 'uit', label: 'ĐH Công nghệ Thông tin' },
                { value: 'bk', label: 'ĐH Bách Khoa' },
                { value: 'khtn', label: 'ĐH Khoa học Tự nhiên' }
              ]}
           />

           <ProfileField 
              type="select" label="Đối tượng ưu tiên" icon={<UserIcon/>} 
              value={formData.priority} isEditing={isEditing} 
              onChange={(v) => handleChange('priority', v)}
              options={[
                { value: 'none', label: 'Không có' },
                { value: 'lietsi', label: 'Con thương binh/liệt sĩ' },
                { value: 'ngheo', label: 'Hộ nghèo/Cận nghèo' }
              ]}
           />

           <div className="md:col-span-2">
              <ProfileField label="Địa chỉ hiện tại" icon={<MapPinIcon/>} value={formData.address} isEditing={isEditing} onChange={(v) => handleChange('address', v)} />
           </div>
        </div>

        {isEditing && (
           <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
              <Button onClick={handleSave}>Lưu thay đổi</Button>
              <Button variant="white" onClick={handleCancel}>Hủy bỏ</Button>
           </div>
        )}
      </Section>

      {/* --- PHẦN 2: NGƯỜI THÂN --- */}
      <Section>
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Thông Tin Người Thân</h2>
            {isEditing && (
               <Button size="sm" variant="success" icon={<PlusIcon className="w-4 h-4"/>} onClick={addRelative}>
                 Thêm người thân
               </Button>
            )}
         </div>

         <div className="space-y-4">
            {formData.relatives.map((rel, index) => (
               <RelativeCard 
                  key={rel.id} 
                  index={index} 
                  data={rel} 
                  isEditing={isEditing} 
                  onChange={handleRelativeChange}
                  onRemove={() => removeRelative(index)}
               />
            ))}
            {formData.relatives.length === 0 && (
              <p className="text-gray-500 italic text-center">Chưa có thông tin người thân.</p>
            )}
         </div>
      </Section>
    </div>
  );
}