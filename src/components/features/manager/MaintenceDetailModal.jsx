import React, { useEffect, useState } from 'react';
import { 
  WrenchScrewdriverIcon, 
  XMarkIcon, 
  MapPinIcon,
  CalendarDaysIcon,
  UserIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PencilSquareIcon,
  CheckBadgeIcon,
  BanknotesIcon 
} from '@heroicons/react/24/outline';
import { getMaintenanceDetail, updateMaintenanceStatus } from '../../../services/maintenanceApi';

// --- HELPER FUNCTIONS (Giữ nguyên như cũ) ---
const getStatusIcon = (status) => {
  switch (status) {
    case 'Completed': return <CheckCircleIcon className="w-6 h-6" />;
    case 'Processing':
    case 'In Progress': return <WrenchScrewdriverIcon className="w-6 h-6" />;
    case 'Wait Payment': return <BanknotesIcon className="w-6 h-6" />;
    case 'Confirmed': return <CheckBadgeIcon className="w-6 h-6" />;
    case 'Cancelled': return <XMarkIcon className="w-6 h-6" />;
    default: return <ClockIcon className="w-6 h-6" />;
  }
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'Pending': return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Chờ xác nhận', description: 'Yêu cầu đang chờ ban quản lý xem xét.' };
    case 'Confirmed': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Đã xác nhận', description: 'Đã tiếp nhận yêu cầu, đang sắp xếp thợ.' };
    case 'Processing':
    case 'In Progress': return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', label: 'Đang xử lý', description: 'Nhân viên đang tiến hành sửa chữa.' };
    case 'Wait Payment': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'Chờ thanh toán', description: 'Đã sửa xong, vui lòng thanh toán phí.' };
    case 'Completed': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Hoàn thành', description: 'Yêu cầu đã được xử lý hoàn tất.' };
    default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', label: 'Không xác định', description: 'Trạng thái không xác định.' };
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// --- MAIN COMPONENT ---
export default function RepairDetailModal({ request, onClose, onRefresh }) {
  // 1. KHAI BÁO HOOKS LUÔN, KHÔNG ĐƯỢC RETURN Ở ĐÂY
  // Dùng (request || {}) để tránh lỗi truy cập property của null
  const initData = request || {}; 

  const [currentRequest, setCurrentRequest] = useState(initData);
  const [note, setNote] = useState(initData.ManagerNote || '');
  const [cost, setCost] = useState(initData.RepairCost || 0);
  const [isLoading, setIsLoading] = useState(false);

  // 2. useEffect luôn phải được gọi
  useEffect(() => {
    // Nếu không có request thì không làm gì trong effect này, nhưng effect VẪN PHẢI CHẠY
    if (!request?.maintenanceID) return;

    let isMounted = true;
    const fetchData = async () => {
      try {
        const detailRes = await getMaintenanceDetail(request.maintenanceID);
        if (isMounted && detailRes.data) {
          const freshData = detailRes.data;
          setCurrentRequest(freshData);
          setNote(freshData.ManagerNote || '');
          setCost(freshData.RepairCost || 0);
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết:", error);
      }
    };

    fetchData();
    
    // Reset state local ngay lập tức khi prop request thay đổi
    setCurrentRequest(request);
    setNote(request.ManagerNote || '');
    setCost(request.RepairCost || 0);

    return () => { isMounted = false; };
  }, [request]); // Phụ thuộc vào request object (hoặc request.maintenanceID)

  // 3. LOGIC XỬ LÝ (Giữ nguyên)
  const handleConfirm = async (targetStatus) => {
    setIsLoading(true);
    let submitNote = '';
    let submitCost = 0;

    if (targetStatus === 'Wait Payment') {
        submitNote = note;
        submitCost = Number(cost);
    } else if (targetStatus === 'Confirmed') {
        submitNote = 'Đã xác nhận yêu cầu, đang điều phối thợ.';
    } else if (targetStatus === 'Processing') {
        submitNote = 'Bắt đầu tiến hành sửa chữa.';
    }

    const payload = {
        requestId: currentRequest.maintenanceID,
        newStatus: targetStatus,
        managerNote: submitNote,
        repairCost: submitCost
    };

    try {
        const result = await updateMaintenanceStatus(currentRequest.maintenanceID, payload);
        if (result.success) {
            alert('Cập nhật thành công!');
            if (onRefresh) await onRefresh();
            onClose();
        } else {
            alert(`Thất bại: ${result.message}`);
        }
    } catch (error) {
        alert('Lỗi kết nối server',error);
    } finally {
        setIsLoading(false);  
    }
  };

  // 4. BÂY GIỜ MỚI ĐƯỢC RETURN NULL (Conditional Rendering)
  // Nếu request null hoặc modal chưa mở -> ẩn đi
  if (!request) return null;

  const statusInfo = getStatusStyle(currentRequest.status);

  // 5. RENDER GIAO DIỆN
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-start shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <WrenchScrewdriverIcon className="w-6 h-6 text-yellow-600"/>
              Chi tiết Yêu cầu
            </h3>
            <p className="text-sm text-gray-500 mt-1">ID: {currentRequest.maintenanceID}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Status Badge */}
          <div className={`flex items-center gap-4 p-4 rounded-lg border ${statusInfo.bg} ${statusInfo.border} mb-6`}>
            <div className={`p-2 rounded-full bg-white/60 ${statusInfo.text}`}>
              {getStatusIcon(currentRequest.status)}
            </div>
            <div>
              <p className={`font-bold text-sm ${statusInfo.text}`}>{statusInfo.label}</p>
              <p className={`text-xs ${statusInfo.text} opacity-80`}>{statusInfo.description}</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MapPinIcon className="w-3 h-3"/> Phòng</p>
              <p className="font-semibold">{currentRequest.roomName}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><WrenchScrewdriverIcon className="w-3 h-3"/> Thiết bị</p>
              <p className="font-semibold truncate" title={currentRequest.equipmentName}>{currentRequest.equipmentName}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><UserIcon className="w-3 h-3"/> Người báo</p>
            <p className="font-medium">{currentRequest.studentName}</p>
          </div>

          <div className="rounded-lg p-4 mb-4 border border-gray-200 bg-white">
            <h4 className="text-xs font-bold text-gray-500 mb-2">Mô tả</h4>
            <p className="text-gray-800 text-sm italic">{currentRequest.description}</p>
            <p className="text-xs text-gray-400 mt-2 flex gap-1"><CalendarDaysIcon className="w-3 h-3"/> {formatDate(currentRequest.issueDate)}</p>
          </div>

          {currentRequest.status === 'Processing' && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
              <h4 className="text-sm font-bold text-gray-700 border-b pb-2">Cập nhật kết quả:</h4>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Chi phí</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500"
                  value={cost} 
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ghi chú</label>
                <textarea 
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
              </div>
            </div>
          )}

          {/* Completed View */}
          {currentRequest.status === 'Completed' && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Chi phí:</span>
                <span className="font-bold text-green-700 text-lg">{formatCurrency(currentRequest.repairCost)}</span>
              </div>
              <p className="text-sm text-gray-800 bg-white p-2 rounded border border-green-100 mt-2">
                Note: {currentRequest.managerNote}
              </p>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
          {currentRequest.status === 'Pending' && (
            <button onClick={() => handleConfirm("Confirmed")} disabled={isLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
              {isLoading ? '...' : 'Xác nhận yêu cầu'}
            </button>
          )}
          {currentRequest.status === 'Confirmed' && (
            <button onClick={() => handleConfirm("Processing")} disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
              {isLoading ? '...' : 'Tiến hành bảo trì & sửa chữa'}
            </button>
          )}
          {currentRequest.status === 'Processing' && (
            <button onClick={() => handleConfirm("Wait Payment")} disabled={isLoading} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
              {isLoading ? '...' : 'Hoàn thành'}
            </button>
          )}
          <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}