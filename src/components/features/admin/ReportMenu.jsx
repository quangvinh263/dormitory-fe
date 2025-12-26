import React from 'react';
import { 
  HomeModernIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  StarIcon, 
  WrenchScrewdriverIcon, 
  UserCircleIcon 
} from '@heroicons/react/24/outline';

const ReportMenu = ({ activeTab, onChange }) => {
  const menus = [
    { id: 'empty_rooms', label: 'Phòng trống', icon: HomeModernIcon },
    { id: 'expired_contracts', label: 'HĐ Hết hạn', icon: DocumentTextIcon },
    { id: 'all_contracts', label: 'DS Hợp đồng', icon: UserGroupIcon },
    { id: 'priority_students', label: 'SV Ưu tiên', icon: StarIcon },
    { id: 'equipment', label: 'Trang thiết bị', icon: WrenchScrewdriverIcon },
    { id: 'managers', label: 'Nhân sự BQL', icon: UserCircleIcon },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 rounded-xl w-fit mb-4">
      {menus.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === item.id 
              ? 'bg-white text-blue-700 shadow-sm font-bold ring-1 ring-black/5' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
          }`}
        >
          <item.icon className="w-4 h-4"/>
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ReportMenu;