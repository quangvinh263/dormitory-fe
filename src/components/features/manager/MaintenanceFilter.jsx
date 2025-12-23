import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Import Shared Components
import Section from '../../shared/Section'; 
import Input from '../..//ui/Input'; 
import Select from '../../ui/Select'; 
import Button from '../../ui/Button';

export default function MaintenanceFilter() {
  return (
    <Section className="mb-6">
      {/* Header Filter */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
        <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
          <FunnelIcon className="w-5 h-5 text-gray-500" />
          Bộ lọc tìm kiếm
        </div>
        <button className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors cursor-pointer">
          <XMarkIcon className="w-3 h-3" /> Xóa bộ lọc
        </button>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        
        {/* Search Input (Chiếm nhiều không gian hơn) */}
        <div className="lg:col-span-6">
          <Input 
            label="Tìm kiếm"
            placeholder="Tìm theo mã yêu cầu, phòng, sinh viên, thiết bị..." 
            icon={<MagnifyingGlassIcon className="w-4 h-4" />} 
          />
        </div>

        {/* Trạng thái */}
        <div className="lg:col-span-3">
          <Select label="Trạng thái">
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Đang chờ</option>
            <option value="processing">Đang xử lý</option>
            <option value="completed">Hoàn thành</option>
          </Select>
        </div>

        {/* Thiết bị */}
        <div className="lg:col-span-3">
          <Select label="Thiết bị">
            <option value="">Tất cả thiết bị</option>
            <option value="ac">Điều hòa</option>
            <option value="light">Bóng đèn</option>
            <option value="plumbing">Ống nước</option>
            <option value="wifi">Mạng Wifi</option>
          </Select>
        </div>
      </div>
    </Section>
  );
}