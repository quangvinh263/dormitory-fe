// src/features/manager/dashboard/ManagerDashboard.jsx
import React from 'react';
// Import các module con vừa tạo
import DashboardStats from '../../components/features/manager/DashboardStats';
import RoomMatrix from '../../components/features/manager/RoomMatrix';
import OperationalPanel from '../../components/features/manager/OperationalPanel';

export default function ManagerDashboard() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* 1. Module Thống kê */}
      <DashboardStats />

      {/* 2. Module Sơ đồ phòng */}
      <RoomMatrix />

      {/* 3. Module Tác vụ vận hành (Sổ đen + Kiểm tra TS) */}
      <OperationalPanel />
      
    </div>
  );
}