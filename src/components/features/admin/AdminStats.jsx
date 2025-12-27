import React from 'react';
import { 
  BuildingOffice2Icon, 
  UserGroupIcon, 
  UsersIcon, 
  BanknotesIcon 
} from '@heroicons/react/24/outline';
import StatCard from '../../shared/StatCard';

const AdminStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Tổng sinh viên"
        value="1,234"
        subtext="+12% tháng này"
        type="default"
        icon={<UserGroupIcon className="w-6 h-6"/>}
      />
      <StatCard 
        title="Tổng số tòa"
        value="8"
        subtext="Hoạt động tốt"
        type="success"
        icon={<BuildingOffice2Icon className="w-6 h-6"/>}
      />
      <StatCard
        title="Tổng nhân viên"
        value="45"
        subtext="+5% so với tháng trước"
        type="default"
        icon={<UsersIcon className="w-6 h-6"/>}
      />
      <StatCard 
        title="Tổng doanh thu"
        value="2.3B VND"
        subtext="Toàn hệ thống"
        type="success"
        icon={<BanknotesIcon className="w-6 h-6"/>}
      />
    </div>
  );
};

export default AdminStats;