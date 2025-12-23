import React from 'react';
// Import StatCard từ thư mục shared (điều chỉnh đường dẫn cho đúng với dự án của bạn)
import StatCard from '../../shared/StatCard'; 

export default function UtilityStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="h-full">
          <StatCard
            title={stat.label}     
            value={stat.value}    
            subtext={stat.subtext}
            type={stat.type}      
          />
        </div>
      ))}
    </div>
  );
}