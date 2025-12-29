import React from 'react';
import { 
  DocumentTextIcon, 
  ExclamationCircleIcon, 
  ClockIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import StatCard from '../../shared/StatCard'; 

const ContractStats = ({stats}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Tổng hợp đồng" 
        value={stats?.Total ?? 0} 
        subtext="Tất cả hợp đồng" 
        type="default" // Màu xám/đen
        icon={<DocumentTextIcon className="w-6 h-6"/>}
      />
      <StatCard 
        title="Đã hết hạn" 
        value={stats?.Expired ?? 0}
        subtext="Cần xử lý gấp" 
        type="danger" // Màu đỏ
        icon={<ExclamationCircleIcon className="w-6 h-6"/>}
      />
      <StatCard 
        title="Sắp hết hạn" 
        value={stats?.Warning ?? 0}
        subtext="Trong 14 ngày tới" 
        type="warning" // Màu cam
        icon={<ClockIcon className="w-6 h-6"/>}
      />
      <StatCard 
        title="Còn hạn" 
        value={stats?.Active ?? 0}
        subtext="Trạng thái bình thường" 
        type="success" // Màu xanh lá
        icon={<CheckCircleIcon className="w-6 h-6"/>}
      />
    </div>
  );
};

export default ContractStats;