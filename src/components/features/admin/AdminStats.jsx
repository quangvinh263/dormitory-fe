import React from 'react';
import { useState,useEffect } from 'react';
import { 
  BuildingOffice2Icon, 
  UserGroupIcon, 
  UsersIcon, 
  BanknotesIcon 
} from '@heroicons/react/24/outline';
import StatCard from '../../shared/StatCard';
import {getStatsOverviewForAdmin} from '../../../services/adminApi'
const AdminStats = () => {
  // Khởi tạo state
  const [stats, setStats] = useState({
    totalStudents: 0,
    rateStudent: 0,
    totalBuilding: 0,
    totalManager: 0,
    rateManager: 0,
    totalRevenue: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // 3. Gọi qua Service đã tách biệt
        const overviewRes = await getStatsOverviewForAdmin();
        
        if (overviewRes.success && overviewRes.data) {
          setStats(overviewRes.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Helper format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Helper format phần trăm
  const formatRate = (rate) => {
    return rate > 0 ? `+${rate}%` : `${rate}%`;
  };

  if (loading) return <div className="text-center py-4">Đang tải dữ liệu...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* --- Card 1: Tổng sinh viên --- */}
      <StatCard 
        title="Tổng sinh viên"
        value={stats.totalStudents}
        subtext={`${formatRate(stats.rateStudent)} so với tháng trước`}
        isIncrease={stats.rateStudent   >= 0}
        type="default"
        icon={<UserGroupIcon className="w-6 h-6"/>}
      />

      {/* --- Card 2: Tổng số tòa --- */}
      <StatCard 
        title="Tổng số tòa"
        value={stats.totalBuilding}
        subtext="Đang hoạt động"
        type="success"
        icon={<BuildingOffice2Icon className="w-6 h-6"/>}
      />

      {/* --- Card 3: Tổng quản lý --- */}
      <StatCard
        title="Tổng quản lý"
        value={stats.totalManager}
        subtext={`${formatRate(stats.rateManager)} so với tháng trước`}
        isIncrease={stats.rateManager >= 0}
        type="default"
        icon={<UsersIcon className="w-6 h-6"/>}
      />

      {/* --- Card 4: Tổng doanh thu --- */}
      <StatCard 
        title="Tổng doanh thu tháng"
        value={formatCurrency(stats.totalRevenue)}
        subtext="Thực thu tháng này"
        type="success"
        icon={<BanknotesIcon className="w-6 h-6"/>}
      />
    </div>
  );
};

export default AdminStats;