import React from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';

// Import UI Components
import Badge from '../../ui/Badge'; 
import Button from '../../ui/Button'; 

export default function RoomCard({ room, onClick }) {
  const formatMoney = (amount) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const getCardStyle = (status) => {
    switch (status) {
      case 'Empty': return 'bg-green-50 border-green-200 hover:border-green-300';
      case 'Maintenance': return 'bg-orange-50 border-orange-200 hover:border-orange-300';
      case 'Full': default: return 'bg-gray-50 border-gray-200 hover:border-gray-300';
    }
  };


  const getCustomBadgeStyle = (status) => {
    const baseStyle = "rounded px-2.5 py-0.5 border-0 text-white font-bold"; 
    switch (status) {
      case 'Empty':
        return `${baseStyle} bg-green-600`; 
      case 'Maintenance':
        return `${baseStyle} bg-orange-600`;
      case 'Full':
      default:
        return `${baseStyle} bg-gray-600`;
    }
  };

  const cardStyle = getCardStyle(room.status);
  const badgeClass = getCustomBadgeStyle(room.status);

  const getStatusLabel = (status) => {
    if (status === 'Empty') return 'Còn trống';
    if (status === 'Maintenance') return 'Bảo trì';
    return 'Đã đầy';
  };

  return (
    <div className={`rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col gap-4 ${cardStyle}`}>
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{room.id}</h3>
          <p className="text-xs text-gray-600 mt-0.5">{room.building}</p>
        </div>
        <Badge className={badgeClass}>
           {getStatusLabel(room.status)}
        </Badge>
      </div>

      {/* Body Info */}
      <div className="space-y-2 text-xs text-gray-700">
        <div className="flex justify-between items-center">
          <span className="opacity-70">Loại phòng:</span>
          <span className="font-semibold">{room.type}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="opacity-70">Sức chứa:</span>
          <span className="font-semibold">{room.current}/{room.max} người</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="opacity-70">Giá phòng:</span>
          <span className="font-bold text-blue-700 text-sm">{formatMoney(room.price)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-1">
        <div className="flex justify-between text-[10px] text-gray-600 mb-1.5">
          <span>Tỷ lệ lấp đầy</span>
          <span className="font-medium">{Math.round((room.current / room.max) * 100)}%</span>
        </div>
        <div className="w-full bg-white border border-gray-100 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              room.status === 'Full' ? 'bg-gray-500' : (room.status === 'Maintenance' ? 'bg-orange-400' : 'bg-green-500')
            }`} 
            style={{ width: `${(room.current / room.max) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Footer: Action Button */}
      <div className="mt-auto pt-2">
        <Button 
          variant="white" 
          size="sm" 
          className="w-full border-transparent shadow-sm hover:scale-[1.02]"
          icon={<EyeIcon className="w-4 h-4 text-gray-500"/>}
          onClick={onClick}  
        >
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
}