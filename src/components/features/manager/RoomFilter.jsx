import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

import Section from '../../shared/Section'; 
import Button from '../../ui/Button'; 
import Input from '../../ui/Input'; 
import Select from '../../ui/Select'; 

export default function RoomFilter() {
  return (
    <Section className="mb-6">
      {/* Custom Header cho Filter */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
        <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
          <FunnelIcon className="w-5 h-5 text-gray-500" />
          Bộ lọc tìm kiếm
        </div>
        
        <button className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors cursor-pointer">
          <XMarkIcon className="w-4 h-4" /> Xóa bộ lọc
        </button>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Tìm kiếm */}
        <div className="lg:col-span-2">
          <Input 
            label="Tìm kiếm"
            placeholder="Tìm theo mã phòng, tòa nhà..." 
            icon={<MagnifyingGlassIcon className="w-4 h-4" />} 
          />
        </div>

        {/* Trạng thái */}
        <div>
          <Select label="Trạng thái">
            <option value="">Tất cả trạng thái</option>
            <option value="empty">Còn trống</option>
            <option value="full">Đã đầy</option>
            <option value="maintenance">Bảo trì</option>
          </Select>
        </div>

         {/* Loại phòng */}
         <div>
          <Select label="Loại phòng">
            <option value="">Tất cả loại phòng</option>
            <option value="2">2 người</option>
            <option value="4">4 người</option>
            <option value="6">6 người</option>
          </Select>
        </div>

        {/* Sức chứa (Min - Max) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Sức chứa (Min - Max)</label>
          <div className="flex gap-2">
             <Input type="number" placeholder="Min" className="w-full" />
             <Input type="number" placeholder="Max" className="w-full" />
          </div>
        </div>
      </div>
    </Section>
  );
}