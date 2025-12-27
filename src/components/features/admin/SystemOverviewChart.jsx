import React from 'react';
import { useNavigate } from 'react-router-dom';
const SystemOverviewChart = () => {
  // Mockup: Doanh thu so sánh giữa các tòa nhà
  const buildings = [
    { name: 'Tòa A', fill: 85, revenue: 120, color: 'bg-blue-500' },
    { name: 'Tòa B', fill: 92, revenue: 150, color: 'bg-indigo-500' },
    { name: 'Tòa C', fill: 60, revenue: 90, color: 'bg-purple-500' },
    { name: 'Tòa D', fill: 45, revenue: 60, color: 'bg-pink-500' },
  ];
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-base font-bold text-gray-900">Hiệu suất các Tòa nhà</h3>
        <p className="text-sm text-gray-500 mt-1">Tỷ lệ lấp đầy & Doanh thu ước tính tháng này</p>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-6">
        {buildings.map((b, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-gray-800">{b.name}</span>
              <span className="text-gray-500">Doanh thu: <span className="font-semibold text-gray-900">{b.revenue}tr</span></span>
            </div>
            {/* Progress Bar đại diện Fill Rate */}
            <div className="w-full bg-gray-100 rounded-full h-4 relative overflow-hidden">
              <div 
                className={`h-4 rounded-full ${b.color} transition-all duration-1000`} 
                style={{ width: `${b.fill}%` }}
              ></div>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow-md">
                Lấp đầy {b.fill}%
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
        <button 
          onClick={() => navigate("/admin/reports")}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Xem báo cáo chi tiết →
        </button>
      </div>
    </div>
  );
};

export default SystemOverviewChart;