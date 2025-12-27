// src/features/manager/dashboard/ManagerDashboard.jsx
import React, { useState, useEffect } from 'react';
// Import các module con vừa tạo
import DashboardStats from '../../components/features/manager/DashboardStats';
import RoomMatrix from '../../components/features/manager/RoomMatrix';
import OperationalPanel from '../../components/features/manager/OperationalPanel';
import { getViolationStatsForManager } from '../../services/managerApi';

export default function ManagerDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const accountId = localStorage.getItem('accountId');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getViolationStatsForManager(accountId);
        console.log('Dashboard API Response:', response);
        
        if (response.success) {
          setDashboardData(response.data);
          setError(null);
        } else {
          setError(response.message || 'Không thể tải dữ liệu dashboard');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchDashboardData();
    } else {
      setError('Không tìm thấy thông tin tài khoản');
      setLoading(false);
    }
  }, [accountId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* 1. Module Thống kê */}
      <DashboardStats data={dashboardData} />

      {/* 2. Module Sơ đồ phòng */}
      <RoomMatrix />

      {/* 3. Module Tác vụ vận hành (Sổ đen + Kiểm tra TS) */}
      <OperationalPanel />
      
    </div>
  );
}