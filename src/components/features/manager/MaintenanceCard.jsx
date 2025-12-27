import React from 'react';
import { 
  CalendarDaysIcon, 
  CurrencyDollarIcon, 
  WrenchScrewdriverIcon, 
  UserIcon,
  HomeModernIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

// Import UI Components
import Badge from '../../ui/Badge'; 
import Button from '../../ui/Button'; 

export default function MaintenanceCard({ request, onAction }) {
  const formatMoney = (amount) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  // Helper: Chọn Badge Type và Label
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Pending': 
        return { type: 'warning', label: 'Đang chờ' }; // Vàng/Cam
      case 'Processing': 
        return { type: 'info', label: 'Đang xử lý' }; // Xanh dương
      case 'Confirmed':
        return { type: 'confirm', label: 'Đã xác nhận' }; // Xanh dương
      case 'Completed': 
        return { type: 'success', label: 'Hoàn thành' }; // Xanh lá
      case 'Wait Payment': 
        return { type: 'wait', label: 'Chờ thanh toán' }; // Xanh lá
      default: 
        return { type: 'default', label: 'Khác' };
    }
  };

  const statusConfig = getStatusConfig(request.status);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 items-start md:items-center">
      
      {/* 1. Cột Thông tin chính (Trái) */}
      <div className="flex-1 space-y-3 w-full">
        
        {/* Header: Mã yêu cầu + Badge Trạng thái */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-900">{request.maintenanceID}</span>
          <Badge type={statusConfig.type}>{statusConfig.label}</Badge>
        </div>

        {/* Thông tin Phòng + Sinh viên (Dòng 1) */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <HomeModernIcon className="w-4 h-4 text-gray-400" />
            <span className="font-bold">Phòng:</span> 
            <span>{request.roomName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <UserIcon className="w-4 h-4 text-gray-400" />
            <span className="font-bold">Sinh viên:</span> 
            <span>{request.studentName} <span className="text-gray-400"></  span></span>
          </div>
        </div>

        {/* Thông tin Thiết bị + Mô tả lỗi (Dòng 2) */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <WrenchScrewdriverIcon className="w-4 h-4 text-gray-400 mt-0.5" />
            <span className="font-bold">Thiết bị:</span> 
            <span>{request.equipmentName}</span>
          </div>
          <div className="pt-2 flex items-center gap-1.5 text-xs text-gray-600">
            {/* Icon cho mô tả (nhớ import) */}
            <DocumentTextIcon className="w-4 h-4 text-gray-400 mt-0.5" /> 
            <span className="font-bold ">Mô tả:</span>
            <span> {request.description}</span>
          </div>
        </div>

        {/* Ngày tháng + Chi phí (Dòng 3) */}
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
          <div className="flex items-center gap-1.5">
            <CalendarDaysIcon className="w-3.5 h-3.5" />
            <span>{request.issueDate}</span>
          </div>
          <div className="pt-1 flex items-center gap-1.5 text-blue-600 font-medium">
            <CurrencyDollarIcon className="w-3.5 h-3.5 gap-1.5" />
            <span>{request.repairCost > 0 ? formatMoney(request.repairCost) : '0 ₫'}</span>
          </div>
        </div>
      </div>

      {/* 2. Cột Hành động (Phải) */}
      <div className="w-full md:w-auto flex justify-center">
        <Button 
          variant="white" 
          size="sm" 
          className="border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
          onClick={() => onAction(request)}
        >
          Cập nhật
        </Button>
      </div>

    </div>
  );
}