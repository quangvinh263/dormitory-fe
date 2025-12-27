import clsx from 'clsx';

const THEMES = {
  default: { 
    color: 'text-gray-600', 
    bg: 'bg-gray-100' 
  },
  success: { 
    color: 'text-green-600', 
    bg: 'bg-green-100' 
  },
  warning: { 
    color: 'text-orange-600', 
    bg: 'bg-orange-100' 
  },
  danger: { 
    color: 'text-red-600', 
    bg: 'bg-red-100' 
  },
  info: {
    color: 'text-blue-600', 
    bg: 'bg-blue-100'
  }
};

export default function StatCard({ title, icon, value, subtext, type = 'default', action }) {
  
  // 2. Lấy theme dựa trên type
  const theme = THEMES[type] || THEMES.default;

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between">
      
      {/* Header: Title + Icon */}
      <div className="flex justify-between items-start mb-3">
        {/* Title (Label): Dùng theme.color */}
        <span className={clsx("font-bold text-sm", theme.color)}>
          {title}
        </span>
        
        {/* Icon: Dùng theme.color + theme.bg */}
        {icon && (
          <div className={clsx("p-2 rounded-lg", theme.bg, theme.color)}>
            {icon}
          </div>
        )}
      </div>

      {/* Body: Value + Subtext */}
      <div>
        {/* Value: Dùng theme.color */}
        <div className={clsx("text-3xl font-bold tracking-tight", theme.color)}>
          {value}
        </div>
        
        {/* Subtext: Dùng theme.color nhưng thêm opacity để đỡ chói */}
        {subtext && (
          <div className={clsx("text-xs font-medium mt-1 opacity-80", theme.color)}>
            {subtext}
          </div>
        )}
      </div>

      {/* Footer: Action Button */}
      {action && (
        <div className="mt-4 pt-3 border-t border-gray-50">
          {action}
        </div>
      )}
    </div>
  );
}