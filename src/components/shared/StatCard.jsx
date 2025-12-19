import clsx from 'clsx';

const THEMES = {
  default: { text: 'text-gray-900', sub: 'text-gray-500' },
  success: { text: 'text-green-600', sub: 'text-gray-500' },
  warning: { text: 'text-orange-600', sub: 'text-gray-500' },
  danger:  { text: 'text-red-600', sub: 'text-red-400' },
};

export default function StatCard({ title, icon, value, subtext, type = 'default', action }) {
  
  // 2. Lấy theme từ object tĩnh bên ngoài
  const color = THEMES[type] || THEMES.default;

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between">
      {/* Header Card */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        {icon && <div className="text-gray-400">{icon}</div>}
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