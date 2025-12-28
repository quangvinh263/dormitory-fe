import React from 'react';
import { MagnifyingGlassIcon, TrashIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Input from '../../ui/Input';
import Select from '../../ui/Select';

const ContractFilter = ({ filters, setFilterParams }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFilterParams({
      keyword: '',
      buildingName: '',
      status: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6">
      
      {/* Header nhỏ */}
      <div className="flex items-center gap-2 text-gray-900 font-bold text-sm border-b border-gray-100 pb-2 mb-4">
          <FunnelIcon className="w-5 h-5 text-gray-500" />
          Bộ lọc tìm kiếm
      </div>

      {/* GRID LAYOUT: Chia làm 12 cột trên màn hình lớn */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        
        {/* 1. Tìm kiếm (Chiếm 4/12 cột) */}
        <div className="lg:col-span-4">
             <label className="text-xs font-semibold text-gray-700 mb-1 block">Từ khóa</label>
             <Input 
                name="keyword" 
                value={filters.keyword}
                onChange={handleChange}
                placeholder="Tìm MSSV, tên, phòng..." 
                icon={<MagnifyingGlassIcon className="w-4 h-4" />}
            />
        </div>

        {/* 2. Trạng thái (Chiếm 2/12 cột) */}
        <div className="lg:col-span-2">
          <label className="text-xs font-semibold text-gray-700 mb-1 block">Trạng thái</label>
          <Select 
            name="status" 
            value={filters.status} 
            onChange={handleChange}
          >
            <option value="">Tất cả</option>
            <option value="Expired">Đã hết hạn</option> 
            <option value="NearExpiration">Sắp hết hạn</option>
            <option value="Active">Đang hiệu lực</option>
          </Select>
        </div>

        {/* 3. Từ ngày (Chiếm 2/12 cột) */}
        <div className="lg:col-span-2">
          <label className="pl-1 text-xs font-semibold text-gray-700 mb-1 block">Từ ngày</label>
          <input 
            type="date" 
            name="startDate"
            value={filters.startDate || ''}
            onChange={handleChange}
            className="w-full h-[38px] text-sm border border-gray-200 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
          />
        </div>

        {/* 4. Đến ngày (Chiếm 2/12 cột) */}
        <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Đến ngày</label>
            <input 
                type="date" 
                name="endDate"
                value={filters.endDate || ''} 
                onChange={handleChange}
                className="w-full h-[38px] text-sm border border-gray-200 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
            />
        </div>

        {/* 5. Nút Xóa (Chiếm 2/12 cột còn lại) */}
        <div className="lg:col-span-2  flex pt-5 ">
            <button 
                onClick={handleReset}
                className="w-full h-[38px] flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 font-medium rounded-lg transition-colors text-sm"
            >
                <TrashIcon className="w-4 h-4" />
                Xóa bộ lọc
            </button>
        </div>

      </div>
    </div>
  );
};

export default ContractFilter;