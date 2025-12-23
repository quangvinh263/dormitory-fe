import { UserIcon, BriefcaseIcon, PhoneIcon, MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ProfileField from './ProfileField';

export default function RelativeCard({ index, relative, isEditing, onChange, onRemove }) {
  return (
    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 relative group transition-all hover:border-blue-200 hover:shadow-sm">
       {/* Nút Xóa (Chỉ hiện khi Edit) */}
       {isEditing && onRemove && (
         <button 
            onClick={() => onRemove(index)}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Xóa người thân này"
         >
            <XMarkIcon className="w-5 h-5" />
         </button>
       )}

       <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
         <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">
            #{index + 1}
         </span>
         Người thân {relative?.relationship ? `(${relative.relationship})` : ''}
       </h3>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileField 
            label="Họ và tên" 
            icon={<UserIcon/>} 
            value={relative?.fullName || ''} 
            isEditing={isEditing} 
            onChange={(v) => onChange(index, 'fullName', v)} 
          />
          <ProfileField 
            label="Quan hệ (Bố/Mẹ/...)" 
            icon={<UserIcon/>} 
            value={relative?.relationship || ''} 
            isEditing={isEditing} 
            onChange={(v) => onChange(index, 'relationship', v)} 
          />
          <ProfileField 
            label="Nghề nghiệp" 
            icon={<BriefcaseIcon/>} 
            value={relative?.occupation || ''} 
            isEditing={isEditing} 
            onChange={(v) => onChange(index, 'occupation', v)} 
          />
          <ProfileField 
            label="Số điện thoại" 
            icon={<PhoneIcon/>} 
            value={relative?.phoneNumber || ''} 
            isEditing={isEditing} 
            onChange={(v) => onChange(index, 'phoneNumber', v)} 
          />
          <div className="md:col-span-2">
             <ProfileField 
                label="Địa chỉ" 
                icon={<MapPinIcon/>} 
                value={relative?.address || ''} 
                isEditing={isEditing} 
                onChange={(v) => onChange(index, 'address', v)} 
             />
          </div>
       </div>
    </div>
  );
}