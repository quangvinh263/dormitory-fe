import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

import Section from '../../shared/Section'; 
import Button from '../../ui/Button'; 
import Input from '../../ui/Input'; 
import Select from '../../ui/Select'; 

export default function RoomFilter({ filters = {}, onFilterChange, onClearFilters }) {
  const handleInputChange = (field, value) => {
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        [field]: value
      });
    }
  };

  const handleClearFilters = () => {
    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <Section className="mb-6">
      {/* Custom Header cho Filter */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
        <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
          <FunnelIcon className="w-5 h-5 text-gray-500" />
          Bộ lọc tìm kiếm
        </div>
        
        <button 
          onClick={handleClearFilters}
          className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors cursor-pointer"
        >
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
            value={filters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
          />
        </div>

        {/* Trạng thái */}
        <div>
          <Select 
            label="Trạng thái"
            value={filters.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="empty">Còn trống</option>
            <option value="full">Đã đầy</option>
            <option value="maintenance">Bảo trì</option>
          </Select>
        </div>

         {/* Loại phòng */}
         <div>
          <Select 
            label="Loại phòng"
            value={filters.roomType || ''}
            onChange={(e) => handleInputChange('roomType', e.target.value)}
          >
            <option value="">Tất cả loại phòng</option>
            <option value="2">2 người</option>
            <option value="4">4 người</option>
            <option value="6">6 người</option>
            <option value="8">8 người</option>
          </Select>
        </div>

        {/* Sức chứa (Min - Max) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Sức chứa (Min - Max)</label>
          <div className="flex gap-2">
             <Input 
               type="number" 
               placeholder="Min" 
               className="w-full"
               value={filters.minCapacity || ''}
               onChange={(e) => handleInputChange('minCapacity', e.target.value)}
             />
             <Input 
               type="number" 
               placeholder="Max" 
               className="w-full"
               value={filters.maxCapacity || ''}
               onChange={(e) => handleInputChange('maxCapacity', e.target.value)}
             />
          </div>
        </div>
      </div>
    </Section>
  );
}