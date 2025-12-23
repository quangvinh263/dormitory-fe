import React, { useState } from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const CreateViolationModal = ({ isOpen, onClose, onSubmit }) => {
  // State quản lý form
  const [formData, setFormData] = useState({
    studentId: 'SV2024001', 
    room: 'A301',
    violationType: '',
    description: '',
    resolution: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    // Overlay nền tối
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      
      {/* Container chính của Modal */}
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex justify-between items-start p-5 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Lập Biên Bản Vi Phạm</h3>
            <p className="text-sm text-gray-500 mt-1">Nhập thông tin vi phạm và hướng xử lý</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */} 
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Hàng 1: MSSV và Phòng */}
          <div className="grid grid-cols-2 gap-4">
            {/* MSSV */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">MSSV <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.studentId}
                onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="Nhập MSSV"
              />
            </div>
            {/* Phòng */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Phòng <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.room}
                onChange={(e) => setFormData({...formData, room: e.target.value})}
                className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="Số phòng"
              />
            </div>
          </div>

          {/* Hàng 2: Loại vi phạm  */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Loại vi phạm <span className="text-red-500">*</span></label>
            <textarea 
              rows="1"
              value={formData.violationType}
              onChange={(e) => setFormData({...formData, violationType: e.target.value})}
              className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
              placeholder="Mô tả loại vi phạm..."
            ></textarea>
          </div>

          {/* Hàng 3: Mô tả vi phạm */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Mô tả vi phạm <span className="text-red-500">*</span></label>
            <textarea 
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
              placeholder="Mô tả chi tiết hành vi vi phạm..."
            ></textarea>
          </div>

          {/* Hàng 4: Note cảnh báo  */}
          <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-md p-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-700 flex-shrink-0" />
            <p className="text-sm text-gray-500 leading-tight">
              Sinh viên sẽ nhận được thông báo ngay sau khi biên bản được lập. 
              <span className="font-semibold text-gray-700"> Vi phạm lần thứ 3 sẽ tự động chấm dứt hợp đồng.</span>
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end items-center gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 shadow-sm flex items-center gap-2 transition-colors"
            >
              <span>Lập biên bản</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateViolationModal;