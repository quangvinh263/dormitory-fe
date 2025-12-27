import React, { useState } from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const InsuranceConfig = () => {
  const [config, setConfig] = useState({
    price: 250000,
    startDate: '2024-08-01',
    endDate: '2024-08-31',
  });

  const handleChange = (field, val) => {
    setConfig((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm animate-fade-in flex flex-col gap-6">
      
      {/* 1. Header Section */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-green-50 rounded-xl text-green-600">
          <ShieldCheckIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-md font-bold text-gray-900">Cấu Hình Tiền BHYT</h3>
          <p className="text-sm text-gray-500">Thiết lập đơn giá BHYT</p>
        </div>
      </div>

      {/* 2. Form Body */}
      <div className="flex flex-col gap-6">
        
        {/* Giá BHYT */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-700">Giá BHYT (VND/năm)</label>
          <div className="relative w-full flex items-center">
            <input
              type="number"
              value={config.price}
              onChange={(e) => handleChange('price', e.target.value)}
              className={"block w-full px-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"}
            />
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 text-xs font-bold whitespace-nowrap">
              VND
            </span>
          </div>
          <p className="text-xs text-gray-400 italic font-normal">Chi phí bảo hiểm y tế cho sinh viên</p>
        </div>

        {/* Thời gian đăng ký - 2 cột trên md */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">Ngày bắt đầu đăng ký</label>
            <input
              type="date"
              value={config.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className={"block w-full px-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">Ngày kết thúc đăng ký</label>
            <input
              type="date"
              value={config.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className={"block w-full px-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"}
            />
          </div>
        </div>

        {/* 3. Box Thông tin thời gian */}
        <div className="bg-green-50/50 rounded-xl p-5 border border-green-100 mt-2">
          <h4 className="text-sm font-bold text-green-800 mb-2 flex items-center gap-2">
            Thời gian đăng ký dự kiến:
          </h4>
          <div className="text-sm text-green-900/80 font-normal leading-5">
            <p>Sinh viên có thể thực hiện đăng ký và nộp phí BHYT trong khoảng thời gian:</p>
            <div className="mt-2 py-2 px-4 bg-white/60 rounded-lg border border-green-200 inline-block font-bold text-green-700">
              Từ {new Date(config.startDate).toLocaleDateString('vi-VN')} đến {new Date(config.endDate).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InsuranceConfig;