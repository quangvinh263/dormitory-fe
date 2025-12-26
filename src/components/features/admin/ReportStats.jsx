import React from 'react';
import { HomeModernIcon, UserGroupIcon, ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline';
import StatCard from '../../shared/StatCard';

const ReportStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        title="Tổng số phòng" 
        value="1,092" 
        subtext="8 tòa nhà" 
        type="info"
        icon={<div className="p-2 bg-gray-100 rounded-lg"><HomeModernIcon className="w-5 h-5 text-gray-600"/></div>}
      />
      <StatCard 
        title="Đã lấp đầy" 
        value="950" 
        subtext="87% công suất" 
        type="success"
        icon={<div className="p-2 bg-green-100 rounded-lg"><UserGroupIcon className="w-5 h-5 text-green-600"/></div>}
      />
      <StatCard 
        title="Còn trống" 
        value="142" 
        subtext="13% chưa sử dụng" 
        type="default"
        icon={<div className="p-2 bg-orange-100 rounded-lg"><ArchiveBoxXMarkIcon className="w-5 h-5 text-orange-600"/></div>}
      />
    </div>
  );
};

export default ReportStats;