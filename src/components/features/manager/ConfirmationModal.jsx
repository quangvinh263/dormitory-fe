import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function ConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay đen hơn một chút để nổi bật trên modal cũ */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 animate-scale-up">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận nhập liệu?</h3>
          <p className="text-sm text-gray-500 mb-6">
            Sau khi xác nhận, hóa đơn sẽ được tạo và gửi thông báo đến sinh viên. Bạn không thể chỉnh sửa sau bước này.
          </p>
          
          <div className="flex gap-3 w-full">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Quay lại
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Đồng ý
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}