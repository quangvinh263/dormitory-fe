import React from 'react';
import Input from '../../ui/Input';

export default function ProfileField({ 
  label, 
  value, 
  icon, 
  isEditing, 
  onChange, 
  type = 'text', 
  options = [], 
  disabled = false,
  displayValue  // Thêm prop mới để hiển thị riêng
}) {
  const iconStyled = icon ? React.cloneElement(icon, { className: "w-5 h-5 text-gray-400" }) : null;

  // CHẾ ĐỘ CHỈNH SỬA
  if (isEditing) {
    if (type === 'select') {
      return (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            {iconStyled}
            {label}
          </label>
          <select 
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      );
    }
    return (
      <Input 
        label={label} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        icon={iconStyled} 
        disabled={disabled}
      />
    );
  }

  // CHẾ ĐỘ XEM - Ưu tiên displayValue, sau đó tìm label từ value
  let finalDisplayValue = displayValue || value;
  
  if (type === 'select' && !displayValue) {
    const option = options.find(o => o.value === value);
    finalDisplayValue = option ? option.label : value;
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-1.5">{label}</p>
      <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm font-medium h-[46px]">
        {iconStyled}
        <span className="truncate">
          {finalDisplayValue || <span className="text-gray-400 italic">Chưa cập nhật</span>}
        </span>
      </div>
    </div>
  );
}