import React, { useState } from 'react';
import { 
  HomeModernIcon, 
  UserGroupIcon, 
  NoSymbolIcon, 
  WrenchScrewdriverIcon 
} from '@heroicons/react/24/outline';

import StatCard from '../../components/shared/StatCard';
import Section from '../../components/shared/Section';

import RoomFilter from '../../components/features/manager/RoomFilter';
import RoomCard from '../../components/features/manager/RoomCard';
import RoomDetailModal from '../../components/features/manager/RoomDetailModal';

export default function RoomDashboard() {
 
  const [selectedRoom, setSelectedRoom] = useState(null);

  const statsData = [
    { label: 'Tổng số phòng', value: '132', type: 'default', icon: <HomeModernIcon className="w-6 h-6"/> },
    { label: 'Còn trống', value: '109', type: 'success', icon: <UserGroupIcon className="w-6 h-6"/> },
    { label: 'Đã đầy', value: '23', type: 'default', icon: <NoSymbolIcon className="w-6 h-6"/> },
    { label: 'Bảo trì/Dọn dẹp', value: '0', type: 'warning', icon: <WrenchScrewdriverIcon className="w-6 h-6"/> },
  ];

  const [rooms] = useState([
    {
      id: 'C1.05', building: 'Tòa C (Khu CLC)',
      status: 'Full', type: 'Phòng 2 người',
      current: 2, max: 2, price: 2500000,
    },
    {
      id: 'C1.07', building: 'Tòa C (Khu CLC)',
      status: 'Full', type: 'Phòng 2 người',
      current: 2, max: 2, price: 2000000,
    },
    {
      id: 'C3.06', building: 'Tòa C (Khu CLC)',
      status: 'Empty', type: 'Phòng 4 người',
      current: 1, max: 4, price: 1500000,
    },
    {
      id: 'C3.08', building: 'Tòa C (Khu CLC)',
      status: 'Maintenance', type: 'Phòng 2 người',
      current: 0, max: 2, price: 2000000,
    },
    {
      id: 'A1.01', building: 'Tòa A (Khu Thường)',
      status: 'Empty', type: 'Phòng 6 người',
      current: 3, max: 6, price: 800000,
    },
  ]);

  return (
    <div className="animate-fade-in-up space-y-6">
      
      {/* Header Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Phòng</h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý thông tin phòng ở và trạng thái sử dụng</p>
      </div>

      {/* MODULE 1: THỐNG KÊ (Dùng StatCard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <div key={index} className="h-full">
            <StatCard
              title={stat.label}
              value={stat.value}
              type={stat.type}
              icon={stat.icon}
            />
          </div>
        ))}
      </div>

      {/* MODULE 2: BỘ LỌC */}
      <RoomFilter />

      {/* MODULE 3: DANH SÁCH PHÒNG (Dùng Section bọc lại) */}
      <Section title={`Danh sách phòng (${rooms.length})`}>
        
        {/* Subheader bên trong Section */}
        <div className="mb-5 text-xs text-gray-500 -mt-4">
          Hiển thị {rooms.length} trên tổng số 132 phòng
        </div>

        {/* Grid Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {rooms.map((room) => (
            <RoomCard 
              key={room.id} 
              room={room}
              onClick={() => setSelectedRoom(room)} 
            />
          ))}
        </div>
      </Section>

      <RoomDetailModal 
        isOpen={!!selectedRoom}      
        room={selectedRoom}    
        onClose={() => setSelectedRoom(null)}
      />

    </div>
  );
}