import { 
  UserIcon, EnvelopeIcon, PhoneIcon, IdentificationIcon, 
  MapPinIcon, AcademicCapIcon 
} from '@heroicons/react/24/outline';

import Section from '../../shared/Section';
import Button from '../../ui/Button';
import ProfileField from './ProfileField'; 

export default function PersonalInfoSection({ 
  data, 
  isEditing, 
  onEdit, 
  onCancel, 
  onSave, 
  onChange 
}) {
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

          <ProfileField label="Mã sinh viên" icon={<IdentificationIcon/>} value={data.studentId} isEditing={isEditing} disabled />
          <ProfileField label="Họ và tên *" icon={<UserIcon/>} value={data.fullName} isEditing={isEditing} onChange={(v) => onChange('fullName', v)}/>
          
          <ProfileField label="CCCD/CMND *" icon={<IdentificationIcon/>} value={data.cccd} isEditing={isEditing} disabled />
          <ProfileField label="Nơi cấp CCCD" icon={<MapPinIcon/>} value={data.cccdPlace} isEditing={isEditing} onChange={(v) => onChange('cccdPlace', v)} />

          <ProfileField label="Email *" icon={<EnvelopeIcon/>} value={data.email} isEditing={isEditing} />
          <ProfileField label="Số điện thoại *" icon={<PhoneIcon/>} value={data.phone} isEditing={isEditing} onChange={(v) => onChange('phone', v)} />

          <ProfileField 
            type="select" label="Trường học" icon={<AcademicCapIcon/>} 
            value={data.school} isEditing={isEditing} 
            onChange={(v) => onChange('school', v)}
            options={[
              { value: 'uit', label: 'ĐH Công nghệ Thông tin' },
              { value: 'bk', label: 'ĐH Bách Khoa' },
              { value: 'khtn', label: 'ĐH Khoa học Tự nhiên' }
            ]}
          />

          <ProfileField 
            type="select" label="Đối tượng ưu tiên" icon={<UserIcon/>} 
            value={data.priority} isEditing={isEditing} 
            onChange={(v) => onChange('priority', v)}
            options={[
              { value: 'none', label: 'Không có' },
              { value: 'lietsi', label: 'Con thương binh/liệt sĩ' },
              { value: 'ngheo', label: 'Hộ nghèo/Cận nghèo' }
            ]}
          />

          <div className="md:col-span-2">
            <ProfileField label="Địa chỉ hiện tại" icon={<MapPinIcon/>} value={data.address} isEditing={isEditing} onChange={(v) => onChange('address', v)} />
          </div>
      </div>

      {/* Nút Lưu / Hủy */}
      {isEditing && (
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
            <Button onClick={onSave} icon={<UserIcon className="w-4 h-4"/>}>Lưu thay đổi</Button>
            <Button variant="white" onClick={onCancel}>Hủy bỏ</Button>
          </div>
      )}
    </Section>
  );
}