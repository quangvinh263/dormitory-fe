import React, { useState, useEffect } from 'react';
import { XMarkIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';

const BuildingModal = ({ isOpen, onClose, initialData }) => {
  const [formData, setFormData] = useState({ BuildingName: '', ManagerID: '' });

  useEffect(() => {
    if (initialData) {
      setFormData({ 
          BuildingName: initialData.buildingName, 
          ManagerID: initialData.managerID 
      });
    } else {
      setFormData({ BuildingName: '', ManagerID: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform-gpu animate-fade-in">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <BuildingOffice2Icon className="w-5 h-5 text-blue-600"/>
            {initialData ? 'Cập nhật Tòa nhà' : 'Thêm Tòa nhà mới'}
          </h2>
          <button onClick={onClose}><XMarkIcon className="w-6 h-6 text-gray-400 hover:text-red-500"/></button>
        </div>

        <form className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên tòa nhà</label>
            <input 
                type="text" 
                className="w-full border rounded-lg p-2.5 focus:ring-blue-500 border-gray-300" 
                placeholder="VD: Tòa nhà A" 
                value={formData.BuildingName} 
                onChange={e => setFormData({...formData, BuildingName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trưởng tòa (ManagerID)</label>
            {/* Trong thực tế bạn cần truyền list Manager vào đây để map option */}
            <select 
                className="w-full border rounded-lg p-2.5 focus:ring-blue-500 border-gray-300 bg-white" 
                value={formData.ManagerID} 
                onChange={e => setFormData({...formData, ManagerID: e.target.value})}
            >
              <option value="">-- Chọn quản lý --</option>
              <option value="MN001">Nguyễn Văn A (MN001)</option>
              <option value="MN002">Trần Thị B (MN002)</option>
            </select>
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

export default BuildingModal;