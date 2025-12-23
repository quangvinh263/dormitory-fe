import { 
  UserIcon, EnvelopeIcon, PhoneIcon, IdentificationIcon, 
  MapPinIcon, AcademicCapIcon 
} from '@heroicons/react/24/outline';
import { BsGenderAmbiguous } from "react-icons/bs";

import Section from '../../shared/Section';
import Button from '../../ui/Button';
import ProfileField from './ProfileField'; 

export default function PersonalInfoSection({ 
  data, 
  isEditing, 
  onEdit, 
  onCancel, 
  onSave, 
  onChange,
  schools = [],
  priorities = [],
  loadingOptions = false
}) {
  // Tạo options từ schools
  const schoolOptions = [
    { value: '', label: 'Chọn trường' },
    ...schools.map(school => {
      const schoolId = school.schoolId || school.SchoolId;
      const schoolName = school.schoolName || school.SchoolName;
      return {
        value: String(schoolId),
        label: schoolName
      };
    })
  ];

  // Tạo options từ priorities
  const priorityOptions = [
    { value: '', label: 'Không có' },
    ...priorities.map(priority => {
      const priorityId = priority.priorityID || priority.PriorityID;
      // Ưu tiên lấy priorityName, nếu không có thì lấy priorityDescription
      const priorityLabel = 
                           priority.priorityDescription || 
                           priority.PriorityDescription;
      return {
        value: String(priorityId),
        label: priorityLabel
      };
    })
  ];

  console.log('School Options:', schoolOptions);
  console.log('Priority Options:', priorityOptions);
  console.log('Current schoolId:', data.schoolId);
  console.log('Current priorityId:', data.priorityId);

  return (
    <Section className="relative">
      
      {/* Tiêu đề & Nút Edit */}
      <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900">Thông Tin Cá Nhân</h2>
          <p className="text-sm text-gray-500">Quản lý và cập nhật thông tin cá nhân của bạn</p>
          
          {!isEditing && (
            <Button 
                className="absolute top-8 right-8" 
                size="sm" 
                variant="primary" 
                onClick={onEdit}
            >
                Chỉnh sửa
            </Button>
          )}
      </div>

      {/* Grid Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

          <ProfileField 
            label="Mã sinh viên" 
            icon={<IdentificationIcon/>} 
            value={data.studentId} 
            isEditing={isEditing} 
            disabled 
          />
          
          <ProfileField 
            label="Họ và tên *" 
            icon={<UserIcon/>} 
            value={data.fullName} 
            isEditing={isEditing} 
            onChange={(v) => onChange('fullName', v)}
          />

          <ProfileField 
            label="Giới tính *" 
            icon={<BsGenderAmbiguous/>} 
            value={data.gender} 
            isEditing={isEditing} 
            disabled 
          />
          
          <ProfileField 
            label="Số điện thoại *" 
            icon={<PhoneIcon/>} 
            value={data.phone} 
            isEditing={isEditing} 
            onChange={(v) => onChange('phone', v)} 
          />

          <ProfileField 
            label="CCCD/CMND *" 
            icon={<IdentificationIcon/>} 
            value={data.cccd} 
            isEditing={isEditing} 
            disabled 
          />
          
          <ProfileField 
            label="Nơi cấp CCCD" 
            icon={<MapPinIcon/>} 
            value={data.issuePlace} 
            isEditing={isEditing} 
            onChange={(v) => onChange('issuePlace', v)} 
          />

          <ProfileField 
            label="Email *" 
            icon={<EnvelopeIcon/>} 
            value={data.email} 
            isEditing={isEditing} 
          />

          <ProfileField 
            type="select" 
            label="Đối tượng ưu tiên" 
            icon={<UserIcon/>} 
            value={data.priorityId}
            displayValue={data.priorityName}
            isEditing={isEditing} 
            onChange={(v) => onChange('priorityId', v)}
            options={priorityOptions}
            disabled={loadingOptions}
          />

          <ProfileField 
            type="select" 
            label="Trường học" 
            icon={<AcademicCapIcon/>} 
            value={data.schoolId}
            displayValue={data.schoolName}
            isEditing={isEditing} 
            onChange={(v) => onChange('schoolId', v)}
            options={schoolOptions}
            disabled={loadingOptions}
          />

          <ProfileField 
            label="Địa chỉ hiện tại" 
            icon={<MapPinIcon/>} 
            value={data.address} 
            isEditing={isEditing} 
            onChange={(v) => onChange('address', v)} 
          />
      </div>

      {/* Nút Lưu / Hủy */}
      {isEditing && (
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
            <Button 
              onClick={onSave} 
              icon={<UserIcon className="w-4 h-4"/>}
              disabled={loadingOptions}
            >
              Lưu thay đổi
            </Button>
            <Button 
              variant="white" 
              onClick={onCancel}
            >
              Hủy bỏ
            </Button>
          </div>
      )}
    </Section>
  );
}