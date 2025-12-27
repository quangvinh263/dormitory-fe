import React from 'react';
import { 
  UserGroupIcon, 
  ExclamationTriangleIcon, 
  CurrencyDollarIcon, 
  WrenchScrewdriverIcon 
} from '@heroicons/react/24/outline';

import StatCard from '../../shared/StatCard'; 

export default function DashboardStats({ data }) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Tổng sinh viên" 
        value={data.totalStudents?.toString() || "0"} 
        subtext="Đang sinh sống tại KTX" 
        icon={<ExclamationTriangleIcon className="w-5 h-5"/>} 
        type="success" 
      />
      
      <StatCard 
        title="Phòng trống" 
        value={data.availableRooms?.toString() || "0"} 
        subtext={`Tổng phòng: ${data.countRooms || 0}`} 
        icon={<UserGroupIcon className="w-5 h-5"/>} 
      />
      
      <StatCard 
        title="Hóa đơn quá hạn" 
        value={data.unpaidUtilityBills?.toString() || "0"} 
        subtext={`Tổng nợ: ${(data.totalUnpaidAmount || 0).toLocaleString('vi-VN')}đ`} 
        icon={<CurrencyDollarIcon className="w-5 h-5"/>} 
        type="danger" 
      />
      
      <StatCard 
        title="Yêu cầu sửa chữa" 
        value={data.unResolveRequests?.toString() || "0"} 
        subtext="Chưa được xử lý" 
        icon={<WrenchScrewdriverIcon className="w-5 h-5"/>} 
        type="warning" 
      />
    </div>
  );
}