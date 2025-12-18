import { PlusIcon } from '@heroicons/react/24/outline';
import Section from '../../shared/Section';
import Button from '../../ui/Button';
import RelativeCard from './RelativeCard'; // Component con hiển thị 1 thẻ

export default function RelativeListSection({ 
  relatives, 
  isEditing, 
  onAdd, 
  onChange, 
  onRemove 
}) {
  return (
    <Section>
       <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Thông Tin Người Thân</h2>
            <p className="text-sm text-gray-500">Thông tin về cha mẹ hoặc người giám hộ</p>
          </div>
          
          {isEditing && (
             <Button size="sm" variant="success" icon={<PlusIcon className="w-4 h-4"/>} onClick={onAdd}>
               Thêm người thân
             </Button>
          )}
       </div>

       <div className="space-y-4">
          {relatives.map((rel, index) => (
             <RelativeCard 
                key={rel.id} 
                index={index} 
                data={rel} 
                isEditing={isEditing} 
                onChange={onChange}
                onRemove={() => onRemove(index)}
             />
          ))}
          
          {relatives.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">Chưa có thông tin người thân.</p>
            </div>
          )}
       </div>
    </Section>
  );
}