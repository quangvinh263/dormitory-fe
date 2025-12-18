import clsx from 'clsx';
import { Link } from 'react-router-dom';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  to, 
  icon,
  ...props 
}) {
  
  // 1. Cấu hình màu sắc
  const variants = {
    primary: 'bg-primary hover:bg-blue-700 text-white shadow-blue-200',
    danger:  'bg-red-600 hover:bg-red-700 text-white shadow-red-200',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-green-200',
    white:   'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
    outline: 'bg-transparent border border-primary text-primary hover:bg-blue-50',
  };

  // 2. Cấu hình kích thước
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  // 3. Class chung
  const baseClass = clsx(
    // inline-flex, items-center, justify-center: Cốt lõi để căn giữa dọc/ngang
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
    variants[variant],
    sizes[size],
    className
  );

  // Helper để render nội dung bên trong (tránh lặp code)
  const renderContent = () => (
    <>
      {icon && (
        <span className="flex shrink-0 items-center justify-center w-5 h-5">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </>
  );

  // 4. Render (Link hoặc Button)
  if (to) {
    return (
      <Link to={to} className={baseClass} {...props}>
        {renderContent()}
      </Link>
    );
  }

  return (
    <button className={baseClass} {...props}>
      {renderContent()}
    </button>
  );
}