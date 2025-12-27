import React, { useState, useEffect } from 'react';
import { XMarkIcon, HomeModernIcon, WrenchScrewdriverIcon, SparklesIcon } from '@heroicons/react/24/outline';

const RoomModal = ({ isOpen, onClose, initialData, currentBuildingName, roomTypes }) => {
  const [formData, setFormData] = useState({
    RoomName: '',
    RoomTypeID: '',
    Capacity: '',
    Gender: 'Nam',
    IsUnderMaintenance: false,
    IsBeingCleaned: false
  });

  // Tìm RoomType đang chọn để hiển thị giá tham khảo
  const selectedType = roomTypes.find(t => t.RoomTypeID == formData.RoomTypeID);

  useEffect(() => {
    if (initialData) {
      // Edit Mode
      setFormData({
        RoomName: initialData.RoomName,
        RoomTypeID: initialData.RoomTypeID,
        Capacity: initialData.Capacity,
        Gender: initialData.Gender,
        IsUnderMaintenance: initialData.IsUnderMaintenance,
        IsBeingCleaned: initialData.IsBeingCleaned
      });
    } else {
      // Create Mode
      setFormData({
        RoomName: '',
        RoomTypeID: roomTypes[0]?.RoomTypeID || '', // Default select first type
        Capacity: roomTypes[0]?.Capacity || 4,      // Default capacity
        Gender: 'Nam',
        IsUnderMaintenance: false,
        IsBeingCleaned: false
      });
    }
  }, [initialData, isOpen, roomTypes]);

  // Khi đổi loại phòng -> Tự động điền Capacity mặc định của loại đó
  const handleTypeChange = (e) => {
      const typeId = parseInt(e.target.value);
      const type = roomTypes.find(t => t.RoomTypeID === typeId);
      setFormData(prev => ({
          ...prev,
          RoomTypeID: typeId,
          Capacity: type ? type.Capacity : prev.Capacity
      }));
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden transform-gpu animate-fade-in">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <HomeModernIcon className="w-5 h-5 text-blue-600"/>
            {initialData ? 'Cập nhật Phòng' : `Thêm Phòng vào ${currentBuildingName}`}
          </h2>
          <button onClick={onClose}><XMarkIcon className="w-6 h-6 text-gray-400 hover:text-red-500"/></button>
        </div>

        <form className="p-6 grid grid-cols-2 gap-4">
          
          {/* Tên Phòng */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên phòng</label>
            <input 
                type="text" 
                className="w-full border rounded-lg p-2.5 focus:ring-blue-500 border-gray-300" 
                placeholder="VD: A.101" 
                value={formData.RoomName} 
                onChange={e => setFormData({...formData, RoomName: e.target.value})}
            />
          </div>
          
          {/* Loại Phòng (Select từ RoomTypes) */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại phòng (RoomType)</label>
            <select 
                className="w-full border rounded-lg p-2.5 focus:ring-blue-500 border-gray-300 bg-white" 
                value={formData.RoomTypeID} 
                onChange={handleTypeChange}
            >
              {roomTypes.map(type => (
                  <option key={type.RoomTypeID} value={type.RoomTypeID}>
                      {type.TypeName} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(type.Price)}
                  </option>
              ))}
            </select>
          </div>

          {/* Sức chứa (Lấy default từ Type nhưng cho sửa) */}
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa tối đa</label>
             <input 
                type="number" 
                className="w-full border rounded-lg p-2.5 focus:ring-blue-500 border-gray-300" 
                value={formData.Capacity} 
                onChange={e => setFormData({...formData, Capacity: e.target.value})}
            />
          </div>

          {/* Giới tính */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dành cho</label>
            <select 
                className="w-full border rounded-lg p-2.5 focus:ring-blue-500 border-gray-300 bg-white" 
                value={formData.Gender} 
                onChange={e => setFormData({...formData, Gender: e.target.value})}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          {/* Checkbox Trạng thái đặc biệt */}
          <div className="col-span-2 mt-2 space-y-3 border-t border-gray-100 pt-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500 border-gray-300"
                    checked={formData.IsUnderMaintenance}
                    onChange={e => setFormData({...formData, IsUnderMaintenance: e.target.checked})}
                  />
                  <div className="flex items-center gap-2">
                      <WrenchScrewdriverIcon className="w-5 h-5 text-gray-500"/>
                      <span className="text-sm font-medium text-gray-700">Đang bảo trì (Under Maintenance)</span>
                  </div>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-400 border-gray-300"
                    checked={formData.IsBeingCleaned}
                    onChange={e => setFormData({...formData, IsBeingCleaned: e.target.checked})}
                  />
                  <div className="flex items-center gap-2">
                      <SparklesIcon className="w-5 h-5 text-gray-500"/>
                      <span className="text-sm font-medium text-gray-700">Đang dọn dẹp (Being Cleaned)</span>
                  </div>
              </label>
          </div>

        </form>

        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50">Hủy</button>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium">Lưu lại</button>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;