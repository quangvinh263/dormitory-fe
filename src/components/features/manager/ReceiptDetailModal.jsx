import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Badge from '../../ui/Badge';

const ReceiptDetailModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  // Helper component nhỏ để hiển thị từng cặp Label - Value cho gọn code
  const InfoItem = ({ label, value, children, className = "" }) => (
    <div className={`flex flex-col items-start ${className}`}>
      <span className="text-xs text-gray-500 mb-1">{label}</span>
      {children ? children : (
        <span className="text-sm font-medium text-gray-900">{value}</span>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      {/* Container chính */}
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex justify-between items-start p-5 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Chi Tiết Thanh Toán</h3>
            <p className="text-xs text-gray-500 mt-1">
              Mã thanh toán: <span className="font-medium text-gray-700">{data.id}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          
          {/* Grid thông tin chính (2 cột) */}
          <div className="grid grid-cols-2 gap-y-5 gap-x-4">
            <InfoItem label="MSSV" value={data.studentId} />
            <InfoItem label="Họ tên" value={data.name} />
            
            <InfoItem label="Phòng" value={data.room} />
            <InfoItem label="Loại thanh toán">
                <span className="font-medium text-blue-700">{data.type}</span>
            </InfoItem>

            <InfoItem label="Tháng" value={data.month || 'N/A'} />
            <InfoItem label="Số tiền">
                <span className="font-bold text-gray-900 text-base">{data.amount}</span>
            </InfoItem>

            <InfoItem label="Ngày thanh toán" value={data.date} />
            <InfoItem label="Trạng thái">
                {data.status === 'completed' && <Badge type="success">Đã thanh toán</Badge>}
                {data.status === 'pending' && <Badge type="warning">Chờ thanh toán</Badge>}
                {data.status === 'failed' && <Badge type="danger">Bị từ chối</Badge>}
            </InfoItem>
          </div>

          {/* Block thông tin giao dịch (Màu xám)
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-3">
            <InfoItem label="Phương thức thanh toán" value="Chuyển khoản ngân hàng" />
            
            <div>
               <span className="text-xs text-gray-500">Mã giao dịch: </span>
               <div className="text-xs text-gray-700 bg-white border border-gray-200 px-2 py-1 rounded inline-block">
                  VNPAY_{data.id}_{data.studentId}
               </div>
            </div>
          </div> */}

        </div>
        
      </div>
    </div>
  );
};

export default ReceiptDetailModal;