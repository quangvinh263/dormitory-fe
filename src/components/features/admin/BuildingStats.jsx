import React from 'react';
import { 
  BuildingOfficeIcon, 
  CheckCircleIcon, 
  NoSymbolIcon, 
  WrenchScrewdriverIcon 
} from '@heroicons/react/24/outline';
import StatCard from '../../shared/StatCard';

const BuildingStats = ({ stats = {} }) => {
  
  // Sử dụng dữ liệu từ API với giá trị mặc định
  const {
    totalRooms = 0,
    totalAvailableRooms = 0,
    totalFullRooms = 0,
    totalMaintenanceRooms = 0
  } = stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      
      {/* CARD 1: TỔNG SỐ PHÒNG (Blue/Info) */}
      <StatCard 
        title="Tổng số phòng"
        value={totalRooms}
        subtext="Toàn bộ hệ thống"
        type="info" 
        icon={<BuildingOfficeIcon className="w-6 h-6" />}
      />

      {/* CARD 2: CÒN TRỐNG (Green/Success) */}
      <StatCard 
        title="Còn trống"
        value={totalAvailableRooms}
        subtext="Sẵn sàng đón khách"
        type="success"
        icon={<CheckCircleIcon className="w-6 h-6" />}
      />

      {/* CARD 3: ĐÃ ĐẦY (Gray/Default) */}
      <StatCard 
        title="Đã đầy"
        value={totalFullRooms}
        subtext="Hết chỗ trống"
        type="default"
        icon={<NoSymbolIcon className="w-6 h-6" />}
      />

      {/* CARD 4: BẢO TRÌ (Orange/Warning) */}
      <StatCard 
        title="Bảo trì / Dọn dẹp"
        value={totalMaintenanceRooms}
        subtext="Tạm ngưng phục vụ"
        type="warning"
        icon={<WrenchScrewdriverIcon className="w-6 h-6" />}
      />

    </div>
  );
};

export default BuildingStats;