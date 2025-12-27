import React from 'react';
import { MagnifyingGlassIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
// Button nếu cần

const ContractFilter = () => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6 space-y-4">
       {/* Header của Filter */}
       <div className="flex items-center gap-2 text-gray-900 font-bold text-sm border-b border-gray-100 pb-2">
          <FunnelIcon className="w-5 h-5 text-gray-500" />
          Bộ lọc tìm kiếm
       </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Tìm kiếm */}
        <div className="lg:col-span-3">
             <Input 
                placeholder="Tìm kiếm theo MSSV, tên sinh viên, số phòng..." 
                icon={<MagnifyingGlassIcon className="w-4 h-4" />}
            />
        </div>

        {/* 2. Trạng thái */}
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1 block">Trạng thái</label>
          <Select>
            <option value="">Tất cả trạng thái</option>
            <option value="expired">Đã hết hạn</option>
            <option value="warning">Sắp hết hạn</option>
            <option value="valid">Còn hạn</option>
          </Select>
        </div>

        {/* 3. Từ ngày */}
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1 block">Từ ngày</label>
          <input 
            type="date" 
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
          />
        </div>

        {/* 4. Đến ngày & Nút Xóa */}
        <div className="flex items-end gap-2">
            <div className="flex-1">
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Đến ngày</label>
                <input 
                    type="date" 
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                />
            </div>
            {/* Nút xóa lọc */}
            <button className="p-2.5 mb-[1px] text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Xóa bộ lọc">
                <XMarkIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
      
      {/* Kết quả tìm kiếm text */}
      <div className="pt-2">
         <p className="text-xs text-gray-500">Tìm thấy <span className="font-bold text-gray-900">6</span> hợp đồng phù hợp.</p>
      </div>
    </div>
  );
};

export default ContractFilter;