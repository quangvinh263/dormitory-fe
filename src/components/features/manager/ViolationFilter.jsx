import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

// Import Shared UI
import Section from '../../shared/Section';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Button from '../../ui/Button';

export default function ViolationFilter({ filters, onFilterChange, onOpenCreateModal, violations = [] }) {
  
  // Tạo danh sách số lần vi phạm từ dữ liệu
  const violationCounts = React.useMemo(() => {
    const counts = new Set();
    violations.forEach(v => {
      if (v.totalViolations) {
        counts.add(v.totalViolations);
      }
    });
    return Array.from(counts).sort((a, b) => a - b);
  }, [violations]);

  // Handle clear filters
  const handleClearFilters = () => {
    onFilterChange('search', '');
    onFilterChange('violationCount', '');
    onFilterChange('period', '');
  };

  // Check if any filters are active
  const hasActiveFilters = filters.search || filters.violationCount || filters.period;

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
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>

         {/* Số lần vi phạm */}
        <div className="lg:col-span-1">
          <Select
            value={filters.violationCount || ''}
            onChange={(e) => onFilterChange('violationCount', e.target.value)}
          >
            <option value="">Tất cả số lần vi phạm</option>
            {violationCounts.map(count => (
              <option key={count} value={count}>
                {count === 1 ? '1 lần' : count === 2 ? '2 lần' : `${count} lần`}
                {count >= 2 && ' (Cảnh báo)'}
              </option>
            ))}
          </Select>
        </div>

        {/* Thời gian */}
        <div className="lg:col-span-1 flex items-center gap-2">
          <div className= "flex-1">
            <Select
              value={filters.period || ''}
              onChange={(e) => onFilterChange('period', e.target.value)}
            >
              <option value="">Tất cả thời gian</option>
              <option value="this_month">Tháng này</option>
              <option value="last_month">Tháng trước</option>
              <option value="this_week">Tuần này</option>
              <option value="yesterday">Hôm qua</option>
            </Select>
          </div>
          {/* Xóa lọc */}
          <button
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
              hasActiveFilters 
                ? 'text-red-500 hover:bg-red-50' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Xóa bộ lọc"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Bộ lọc đang áp dụng:</span>
          
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Tìm kiếm: "{filters.search}"
              <button 
                onClick={() => onFilterChange('search', '')}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.violationCount && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
              {filters.violationCount === '1' ? '1 lần' : filters.violationCount === '2' ? '2 lần' : `${filters.violationCount} lần`}
              <button 
                onClick={() => onFilterChange('violationCount', '')}
                className="hover:bg-orange-200 rounded-full p-0.5"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.period && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {filters.period === 'this_month' ? 'Tháng này' : 
               filters.period === 'last_month' ? 'Tháng trước' :
               filters.period === 'this_week' ? 'Tuần này' : 'Hôm qua'}
              <button 
                onClick={() => onFilterChange('period', '')}
                className="hover:bg-green-200 rounded-full p-0.5"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}