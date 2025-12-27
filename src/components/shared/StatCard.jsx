import clsx from 'clsx';

const THEMES = {
  default: { 
    text: 'text-gray-900', 
    sub: 'text-gray-500', 
    icon: 'text-gray-400 bg-gray-100' // Icon xám, nền xám nhạt
  },
  success: { 
    text: 'text-green-600', 
    sub: 'text-green-600', // Subtext cũng xanh (hoặc để gray tùy bạn)
    icon: 'text-green-600 bg-green-100' // Icon xanh, nền xanh nhạt
  },
  warning: { 
    text: 'text-orange-600', 
    sub: 'text-orange-600', 
    icon: 'text-orange-600 bg-orange-100' 
  },
  danger: { 
    text: 'text-red-600', 
    sub: 'text-red-500', 
    icon: 'text-red-600 bg-red-100' 
  },
  info:
  {
    text: 'text-blue-600', 
    sub: 'text-blue-600', 
    icon: 'text-blue-600 bg-blue-100'
  }
};

export default function StatCard({ title, icon, value, subtext, type = 'default', action }) {
  
  // 2. Lấy theme từ object tĩnh bên ngoài
  const color = THEMES[type] || THEMES.default;

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between">
      {/* Header Card */}
      <div className="flex justify-between items-start mb-3">
        <span className="font-medium ">{title}</span>
        {icon && (
          <div className={clsx("p-2 rounded-lg", color.icon)}>
            {/* Class p-2 rounded-lg tạo khung bo tròn cho icon */}
            {icon}
          </div>
        )}
      </div>

      {/* Nội dung Value */}
      <div>
        <div className={clsx("text-3xl font-bold tracking-tight", color.text)}>
          {value}
        </div>
        {subtext && (
          <div className={clsx("text-xs font-medium mt-1", color.sub)}>
            {subtext}
          </div>
        )}
      </div>

      {/* Nút hành động (nếu có) */}
      {action && <div className="mt-4 pt-3 border-t border-gray-50">{action}</div>}
    </div>
  );
}