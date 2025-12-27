import { useEffect, useState } from 'react'
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

import { getMaintenanceDetail,updateMaintenanceStatus } from '../../../services/maintenanceApi';
export default function RepairDetailModal({ request, onClose,onRefresh }) {
  if (!request) return null;

  // State nhập liệu
  const [note, setNote] = useState(request.ManagerNote || '');
  const [cost, setCost] = useState(request.RepairCost || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [detail,setDetail] = useState(null);
  const [currentRequest, setCurrentRequest] = useState(request);

  const handleConfirm = async (status) => {
    // 1. Bật trạng thái loading để chặn click nhiều lần
    setIsLoading(true);

    let submitNote = '';
    let submitCost = 0;

    if (status === 'Wait Payment') {
        submitNote = note; // State 'note'
        submitCost = Number(cost); // State 'cost' (Chuyển string sang number)
    } 
    else if (status === 'Confirmed') {
        submitNote = 'Đã xác nhận yêu cầu, đang điều phối thợ.';
        submitCost = 0;
    }
    else if (status === 'Processing') {
        submitNote = 'Bắt đầu tiến hành sửa chữa.';
        submitCost = 0;
    }
    // 2. Chuẩn bị dữ liệu theo đúng DTO của C#
    const payload = {
        requestId: request.maintenanceID, // Map với DTO: RequestId
        newStatus: status,           // Map với DTO: NewStatus
        managerNote: submitNote,
        repairCost: submitCost                     // Map với DTO: RepairCost (Mặc định 0 khi mới xác nhận)
    };

    try {
        // 3. Gọi API
        // Lưu ý: request.maintenanceID là id trên URL, payload là body
        const result = await updateMaintenanceStatus(request.maintenanceID, payload);
        if (result.success) {
            alert('Cập nhật yêu cầu sửa chữa thành công');
            onRefresh(); 
            onClose();
        } else {
            console.log ('Cập nhật thất bại')
        }
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);  
    }
};

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircleIcon className="w-6 h-6 " />;
      
      case 'Processing':
      case 'In Progress':
        return <WrenchScrewdriverIcon className="w-6 h-6 " />;
      
      case 'Wait Payment':
        return <BanknotesIcon className="w-6 h-6 " />;
      
      case 'Confirmed':
        return <CheckBadgeIcon className="w-6 h-6 " />;
        
      case 'Cancelled':
        return <XMarkIcon className="w-6 h-6 " />;

      case 'Pending':
      default:
        return <ClockIcon className="w-6 h-6 " />;
  }
};
  // Helper style
  const getStatusStyle = (status) => {
  switch (status) {
    // 1. Chờ xác nhận (Màu Vàng - Cảnh báo nhẹ)
    case 'Pending':
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        iconColor: 'text-yellow-600',
        label: 'Chờ xác nhận',
        description: 'Yêu cầu đang chờ ban quản lý xem xét.'
      };

    // 2. Đã xác nhận (Màu Xanh Dương - Thông tin)
    case 'Confirmed':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        iconColor: 'text-blue-600',
        label: 'Đã xác nhận',
        description: 'Đã tiếp nhận yêu cầu, đang sắp xếp thợ.'
      };

    // 3. Đang xử lý (Màu Tím/Indigo - Đang hoạt động)
    case 'Processing':
    case 'In Progress': // Phòng hờ BE trả về text khác
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        iconColor: 'text-indigo-600',
        label: 'Đang xử lý',
        description: 'Nhân viên đang tiến hành sửa chữa.'
      };

    // 4. Chờ thanh toán (Màu Cam - Cần chú ý)
    case 'Wait Payment':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        iconColor: 'text-orange-600',
        label: 'Chờ thanh toán',
        description: 'Đã sửa xong, vui lòng thanh toán phí.'
      };

    // 5. Hoàn thành (Màu Xanh Lá - Thành công)
    case 'Completed':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        iconColor: 'text-green-600',
        label: 'Hoàn thành',
        description: 'Yêu cầu đã được xử lý hoàn tất.'
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        iconColor: 'text-gray-500',
        label: 'Không xác định',
        description: 'Trạng thái không xác định.'
      };
  }
};
  const formatDate = (dateString) => {
    if (!dateString) return ''; // Trả về chuỗi rỗng nếu không có ngày
    
    const date = new Date(dateString);
    
    // Kiểm tra nếu ngày không hợp lệ
    if (isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const statusInfo = getStatusStyle(currentRequest.status);
  useEffect(() => {
    const fetchData = async () => {
        if (!request?.maintenanceID) return;

        try {
            const detailRes = await getMaintenanceDetail(request.maintenanceID);
            
            if (detailRes.data) {
                const freshData = detailRes.data;
                
                // 1. Cập nhật dữ liệu hiển thị chính
                setCurrentRequest(freshData);

                // 2. QUAN TRỌNG: Cập nhật luôn các ô input (Note, Cost) 
                // để hiển thị đúng những gì đã lưu trong Database
                setNote(freshData.ManagerNote || '');
                setCost(freshData.RepairCost || 0);
            }
        } catch (error) {
            console.error("Lỗi lấy chi tiết:", error);
        }
    };

    fetchData();

    // Reset lại dữ liệu khi ID thay đổi (tránh hiện dữ liệu của request cũ)
    setCurrentRequest(request);
    setNote(request.ManagerNote || '');
    setCost(request.RepairCost || 0);

}, [request.maintenanceID]); // Chạy lại khi ID thay đổi
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
              Mã yêu cầu: <span className="font-medium text-gray-900">{currentRequest.maintenanceID}</span>
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
              {getStatusIcon(currentRequest.status)}
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
              <p className="font-semibold text-gray-900">{currentRequest.roomName}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><WrenchScrewdriverIcon className="w-3 h-3"/> Tên thiết bị</p>
              <p className="font-semibold text-gray-900 truncate" title={currentRequest.EquipmentID}>{currentRequest.equipmentName}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><UserIcon className="w-3 h-3"/> Người Báo Cáo</p>
            <p className="font-medium text-gray-900">{currentRequest.studentName} <span className="text-gray-400 font-normal"></span></p>
          </div>

          {/* Description */}
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <h4 className="text-xs font-bold text-gray-500  mb-2">Mô tả </h4>
            <p className="text-gray-800 text-sm italic">  {currentRequest.description}</p>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
               <CalendarDaysIcon className="w-4 h-4"/> Ngày yêu cầu: {formatDate(currentRequest.issueDate)}
            </div>
          </div>

          {/* Input Fields */}
          {currentRequest.status === 'Completed' && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 flex items-center gap-1"><CurrencyDollarIcon className="w-4 h-4"/> Chi phí:</span>
                <span className="font-bold text-green-700 text-lg">{formatCurrency(currentRequest.repairCost)}</span>
              </div>
              {currentRequest.managerNote && (
                 <div className="text-sm">
                   <span className="text-gray-600 flex items-center gap-1 mb-1"><PencilSquareIcon className="w-4 h-4"/> Ghi chú từ quản lý :</span>
                   <p className="text-gray-800 bg-white p-2 rounded border border-green-100">{currentRequest.managerNote}</p>
                 </div>
              )}
              {currentRequest.resolvedDate && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
                    <CalendarDaysIcon className="w-4 h-4"/> Ngày sửa chữa hoàn tất: {formatDate(currentRequest.resolvedDate)}
                  </div>
              )}
            </div>
          )}
          

          {currentRequest.status === 'Processing' && (
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
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between gap-3 shrink-0">
          
          
          {currentRequest.status === 'Pending' && (
            <div>
              {/* Nút Xác nhận yêu cầu (Yêu cầu của bạn) */}
              <button 
                onClick={() => handleConfirm("Confirmed")}
                disabled={isLoading}
                className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm cursor-pointer flex items-start gap-2"
              >
                <CheckBadgeIcon className="w-4 h-4"/>
                Xác nhận yêu cầu
              </button>
            </div>
          )}
          {currentRequest.status === 'Confirmed' && (
            <button 
              onClick={() => handleConfirm("Processing")}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm flex items-center gap-2 cursor-pointer">
              <CheckCircleIcon className="w-4 h-4"/> Xác nhận bắt đầu sửa chữa
            </button>
          )}
          {currentRequest.status === 'Processing' && (
            <button 
              onClick={() => handleConfirm("Wait Payment",)}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm flex items-center gap-2 cursor-pointer">
              <CheckCircleIcon className="w-4 h-4"/> Xác nhận sửa chữa thành công.
            </button>
          )}

          <button onClick={onClose} className="ml-auto flex-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}