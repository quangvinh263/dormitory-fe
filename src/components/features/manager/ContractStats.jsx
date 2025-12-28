import React from 'react';
import { 
  DocumentTextIcon, 
  ExclamationCircleIcon, 
  ClockIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import StatCard from '../../shared/StatCard'; 

const ContractStats = ({ contracts }) => {
  const stats = {
    total: contracts.length,
    
    // Đang hiệu lực
    active: contracts.filter(c => c.status === 'Active').length,
    
    // Sắp hết hạn
    nearExpiration: contracts.filter(c => c.status === 'NearExpiration').length,
    
    // Đã hết hạn hoặc Kết thúc
    expired: contracts.filter(c => c.status === 'Expired').length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Tổng số hợp đồng */}
      <StatCard 
        title="Tổng hợp đồng" 
        value={stats.total} 
        subtext="Tất cả hợp đồng" 
        type="default" 
        icon={<DocumentTextIcon className="w-6 h-6"/>}
      />

      {/* 2. Đã hết hạn */}
      <StatCard 
        title="Đã hết hạn/Kết thúc" 
        value={stats.expired} 
        subtext="Cần xử lý hoặc lưu trữ" 
        type="danger" // Màu đỏ
        icon={<ExclamationCircleIcon className="w-6 h-6"/>}
      />

      {/* 3. Sắp hết hạn */}
      <StatCard 
        title="Sắp hết hạn" 
        value={stats.nearExpiration} 
        subtext="Trong 30 ngày tới" 
        type="warning" // Màu cam
        icon={<ClockIcon className="w-6 h-6"/>}
      />

      {/* 4. Còn hạn */}
      <StatCard 
        title="Đang hoạt động" 
        value={stats.active} 
        subtext="Trạng thái bình thường" 
        type="success" // Màu xanh lá
        icon={<CheckCircleIcon className="w-6 h-6"/>}
      />
      
    </div>
  );
};

export default ContractStats;