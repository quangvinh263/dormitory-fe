import React from 'react';
import { 
  ExclamationTriangleIcon, 
  UserGroupIcon, 
  ClipboardDocumentCheckIcon,
  ChartPieIcon 
} from '@heroicons/react/24/outline';

// Import Shared Component
import StatCard from '../../shared/StatCard';

export default function ViolationStats() {
  const stats = [
    { 
      label: 'Tổng vi phạm', 
      value: '3', 
      subtext: 'Tất cả thời gian', 
      type: 'default',
      icon: <ClipboardDocumentCheckIcon className="w-6 h-6 text-gray-400"/>
    },
    { 
      label: 'Vi phạm tháng này', 
      value: '5', 
      subtext: '+2 so với tháng trước', 
      type: 'warning', // Màu cam
      icon: <ExclamationTriangleIcon className="w-6 h-6 text-orange-400"/>
    },
    { 
      label: 'Sinh viên có 2 vi phạm', 
      value: '2', 
      subtext: 'Cần theo dõi', 
      type: 'danger', // Màu đỏ
      icon: <UserGroupIcon className="w-6 h-6 text-red-400"/>
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="h-full">
          <StatCard
            title={stat.label}
            value={stat.value}
            subtext={stat.subtext}
            type={stat.type}
            icon={stat.icon}
          />
        </div>
      ))}
    </div>
  );
}