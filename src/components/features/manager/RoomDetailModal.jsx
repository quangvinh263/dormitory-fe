import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import Button from '../../ui/Button';
import Badge from '../../ui/Badge';

export default function RoomDetailModal({ isOpen, onClose, room }) {
  if (!isOpen || !room) return null;

  const formatMoney = (amount) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  // Helper chọn Badge giống RoomCard
  const getBadgeType = (status) => {
    switch (status) {
      case 'Empty': return 'success';      // Xanh lá
      case 'Maintenance': return 'warning'; // Cam
      default: return 'default';            // Xám (Đã đầy)
    }
  };

  const getStatusLabel = (status) => {
    if (status === 'Empty') return 'Còn trống';
    if (status === 'Maintenance') return 'Bảo trì';
    return 'Đã đầy';
  };

  // Component con để hiển thị từng dòng thông tin (cho code gọn)
  const InfoItem = ({ label, value, children }) => (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] text-gray-500 tracking-wide font-medium">{label}</span>
      <div className="text-sm font-medium text-gray-900">
        {children || value}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay: Nền đen mờ */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
        
        {/* 1. Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Chi tiết phòng {room.id}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Thông tin chi tiết về phòng</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Body: Thông tin chi tiết (Grid Layout) */}
        <div className="p-6 space-y-5">
          
          <div className="grid grid-cols-2 gap-y-5 gap-x-4">
            <InfoItem label="Mã phòng" value={room.id} />
            <InfoItem label="Tòa nhà" value={room.building} />
            
            <InfoItem label="Loại phòng" value={room.type} />
            <InfoItem label="Sức chứa" value={`${room.max} người`} />
            
            <InfoItem label="Số người đang ở" value={`${room.current} người`} />
            
            <InfoItem label="Trạng thái">
               <Badge type={getBadgeType(room.status)}>
                 {getStatusLabel(room.status)}
               </Badge>
            </InfoItem>

            <InfoItem label="Giá phòng">
              <span className="text-green-600 font-bold">
                {formatMoney(room.price)}/tháng
              </span>
            </InfoItem>
          </div>

          {/* Dòng mô tả (Full width) */}
          <div className="pt-2 border-t border-dashed border-gray-100">
             <InfoItem label="Mô tả">
               {/* Nếu data không có mô tả thì hiện mặc định */}
               {room.description || `${room.type}, thoáng mát, sạch sẽ.`}
             </InfoItem>
          </div>
        </div>

        {/* 3. Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <Button 
            variant="white" 
            size="sm" 
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 px-6"
          >
            Đóng
          </Button>
        </div>

      </div>
    </div>
  );
}