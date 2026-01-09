import React, { useState, useEffect } from 'react';
import { HomeModernIcon, UserGroupIcon, ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline';
import StatCard from '../../shared/StatCard';
import { getStatsBuildingForAdmin } from '../../../services/adminApi';

const ReportStats = () => {
  const [stats, setStats] = useState({
    totalBeds: 0,
    usedBeds: 0,
    availableBeds: 0,
    occupancyRate: 0,
    buildingCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getStatsBuildingForAdmin();
        if (result.success && result.data) {
          const buildings = result.data;
          const totalBeds = buildings.reduce((sum, b) => sum + b.totalBeds, 0);
          const usedBeds = buildings.reduce((sum, b) => sum + b.usedBeds, 0);
          const availableBeds = totalBeds - usedBeds;
          const occupancyRate = totalBeds > 0 ? ((usedBeds / totalBeds) * 100).toFixed(1) : 0;
          
          setStats({
            totalBeds,
            usedBeds,
            availableBeds,
            occupancyRate,
            buildingCount: buildings.length
          });
        }
      } catch (error) {
        console.error('Error fetching building stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        title="Tổng số giường" 
        value={stats.totalBeds.toLocaleString('vi-VN')} 
        subtext={`${stats.buildingCount} tòa nhà`} 
        type="info"
        icon={<div className="p-2 bg-gray-100 rounded-lg"><HomeModernIcon className="w-5 h-5 text-gray-600"/></div>}
      />
      <StatCard 
        title="Đã lấp đầy" 
        value={stats.usedBeds.toLocaleString('vi-VN')} 
        subtext={`${stats.occupancyRate}% công suất`} 
        type="success"
        icon={<div className="p-2 bg-green-100 rounded-lg"><UserGroupIcon className="w-5 h-5 text-green-600"/></div>}
      />
      <StatCard 
        title="Còn trống" 
        value={stats.availableBeds.toLocaleString('vi-VN')} 
        subtext={`${(100 - stats.occupancyRate).toFixed(1)}% chưa sử dụng`} 
        type="default"
        icon={<div className="p-2 bg-orange-100 rounded-lg"><ArchiveBoxXMarkIcon className="w-5 h-5 text-orange-600"/></div>}
      />
    </div>
  );
};

export default ReportStats;