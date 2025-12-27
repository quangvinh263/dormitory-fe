import React, { useState, useEffect } from 'react';
import { XMarkIcon, HomeModernIcon, WrenchScrewdriverIcon, SparklesIcon } from '@heroicons/react/24/outline';

const RoomModal = ({ 
  isOpen, 
  onClose, 
  initialData, 
  currentBuildingName, 
  roomTypes = [], 
  isEditMode = false,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    RoomName: '',
    RoomTypeID: '',
    Capacity: '',
    Gender: 'Nam',
    RoomStatus: '',
    IsUnderMaintenance: false,
    IsBeingCleaned: false
  });

  // Tìm RoomType đang chọn để hiển thị thông tin
  const selectedType = roomTypes.find(t => t.roomTypeID === formData.RoomTypeID);

  useEffect(() => {
    if (isOpen) {
      if (initialData && isEditMode) {
        // Edit Mode - map data từ API response
        setFormData({
          RoomName: initialData.roomName || '',
          RoomTypeID: initialData.roomTypeID || '',
          Capacity: initialData.capacity || '',
          Gender: initialData.gender === 'Male' ? 'Nam' : 'Nữ', // Convert English to Vietnamese
          RoomStatus: initialData.roomStatus || '',
          IsUnderMaintenance: initialData.isUnderMaintenance || false,
          IsBeingCleaned: initialData.isBeingCleaned || false
        });
      } else {
        // Create Mode
        setFormData({
          RoomName: '',
          RoomTypeID: roomTypes[0]?.roomTypeID || '',
          Capacity: roomTypes[0]?.capacity || '',
          Gender: 'Nam',
          RoomStatus: '',
          IsUnderMaintenance: false,
          IsBeingCleaned: false
        });
      }
    }
  }, [initialData, isOpen, roomTypes, isEditMode]);

  // Khi đổi loại phòng -> Tự động điền Capacity mặc định của loại đó (chỉ khi create)
  const handleTypeChange = (e) => {
    const typeId = e.target.value;
    const type = roomTypes.find(t => t.roomTypeID === typeId);
    
    setFormData(prev => ({
      ...prev,
      RoomTypeID: typeId,
      // Chỉ auto-fill capacity khi create mode
      Capacity: (!isEditMode && type) ? type.capacity || prev.Capacity : prev.Capacity
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.RoomName.trim()) {
      alert('Vui lòng nhập tên phòng');
      return;
    }
    
    if (!formData.RoomTypeID) {
      alert('Vui lòng chọn loại phòng');
      return;
    }
    
    // Call parent's onSubmit handler
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden transform-gpu animate-fade-in">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <HomeModernIcon className="w-5 h-5 text-blue-600"/>
            {isEditMode ? `Cập nhật Phòng: ${initialData?.roomName}` : `Thêm Phòng vào ${currentBuildingName}`}
          </h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6 text-gray-400 hover:text-red-500"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
          
          {/* Tên Phòng */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên phòng <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              required
              disabled={isEditMode} // Không cho sửa tên phòng khi edit
              className={`w-full border rounded-lg p-2.5 focus:ring-blue-500 border-gray-300 ${
                isEditMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
              }`}
              placeholder="VD: A.101" 
              value={formData.RoomName} 
              onChange={e => setFormData({...formData, RoomName: e.target.value})}
            />
            {isEditMode && (
              <p className="text-xs text-gray-500 mt-1">Tên phòng không thể thay đổi</p>
            )}
          </div>
          
          {/* Loại Phòng (Select từ RoomTypes) */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại phòng <span className="text-red-500">*</span>
            </label>
            <select 
              required
              disabled={isEditMode} // Không cho sửa loại phòng khi edit
              className={`w-full border rounded-lg p-2.5 focus:ring-blue-500 border-gray-300 ${
                isEditMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
              }`}
              value={formData.RoomTypeID} 
              onChange={handleTypeChange}
            >
              <option value="">-- Chọn loại phòng --</option>
              {roomTypes.map(type => (
                <option key={type.roomTypeID} value={type.roomTypeID}>
                  {type.typeName}
                </option>
              ))}
            </select>
            {isEditMode && (
              <p className="text-xs text-gray-500 mt-1">Loại phòng không thể thay đổi</p>
            )}
          </div>

          {/* Sức chứa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sức chứa tối đa <span className="text-red-500">*</span>
            </label>
            <input 
              type="number" 
              required
              min="1"
              disabled={isEditMode} // Không cho sửa capacity khi edit
              className={`w-full border rounded-lg p-2.5 focus:ring-blue-500 border-gray-300 ${
                isEditMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
              }`}
              value={formData.Capacity} 
              onChange={e => setFormData({...formData, Capacity: e.target.value})}
            />
            {isEditMode && (
              <p className="text-xs text-gray-500 mt-1">Sức chứa không thể thay đổi</p>
            )}
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

          {/* Room Status - chỉ hiện khi edit */}
          {isEditMode && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái phòng</label>
              <select 
                className="w-full border rounded-lg p-2.5 focus:ring-blue-500 border-gray-300 bg-white" 
                value={formData.RoomStatus} 
                onChange={e => setFormData({...formData, RoomStatus: e.target.value})}
              >
                <option value="">-- Chọn trạng thái --</option>
                <option value="Available">Có sẵn</option>
                <option value="Full">Đã đầy</option>
                <option value="Maintenance">Bảo trì</option>
                <option value="Closed">Đóng cửa</option>
              </select>
            </div>
          )}

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

          {/* Thông tin loại phòng được chọn */}
          {selectedType && (
            <div className="col-span-2 mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-1">Thông tin loại phòng:</h4>
              <p className="text-sm text-blue-600">{selectedType.typeName}</p>
            </div>
          )}

        </form>

        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button 
            type="button"
            onClick={onClose} 
            className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button 
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium"
          >
            {isEditMode ? 'Cập nhật' : 'Tạo phòng'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;