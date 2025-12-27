import React from 'react';
import AdminStats from '../../components/features/admin/AdminStats';
import SystemOverviewChart from '../../components/features/admin/SystemOverviewChart';
import AdminQuickActions from '../../components/features/admin/AdminQuickAction';


export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Administrator</h1>
        <p className="text-sm text-gray-500 mt-1">Tổng quan quản trị hệ thống Ký túc xá</p>
      </div>
      {/* 1. Thống kê tổng quan */}
      <section>
        <AdminStats />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-auto">
        
        {/* Cột trái: Biểu đồ/Danh sách tòa nhà (Chiếm 3 phần) */}
        <div className="lg:col-span-3 h-auto">
          <SystemOverviewChart />
        </div>

        {/* Cột phải: Hành động nhanh (Chiếm 2 phần) */}
        <div className="lg:col-span-2 h-auto">
          <AdminQuickActions />
        </div>

      </div>
    </div>
  );
}