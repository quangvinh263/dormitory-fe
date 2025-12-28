export default function Select({ label, error, children, className, ...props }) {
  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      
      {/* Thẻ Select chuẩn style Tailwind */}
      <select
        className={`
          w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg 
          focus:outline-none focus:ring-0 focus:border-gray-300 block p-2.5 transition-colors
          disabled:bg-gray-100 disabled:text-gray-500
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
        `}
        {...props}
      >
        {children}
      </select>

      {/* Hiển thị lỗi nếu có */}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}