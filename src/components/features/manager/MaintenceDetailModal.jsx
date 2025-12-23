import React, { useState } from 'react';
import { 
  WrenchScrewdriverIcon, 
  XMarkIcon, 
  MapPinIcon,
  CalendarDaysIcon,
  UserIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

export default function RepairDetailModal({ request, onClose }) {
  if (!request) return null;

  // State nhập liệu
  const [note, setNote] = useState(request.ManagerNote || '');
  const [cost, setCost] = useState(request.RepairCost || 0);

  // Helper style
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': 
        return { 
          bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200',
          label: 'Đang chờ xử lý', description: 'Yêu cầu chưa được tiếp nhận.'
        };
      case 'Processing': 
        return { 
          bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200',
          label: 'Đang sửa chữa', description: 'Đang tiến hành khắc phục sự cố.'
        };
      case 'Done': 
        return { 
          bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200',
          label: 'Đã hoàn thành', description: 'Sự cố đã được giải quyết.'
        };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700' };
    }
  };

  const statusInfo = getStatusStyle(request.Status);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-start shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <WrenchScrewdriverIcon className="w-6 h-6 text-yellow-600"/>
              Chi tiết Yêu cầu Sửa chữa
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Mã yêu cầu: <span className="font-medium text-gray-900">#{request.RequestID}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Trạng thái hiện tại */}
          <div className={`flex items-center gap-4 p-4 rounded-lg border ${statusInfo.bg} ${statusInfo.border} mb-6`}>
            <div className={`p-2 rounded-full bg-white/60 ${statusInfo.text}`}>
              {request.Status === 'Done' ? <CheckCircleIcon className="w-6 h-6"/> : <ClockIcon className="w-6 h-6"/>}
            </div>
            <div>
              <p className={`font-bold text-sm tracking-wide ${statusInfo.text}`}>{statusInfo.label}</p>
              <p className={`text-xs ${statusInfo.text} opacity-80 mt-0.5`}>{statusInfo.description}</p>
            </div>
          </div>

          {/* Thông tin chính */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MapPinIcon className="w-3 h-3"/> Số Phòng</p>
              <p className="font-semibold text-gray-900">{request.RoomID}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><WrenchScrewdriverIcon className="w-3 h-3"/> Tên thiết bị</p>
              <p className="font-semibold text-gray-900 truncate" title={request.EquipmentID}>{request.EquipmentID}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><UserIcon className="w-3 h-3"/> Người Báo Cáo</p>
            <p className="font-medium text-gray-900">{request.StudentID} <span className="text-gray-400 font-normal">(Người báo)</span></p>
          </div>

          {/* Description */}
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <h4 className="text-xs font-bold text-gray-500  mb-2">Mô tả (Description)</h4>
            <p className="text-gray-800 text-sm italic">"{request.Description}"</p>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
               <CalendarDaysIcon className="w-4 h-4"/> RequestDate: {request.RequestDate}
            </div>
          </div>

          {/* Input Fields */}
          {request.Status === 'Done' && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 flex items-center gap-1"><CurrencyDollarIcon className="w-4 h-4"/> Chi phí:</span>
                <span className="font-bold text-green-700 text-lg">{formatCurrency(request.RepairCost)}</span>
              </div>
              {request.ManagerNote && (
                 <div className="text-sm">
                   <span className="text-gray-600 flex items-center gap-1 mb-1"><PencilSquareIcon className="w-4 h-4"/> Ghi chú:</span>
                   <p className="text-gray-800 bg-white p-2 rounded border border-green-100">{request.ManagerNote}</p>
                 </div>
              )}
              {request.ResolvedDate && (
                 <div className="text-xs text-gray-500 text-right mt-1">ResolvedDate: {request.ResolvedDate}</div>
              )}
            </div>
          )}

          {request.Status === 'Processing' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-bold text-gray-700 border-b pb-2">Cập nhật kết quả:</h4>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Chi phí</label>
                <div className="relative">
                  <input 
                    type="number" 
                    className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0"
                    placeholder="0"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ghi chú</label>
                <textarea 
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Nhập ghi chú..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
            Đóng
          </button>
          
          {request.Status === 'Pending' && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm cursor-pointer">
              Tiếp nhận & Gọi thợ
            </button>
          )}
          
          {request.Status === 'Processing' && (
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm flex items-center gap-2 cursor-pointer">
              <CheckCircleIcon className="w-4 h-4"/> Xác nhận Hoàn thành
            </button>
          )}
        </div>
      </div>
    </div>
  );
}