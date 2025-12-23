import React, { useState } from 'react';
import { 
  CalendarDaysIcon, 
  CurrencyDollarIcon, 
  WrenchScrewdriverIcon, 
  UserIcon
} from '@heroicons/react/24/outline';

import StatCard from '../../components/shared/StatCard';

import MaintenanceFilter from '../../components/features/manager/MaintenanceFilter';
import MaintenanceCard from '../../components/features/manager/MaintenanceCard';
import MaintenanceDetailModal from '../../components/features/manager/MaintenceDetailModal';

export default function MaintenanceDashboard() {
  
    const [selectedRequest, setSelectedRequest] = useState(null);

    const handleOpenModal = (request) => {
    setSelectedRequest(request);
    };

    const handleCloseModal = () => {
        setSelectedRequest(null);
    };
    
    const statsData = [
        { label: 'Tổng yêu cầu', value: '24', type: 'default', subtext:'Tất cả yêu cầu' ,icon: <WrenchScrewdriverIcon className="w-6 h-6"/> },
        { label: 'Chờ xử lý', value: '8', type: 'warning', subtext:'Cần xem xét', icon: <CalendarDaysIcon className="w-6 h-6"/> },
        { label: 'Đang xử lý', value: '10', type: 'info', subtext:'Đang sửa chữa & vệ sinh', icon: <CurrencyDollarIcon className="w-6 h-6"/> },
        { label: 'Hoàn thành', value: '6', type: 'success', subtext:'Yêu cầu đã hoàn thành', icon: <UserIcon className="w-6 h-6"/> },
        { label: 'Tổng chi phí', value: '5,000,000 VND', type: 'default', subtext:'Tổng chi phí sửa chữa', icon: <CurrencyDollarIcon className="w-6 h-6"/> },
    ];
  // MOCK DATA
  const [requests] = useState([
    {
      RequestID: 'MNT_001',
      RoomID: 'A1.01',
      StudentName: 'Trần Thị B',
      StudentID: 'STU_001',
      EquipmentID: 'Điều hòa Panasonic 2HP',
      Description: 'Điều hòa không hoạt động, cần kiểm tra sửa chữa gấp',
      RequestDate: '17/12/2025',
      RepairCost: 0,
      Status: 'Pending',
      ManagerNote: ''
    },
    {
      RequestID: 'MNT_002',
      RoomID: 'A3.01',
      StudentName: 'Nguyễn Văn A',
      StudentID: 'STU_002',
      EquipmentID: 'Vòi nước Lavabo',
      Description: 'Vòi nước bị hỏng, nước chảy yếu',
      RequestDate: '17/12/2025',
      RepairCost: 150000,
      Status: 'Processing',
      ManagerNote: 'Đã gọi thợ sửa ống nước, hẹn chiều nay qua.'
    },
    {
      RequestID: 'MNT_003',
      RoomID: 'A1.01',
      StudentName: 'Trần Thị B',
      StudentID: 'STU_001',
      EquipmentID: 'Bóng đèn LED 1.2m',
      Description: 'Đèn trong phòng không sáng, nghi hỏng bóng đèn',
      RequestDate: '07/12/2025',
      RepairCost: 50000,
      ResolvedDate: '08/12/2025',
      Status: 'Done',
      ManagerNote: 'Đã thay bóng mới.'
    }
  ]);

  return (
    <div className="animate-fade-in-up space-y-6">
      
      {/* 1. Header Page */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Yêu Cầu Sửa Chữa</h1>
        <p className="text-sm text-gray-500 mt-1">Xử lý các yêu cầu sửa chữa, bảo trì từ sinh viên</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statsData.map((stat, index) => (
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

      {/* 2. Bộ lọc */}
      <MaintenanceFilter />

      {/* 3. Danh sách yêu cầu */}
      <div className="space-y-4">
        {/* Header List */}
        <div className="flex justify-between items-center px-1">
          <h2 className="text-sm font-bold text-gray-700">Danh sách yêu cầu ({requests.length})</h2>
        </div>

        {/* Render List */}
        {requests.map((req) => (
          <MaintenanceCard key={req.RequestID} request={req} onAction={handleOpenModal} />
        ))}
        
        {/* Empty State */}
        {requests.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-sm">Chưa có yêu cầu sửa chữa nào.</p>
          </div>
        )}
      </div>   

      {selectedRequest && (
        <MaintenanceDetailModal 
          request={selectedRequest} 
          onClose={handleCloseModal} 
        />
      )} 

    </div>
  );
}