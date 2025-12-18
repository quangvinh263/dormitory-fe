import clsx from 'clsx';

export default function Badge({ children, type = 'default', className }) {
  
  const styles = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-green-50 text-green-700 border-green-200', // Đã duyệt, Đã đóng tiền
    warning: 'bg-orange-50 text-orange-700 border-orange-200', // Con liệt sĩ, Chờ duyệt
    danger:  'bg-red-50 text-red-700 border-red-200',       // Vi phạm, Chưa đóng
    info:    'bg-blue-50 text-blue-700 border-blue-200',       // Hộ nghèo
  };

  return (
    <span className={clsx(
      "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border",
      styles[type] || styles.default,
      className
    )}>
      {children}
    </span>
  );
}