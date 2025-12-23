import Section from '../../shared/Section';
import Button from '../../ui/Button';
import RelativeCard from './RelativeCard';
import { PlusIcon, UserGroupIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function RelativeListSection({ 
  relatives, 
  isEditing, 
  onEdit,
  onCancel,
  onSave,
  onAdd, 
  onChange, 
  onRemove 
}) {
  return (
    <Section className="relative">
      {/* Tiêu đề & 2 Nút */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Thông Tin Người Thân</h2>
        <p className="text-sm text-gray-500">Danh sách người thân để liên hệ khi cần thiết</p>
        
        {/* 2 Nút song song - Chỉ hiển thị khi KHÔNG đang edit */}
        {!isEditing && (
          <div className="absolute top-8 right-8 flex gap-2">
            {/* Nút Thêm người thân */}
            <Button 
              size="sm" 
              variant="outline"
              icon={<PlusIcon className="w-4 h-4" />}
              onClick={onAdd}
            >
              Thêm
            </Button>
            
            {/* Nút Chỉnh sửa - Chỉ hiển thị khi có người thân */}
            {relatives.length > 0 && (
              <Button 
                size="sm" 
                variant="primary"
                icon={<PencilIcon className="w-4 h-4" />}
                onClick={onEdit}
              >
                Chỉnh sửa
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Danh sách người thân */}
      {relatives.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <UserGroupIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 mb-2">Chưa có thông tin người thân</p>
          <p className="text-sm text-gray-400">Nhấn nút "Thêm" ở góc trên để thêm người thân</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Danh sách các RelativeCard */}
          {relatives.map((relative, index) => (
            <RelativeCard 
              key={relative.id || index}
              relative={relative}
              index={index}
              isEditing={isEditing}
              onChange={onChange}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}

      {/* Nút Lưu / Hủy - Chỉ hiển thị khi ĐANG edit */}
      {isEditing && (
        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
          <Button 
            onClick={onSave}
            icon={<UserGroupIcon className="w-4 h-4"/>}
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