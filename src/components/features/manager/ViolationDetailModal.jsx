import React from 'react';
import { 
  ExclamationCircleIcon, 
  XMarkIcon,
  ClockIcon,
  UserIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

export default function ViolationDetailModal({ student, onClose }) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay màn hình đen mờ */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Nội dung Popup */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        
        {/* Header Popup */}
        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ExclamationCircleIcon className="w-6 h-6 text-red-600"/>
              Chi tiết vi phạm
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Sinh viên: <span className="font-semibold text-gray-900">{student.name}</span>
            </p>
            <p className="text-sm text-gray-600">
              Phòng: <span className="font-semibold text-gray-900">{student.room}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-red-100 rounded-full text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body: Danh sách các vi phạm */}
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          
          {/* Cảnh báo tổng quan */}
          <div className="mb-6 flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{student.violations.length}/3</div>
            <div className="text-sm text-gray-700">
              Lần vi phạm. <br/>
              <span className="text-xs text-gray-500">
                (Sinh viên sẽ bị chấm dứt hợp đồng nếu vi phạm 3 lần)
              </span>
            </div>
          </div>

          {/* Timeline Vi phạm */}
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
            
            {student.violations.map((v, index) => (
              <div key={index} className="relative flex items-start gap-4 group">
                {/* Dấu chấm tròn trên timeline */}
                <div className="absolute left-0 mt-1.5 ml-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow ring-2 ring-red-100"></div>
                
                {/* Card nội dung vi phạm */}
                <div className="ml-6 flex-1 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow hover:border-red-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900 text-sm">{v.title}</h4>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center gap-1">
                      <CalendarDaysIcon className="w-3 h-3"/> {v.date}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mb-2 italic">
                    "{v.description}"
                  </p>

                  <div className="flex justify-between items-center text-xs text-gray-500 mt-2 border-t pt-2 border-gray-100">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-3 h-3"/> {v.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-3 h-3"/> Người lập: {v.reporter}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {student.violations.length === 0 && (
              <p className="text-center text-gray-500 italic">Không có dữ liệu chi tiết.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}