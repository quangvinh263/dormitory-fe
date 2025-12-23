import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

// Import Shared UI
import Section from '../../shared/Section';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Button from '../../ui/Button';

export default function ViolationFilter({filters, onOpenCreateModal}) {


  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6 space-y-4">
      
      {/* Header Filter + Action Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
          <FunnelIcon className="w-5 h-5 text-gray-500" />
          Bộ lọc & Thao tác
        </div>
        
        {/* Nút Lập biên bản (Quan trọng) */}
        <Button 
          variant="primary" 
          size="sm" 
          icon={<PlusIcon className="w-4 h-4"/>}
          onClick={onOpenCreateModal}
          className="bg-gray-900 hover:bg-gray-800 text-white border-transparent shadow-gray-200"
        >
          Lập biên bản
        </Button>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Search */}
        <div className="lg:col-span-1">
          <Input 
            placeholder="Tìm theo mã BB, MSSV, tên SV..." 
            icon={<MagnifyingGlassIcon className="w-4 h-4" />}
          />
        </div>

         {/* Số tầng */}
        <div className="lg:col-span-1">
          <Select
          >
            <option value="">Tất cả số tầng</option>
            <option value="1">Tầng 1</option>
            <option value="2">Tầng 2</option>
          </Select>
        </div>

        {/* Thời gian */}
        <div className="lg:col-span-1 flex items-center gap-2">
          <div className= "flex-1">
            <Select
            >
              <option value="">Tất cả thời gian</option>
              <option value="this_month">Tháng này</option>
              <option value="last_month">Tháng trước</option>
            </Select>
          </div>
          {/* Xóa lọc */}
          <button
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0" 
            title="Xóa bộ lọc"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}