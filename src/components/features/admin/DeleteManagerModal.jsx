import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const DeleteManagerModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900">Xác nhận xóa?</h3>
            <p className="text-sm text-gray-500 mt-2">
              Bạn có chắc chắn muốn xóa tài khoản trưởng tòa <span className="font-bold text-gray-800">"{itemName}"</span> không? 
              Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-center">
          <button 
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={onConfirm}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm"
          >
            Đồng ý xóa
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteManagerModal;