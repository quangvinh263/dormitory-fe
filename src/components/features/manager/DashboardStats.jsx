import React from 'react';
import { 
  UserGroupIcon, 
  ExclamationTriangleIcon, 
  CurrencyDollarIcon, 
  WrenchScrewdriverIcon 
} from '@heroicons/react/24/outline';

import StatCard from '../../shared/StatCard'; 

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Thay đổi: Đơn chờ duyệt -> Báo hỏng (Ưu tiên sửa chữa) */}
      <StatCard 
        title="Báo sửa chữa & vệ sinh" 
        value="4" 
        subtext="2 việc khẩn cấp" 
        icon={<WrenchScrewdriverIcon className="w-5 h-5"/>} 
        type="warning" 
      />
      
      <StatCard 
        title="Phòng trống" 
        value="18" 
        subtext="Tổng sức chứa: 200" 
        icon={<UserGroupIcon className="w-5 h-5"/>} 
      />
      
      {/* Thay đổi: Thanh toán chờ xác nhận -> Hóa đơn quá hạn (Rủi ro tài chính) */}
      <StatCard 
        title="Hóa đơn quá hạn" 
        value="5" 
        subtext="Tổng nợ: 2.500.000đ" 
        icon={<CurrencyDollarIcon className="w-5 h-5"/>} 
        type="danger" 
      />
      
      <StatCard 
        title="Cảnh báo vi phạm" 
        value="2" 
        subtext="Sắp bị chấm dứt HĐ" 
        icon={<ExclamationTriangleIcon className="w-5 h-5"/>} 
        type="danger" 
      />
    </div>
  );
}