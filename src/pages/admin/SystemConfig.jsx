import React, { useState } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import UtilityConfig from '../../components/features/admin/UtilityConfig';
import InsuranceConfig from '../../components/features/admin/InsuranceConfig';

const SystemConfig = () => {
  const [activeTab, setActiveTab] = useState('utility');

  const configTabs = [
    { id: 'utility', label: 'Điện nước' },
    { id: 'insurance', label: 'Bảo hiểm' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in pb-10">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 h-auto md:h-16 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Cấu Hình Hệ Thống</h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý các thông số vận hành toàn hệ thống</p>
      </div>
  
      <Button 
          variant="primary"
          icon={<CloudArrowUpIcon />}
          className="font-bold whitespace-nowrap"
        >
          Lưu cấu hình
        </Button>
    </div>

      <div className="w-full bg-gray-100 p-1 rounded-xl inline-flex">
        {configTabs.map((tab) => (
           <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`w-full px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
           >
              {tab.label}
           </button>
        ))}
      </div>

      {/* Content Rendering */}
      <div className="mt-2">
        {activeTab === 'utility' ? (
          <UtilityConfig />
        ) : (
          <InsuranceConfig />
        )}
      </div>
    </div>
  );
};

export default SystemConfig;