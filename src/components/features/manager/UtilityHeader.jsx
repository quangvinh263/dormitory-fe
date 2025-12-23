import React, { useState, useRef, useEffect }from 'react';
import { FunnelIcon, ArrowDownTrayIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function UtilityHeader({ onRefresh, selectedMonth, selectedYear, onMonthYearChange }) {

  const [viewYear, setViewYear] = useState(selectedYear); 
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);

  // Sync viewYear khi selectedYear thay đổi từ bên ngoài
  useEffect(() => {
    setViewYear(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleYearChange = (offset) => {
    setViewYear(prev => prev + offset);
  };

  const handleMonthSelect = (monthIndex) => {
    const month = monthIndex + 1; // Convert 0-11 to 1-12
    
    // ✅ Gọi callback để thông báo parent component
    if (onMonthYearChange) {
      onMonthYearChange(month, viewYear);
    }
    
    setIsOpen(false);
  };

  const displayDate = `Tháng ${String(selectedMonth).padStart(2, '0')}/${selectedYear}`;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      {/* Title Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">Quản Lý Chỉ Số Điện Nước</h2>
        <p className="text-sm text-gray-500 mt-1">Nhập và quản lý chỉ số điện nước hàng tháng</p>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Month Picker */}
        <div className="relative" ref={containerRef}>
          {/* Nút kích hoạt Dropdown */}
          <div 
            onClick={() => {
              setIsOpen(!isOpen);
              setViewYear(selectedYear); // Reset năm xem về năm đang chọn
            }}
            className={`flex items-center justify-between gap-2 px-3 py-2 bg-gray-50 border rounded-lg cursor-pointer transition-all select-none min-w-[140px]
              ${isOpen ? 'border-blue-500 ring-2 ring-blue-100 bg-white' : 'border-gray-200 hover:bg-gray-100'}`}
          >
            <span className="text-sm font-bold text-gray-700">{displayDate}</span>
            <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Content */}
          {isOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-50 animate-scale-up origin-top-right">
              
              {/* Header: Chọn Năm */}
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                <button 
                  onClick={() => handleYearChange(-1)}
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-gray-900">Năm {viewYear}</span>
                <button 
                  onClick={() => handleYearChange(1)}
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Grid: Chọn Tháng */}
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 12 }, (_, i) => i).map((monthIndex) => {
                  // Kiểm tra xem có phải tháng đang chọn không
                  const isSelected = (monthIndex + 1) === selectedMonth && viewYear === selectedYear;
                  // Kiểm tra tháng hiện tại (Today)
                  const isCurrentMonth = new Date().getMonth() === monthIndex && new Date().getFullYear() === viewYear;

                  return (
                    <button
                      key={monthIndex}
                      onClick={() => handleMonthSelect(monthIndex)}
                      className={`
                        px-2 py-2 text-xs font-medium rounded-lg transition-colors
                        ${isSelected 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                        }
                        ${!isSelected && isCurrentMonth ? 'border border-blue-200 text-blue-600' : ''}
                      `}
                    >
                      Tháng {monthIndex + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Export Button */}
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
          <ArrowDownTrayIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Xuất báo cáo</span>
        </button>
      </div>
    </div>
  );
}