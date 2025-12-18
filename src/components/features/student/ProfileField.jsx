import React from 'react';
import Input from '../../ui/Input';
import Select from '../../ui/Select';

export default function ProfileField({ 
  label, 
  value, 
  icon, 
  isEditing, 
  onChange, 
  type = 'text', 
  options = [], 
  disabled = false 
}) {
  // Clone icon để thêm class size
  const iconStyled = icon ? React.cloneElement(icon, { className: "w-5 h-5 text-gray-400" }) : null;

  // 1. CHẾ ĐỘ CHỈNH SỬA
  if (isEditing) {
    if (type === 'select') {
      return (
        <Select 
          label={label} 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          disabled={disabled}
        >
           {options.map(opt => (
             <option key={opt.value} value={opt.value}>{opt.label}</option>
           ))}
        </Select>
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

  // 2. CHẾ ĐỘ XEM (VIEW MODE)
  // Tìm label cho select (nếu là select thì hiển thị Label thay vì Value)
  let displayValue = value;
  if (type === 'select') {
     const option = options.find(o => o.value === value);
     displayValue = option ? option.label : value;
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-1.5">{label}</p>
      <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm font-medium h-[46px]">
        {iconStyled}
        <span className="truncate">
          {displayValue || <span className="text-gray-400 italic">Chưa cập nhật</span>}
        </span>
      </div>
    </div>
  );
}