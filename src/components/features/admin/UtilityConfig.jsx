import React, { useState, useMemo } from 'react';
import { BoltIcon } from '@heroicons/react/24/outline';

const UtilityConfig = () => {
  const [config, setConfig] = useState({ elec: 3500, water: 15000, maintain: 50000 });

  const formatVND = (v) => new Intl.NumberFormat('vi-VN').format(v);
  const totalExample = useMemo(() => (100 * config.elec) + (5 * config.water) + config.maintain, [config]);

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
          <BoltIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-md font-bold text-gray-900">Cấu Hình Tiền Điện Nước</h3>
          <p className="text-sm text-gray-500">Thiết lập đơn giá và phí dịch vụ hàng tháng</p>
        </div>
      </div>

      {/* 2. Form Body - Xếp chồng dọc với VND ở cuối Input */}
      <div className="flex flex-col gap-6">
        
        {/* Giá điện */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Giá điện (đ/kWh)</label>
          <div className="relative flex items-center">
            <input
              type="number"
              className="block w-full pl-3 pr-12 py-2.5 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              value={config.elec}
              onChange={(e) => setConfig({ ...config, elec: Number(e.target.value) })}
            />
            <span className="absolute right-3 text-gray-400 text-xs font-bold pointer-events-none whitespace-nowrap">
              VND
            </span>
          </div>
          <p className="text-xs text-gray-400 italic font-normal">Giá tiền điện tính theo kWh</p>
        </div>

        {/* Giá nước */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Giá nước (đ/m³)</label>
          <div className="relative flex items-center">
            <input
              type="number"
              className="block w-full pl-3 pr-12 py-2.5 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              value={config.water}
              onChange={(e) => setConfig({ ...config, water: Number(e.target.value) })}
            />
            <span className="absolute right-3 text-gray-400 text-xs font-bold pointer-events-none whitespace-nowrap">
              VND
            </span>
          </div>
          <p className="text-xs text-gray-400 italic font-normal">Giá tiền nước tính theo m³</p>
        </div>
      </div>

      {/* Info Box - Đồng bộ style với trang Tài chính */}
      <div className=" bg-blue-50/50 rounded-2xl p-5 border border-blue-100 mt-4">
        <h4 className="text-md font-bold text-blue-800 mb-3 flex items-center gap-2">
           Ví dụ tính toán dự kiến
        </h4>
        <div className="text-sm text-blue-900/80 space-y-2">
            <p>Phòng tiêu thụ <span className="font-bold text-blue-700">100 kWh</span> điện và <span className="font-bold text-blue-700">5 m³</span> nước:</p>
            <div className="grid grid-cols-2 gap-2 text-sm border-t border-blue-200/40 pt-3">
                <span>Tiền điện: 100 × {formatVND(config.elec)}</span>
                <span className="text-right font-bold">{formatVND(100 * config.elec)}đ</span>
                <span>Tiền nước: 5 × {formatVND(config.water)}</span>
                <span className="text-right font-bold">{formatVND(5 * config.water)}đ</span>

            </div>
            <div className="flex justify-between items-center text-lg font-bold text-blue-700 border-t border-blue-200 pt-3 mt-1">
                <span>Tổng tiền dự kiến:</span>
                <span>{formatVND(totalExample)}đ</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UtilityConfig;