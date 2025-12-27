// src/pages/admin/RoomTypeManagementModal.jsx

import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  SwatchIcon, 
  PlusIcon, 
  TrashIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const RoomTypeManagementModal = ({ isOpen, onClose, roomTypes, onUpdateRoomTypes }) => {
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null); // null = Mode tạo mới
  
  // Form State
  const [formData, setFormData] = useState({
    TypeName: '',
    Capacity: 4,
    Price: 0,
    Description: ''
  });

  // Sync props vào state nội bộ khi mở modal
  useEffect(() => {
    if (isOpen) {
      setTypes(roomTypes);
      resetForm();
    }
  }, [isOpen, roomTypes]);

  const resetForm = () => {
    setSelectedType(null);
    setFormData({ TypeName: '', Capacity: 4, Price: 0, Description: '' });
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
    setFormData({
      TypeName: type.TypeName,
      Capacity: type.Capacity,
      Price: type.Price,
      Description: type.Description
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa loại phòng này?")) {
      const newList = types.filter(t => t.RoomTypeID !== id);
      setTypes(newList);
      onUpdateRoomTypes(newList); // Cập nhật ra ngoài cha
      if (selectedType?.RoomTypeID === id) resetForm();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.TypeName) return alert("Vui lòng nhập tên loại phòng");

    let newList;
    if (selectedType) {
      // UPDATE
      newList = types.map(t => t.RoomTypeID === selectedType.RoomTypeID ? { ...t, ...formData } : t);
    } else {
      // CREATE
      const newId = types.length > 0 ? Math.max(...types.map(t => t.RoomTypeID)) + 1 : 1;
      const newType = { RoomTypeID: newId, ...formData };
      newList = [...types, newType];
    }

    setTypes(newList);
    onUpdateRoomTypes(newList); // Cập nhật ra ngoài cha
    resetForm();
    alert(selectedType ? "Đã cập nhật!" : "Đã thêm mới!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[500px] flex flex-col overflow-hidden transform-gpu animate-fade-in">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <SwatchIcon className="w-5 h-5 text-green-600"/>
            Quản lý Cấu hình Loại phòng
          </h2>
          <button onClick={onClose}><XMarkIcon className="w-6 h-6 text-gray-400 hover:text-red-500"/></button>
        </div>

        {/* BODY: SPLIT VIEW */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* CỘT TRÁI: DANH SÁCH (35%) */}
          <div className="w-[35%] border-r border-gray-100 flex flex-col bg-gray-50/50">
            <div className="p-3 border-b border-gray-100">
               <button 
                onClick={resetForm}
                className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-green-500 hover:text-green-600 transition"
               >
                 <PlusIcon className="w-4 h-4"/> Thêm loại mới
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
               {types.map(type => (
                 <div 
                    key={type.RoomTypeID}
                    onClick={() => handleSelectType(type)}
                    className={`p-3 rounded-lg border cursor-pointer transition relative group
                        ${selectedType?.RoomTypeID === type.RoomTypeID 
                            ? 'bg-white border-green-500 shadow-sm ring-1 ring-green-500' 
                            : 'bg-white border-gray-200 hover:border-green-300'}
                    `}
                 >
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-800 text-sm">{type.TypeName}</h4>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(type.RoomTypeID); }}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                        >
                            <TrashIcon className="w-4 h-4"/>
                        </button>
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-gray-500">
                        <span>{type.Capacity} người</span>
                        <span className="text-sm font-medium text-green-700">
                             {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(type.Price)}
                        </span>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* CỘT PHẢI: FORM (65%) */}
          <div className="flex-1 p-6 overflow-y-auto bg-white">
            <h3 className="text-md font-bold text-gray-800 mb-4 border-b pb-2">
                {selectedType ? `Chỉnh sửa: ${selectedType.TypeName}` : 'Thêm loại phòng mới'}
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên loại phòng</label>
                        <input 
                            type="text" required
                            className="text-sm w-full border rounded-lg p-2.5 focus:ring-green-500 border-gray-300"
                            placeholder="VD: VIP 2 người"
                            value={formData.TypeName}
                            onChange={e => setFormData({...formData, TypeName: e.target.value})}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa (người)</label>
                        <input 
                            type="number" required min="1"
                            className="text-sm w-full border rounded-lg p-2.5 focus:ring-green-500 border-gray-300"
                            value={formData.Capacity}
                            onChange={e => setFormData({...formData, Capacity: parseInt(e.target.value)})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Đơn giá (VNĐ/năm)</label>
                        <input 
                            type="number" required min="0"
                            className="text-sm w-full border rounded-lg p-2.5 focus:ring-green-500 border-gray-300"
                            value={formData.Price}
                            onChange={e => setFormData({...formData, Price: parseInt(e.target.value)})}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả tiện ích</label>
                        <textarea 
                            rows="3"
                            className="text-sm w-full border rounded-lg p-2.5 focus:ring-green-500 border-gray-300 resize-none"
                            placeholder="VD: Máy lạnh, tủ lạnh riêng, bao điện nước..."
                            value={formData.Description}
                            onChange={e => setFormData({...formData, Description: e.target.value})}
                        />
                    </div>
                </div>

                <div className="pt-2 flex justify-end">
                     <button 
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-md transition transform active:scale-95"
                     >
                        <CheckCircleIcon className="w-5 h-5"/>
                        {selectedType ? 'Lưu thay đổi' : 'Tạo mới'}
                     </button>
                </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomTypeManagementModal;