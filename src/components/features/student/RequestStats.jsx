import { 
  ClipboardDocumentListIcon, 
  ClockIcon, 
  WrenchScrewdriverIcon, 
  CheckCircleIcon, 
  BanknotesIcon,
  CheckBadgeIcon 
} from '@heroicons/react/24/outline';

export default function RequestStats({ stats }) {
  const items = [
    { 
      label: 'Tổng yêu cầu', 
      value: stats.total, 
      sub: 'Tất cả yêu cầu', 
      Icon: ClipboardDocumentListIcon, // Truyền tên Component Icon, không phải thẻ <Icon />
      colorClass: 'text-gray-600',     // Màu chung cho Icon, Value, Sub
      bgClass: 'bg-gray-100',          // Màu nền cho Icon
    },
    { 
      label: 'Đang chờ xác nhận', 
      value: stats.pending, 
      sub: 'Chờ xác nhận', 
      Icon: ClockIcon,
      colorClass: 'text-yellow-600',
      bgClass: 'bg-yellow-50',
    },
    { 
      label: 'Đã xác nhận', 
      value: stats.confirmed, 
      sub: 'Trưởng toà đã xác nhận', 
      Icon: CheckBadgeIcon,
      colorClass: 'text-blue-600',
      bgClass: 'bg-blue-50',
    },
    { 
      label: 'Đang xử lý', 
      value: stats.processing, 
      sub: 'Đang sửa chữa', 
      Icon: WrenchScrewdriverIcon,
      colorClass: 'text-indigo-600',
      bgClass: 'bg-indigo-50',
    },
    { 
      label: 'Chờ thanh toán', 
      value: stats.wait_payment, 
      sub: 'Chờ thanh toán', 
      Icon: BanknotesIcon,
      colorClass: 'text-orange-600',
      bgClass: 'bg-orange-50',
    },
    { 
      label: 'Hoàn thành', 
      value: stats.completed, 
      sub: 'Đã xử lý', 
      Icon: CheckCircleIcon,
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {items.map((item, index) => (
        <div key={index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
           {/* Header: Label + Icon */}
           <div className="flex justify-between items-start mb-4">
              <span className={`text-sm font-bold ${item.colorClass}`}>
                {item.label}
              </span>
              
              {/* 1. Icon: Dùng colorClass */}
              <div className={`p-2 rounded-xl ${item.bgClass} ${item.colorClass}`}>
                <item.Icon className="w-6 h-6" />
              </div>
           </div>

           {/* Body: Value + Subtext */}
           <div>
              {/* 2. Value: Dùng colorClass */}
              <div className={`text-3xl font-bold tracking-tight ${item.colorClass}`}>
                {item.value}
              </div>

              {/* 3. Sub: Dùng colorClass (nhưng thêm opacity hoặc font-medium để đỡ bị chói) */}
              <div className={`text-xs font-medium mt-1 ${item.colorClass} opacity-90`}>
                {item.sub}
              </div>
           </div>
        </div>
      ))}
    </div>
  );
}