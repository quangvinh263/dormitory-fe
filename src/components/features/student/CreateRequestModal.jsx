import { useState } from 'react';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Button from '../../ui/Button'; //

export default function CreateRequestModal({ isOpen, onClose, onSubmit,equipments }) {
  const [formData, setFormData] = useState({
    room: 'A1.01', // Mặc định lấy từ profile user
    device: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Validate đơn giản
    if (!formData.device || !formData.description) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    onSubmit(formData);
  };

  return (
    // Overlay màn hình đen mờ
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      
      <div className="w-full max-w-[500px] bg-white rounded-lg shadow-2xl overflow-hidden animate-scale-in">
        
        {/* --- HEADER --- */}
        <div className="p-4 relative">
          <h3 className="text-lg font-bold text-gray-900">Tạo Yêu Cầu Sửa Chữa Mới</h3>
          <p className="text-sm text-gray-500 mt-1">Điền thông tin chi tiết về vấn đề cần sửa chữa</p>
          
          {/* Nút Close (X) */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* --- BODY FORM --- */}
        <div className="px-4 py-2 space-y-4">
          
          {/* Field 1: Phòng (Readonly) */}
          <div className="space-y-1.5">
             <label className="text-sm font-medium text-gray-900">Phòng</label>
             <div className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-md text-sm text-gray-900 font-medium cursor-not-allowed">
                {formData.room}
             </div>
             <p className="text-xs text-gray-400">Phòng của bạn</p>
          </div>

          {/* Field 2: Thiết bị (Select) */}
          <div className="space-y-1.5">
             <div className="flex gap-1">
                <label className="text-sm font-medium text-gray-900">Tên thiết bị</label>
                <span className="text-red-500 text-sm">*</span>
             </div>
             <div className="relative">
                  <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 appearance-none focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                     value={formData.device}
                     onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                  >
                  <option value="" disabled>Chọn thiết bị cần sửa chữa</option>

                  {/* --- PHẦN SỬA ĐỔI: Render động từ mảng equipments --- */}
                  {equipments && equipments.length > 0 ? (
                     equipments.map((item) => (
                        <option key={item.equipmentID} value={item.equipmentID}>
                              {item.equipmentName} {/* Tên thiết bị hiển thị ra */}
                        </option>
                     ))
                  ) : (
                     <option value="" disabled>Không tìm thấy thiết bị nào</option>
                  )}

               {/* Nếu bạn vẫn muốn giữ tùy chọn "Khác" thủ công thì để ở dưới cùng */}
               <option value="other">Khác</option>
         </select>
                <ChevronDownIcon className="w-3 h-3 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
             </div>
          </div>

          {/* Field 3: Mô tả (Textarea) */}
          <div className="space-y-1.5">
             <div className="flex gap-1">
                <label className="text-sm font-medium text-gray-900">Mô tả vấn đề</label>
                <span className="text-red-500 text-sm">*</span>
             </div>
             <textarea 
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 resize-none h-20"
                placeholder="Mô tả chi tiết vấn đề cần sửa chữa..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
             />
          </div>

        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="p-4 flex justify-end gap-2 mt-2">
           <button 
              onClick={onClose}
              className="px-4 py-1.5 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
           >
              Hủy
           </button>
           
           <button 
              onClick={handleSubmit}
              className="px-4 py-1.5 bg-green-600 rounded-md text-sm font-medium text-white hover:bg-green-700 transition-colors shadow-sm"
           >
              Gửi yêu cầu
           </button>
        </div>

      </div>
    </div>
  );
}