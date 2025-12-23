import Section from '../../shared/Section';
import Button from '../../ui/Button';
import RelativeCard from './RelativeCard';
import { PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function RelativeListSection({ 
  relatives, 
  isEditing, 
  onEdit,      // Thêm prop mới
  onCancel,    // Thêm prop mới
  onSave,      // Thêm prop mới
  onAdd, 
  onChange, 
  onRemove 
}) {
  return (
    <Section className="relative">
      {/* Tiêu đề & Nút Edit */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Thông Tin Người Thân</h2>
        <p className="text-sm text-gray-500">Danh sách người thân để liên hệ khi cần thiết</p>
        
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

      {/* Danh sách người thân */}
      {relatives.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <UserGroupIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 mb-4">Chưa có thông tin người thân</p>
          {isEditing && (
            <Button 
              onClick={onAdd}
              icon={<PlusIcon className="w-4 h-4" />}
              size="sm"
            >
              Thêm người thân
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
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

          {isEditing && (
            <Button 
              onClick={onAdd}
              icon={<PlusIcon className="w-4 h-4" />}
              variant="outline"
              className="w-full"
            >
              Thêm người thân
            </Button>
          )}
        </div>
      )}

      {/* Nút Lưu / Hủy - Chỉ hiển thị khi đang edit */}
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