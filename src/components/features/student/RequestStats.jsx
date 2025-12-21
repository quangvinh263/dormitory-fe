import { ClipboardDocumentListIcon, ClockIcon, WrenchScrewdriverIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function RequestStats({ stats }) {
  const items = [
    { 
      label: 'Tổng yêu cầu', 
      value: stats.total, 
      sub: 'Tất cả yêu cầu', 
      icon: <ClipboardDocumentListIcon className="w-5 h-5 text-gray-500"/>,
      color: 'text-gray-900',
      borderColor: 'border-gray-200'
    },
    { 
      label: 'Đang chờ', 
      value: stats.pending, 
      sub: 'Chờ xử lý', 
      icon: <ClockIcon className="w-5 h-5 text-yellow-600"/>,
      color: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    { 
      label: 'Đang xử lý', 
      value: stats.processing, 
      sub: 'Đang sửa chữa', 
      icon: <WrenchScrewdriverIcon className="w-5 h-5 text-blue-600"/>,
      color: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    { 
      label: 'Hoàn thành', 
      value: stats.done, 
      sub: 'Đã xử lý', 
      icon: <CheckCircleIcon className="w-5 h-5 text-green-600"/>,
      color: 'text-green-600',
      borderColor: 'border-green-200'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {items.map((item, index) => (
        <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
           <div className="flex justify-between items-start mb-4">
              <span className="text-md font-medium text-gray-500">{item.label}</span>
              <div className="p-1.5 bg-gray-50 rounded-lg">{item.icon}</div>
           </div>
           <div>
              <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-xs text-gray-400 mt-1">{item.sub}</div>
           </div>
        </div>
      ))}
    </div>
  );
}