export default function Input({ label, error, icon, className, ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Nếu có icon thì hiển thị icon bên trái */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          className={`
            w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg 
            focus:ring-2 focus:ring-primary focus:border-primary block p-2.5 transition-colors
            disabled:bg-gray-100 disabled:text-gray-500
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          `}
          {...props}
        />
      </div>

      {/* Hiển thị lỗi nếu có */}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}