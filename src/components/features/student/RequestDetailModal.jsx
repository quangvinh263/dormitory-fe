import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { getMaintenanceDetail } from '../../../services/maintenanceApi';
import Badge from '../../ui/Badge';
import { useEffect, useState } from 'react';

export default function RequestDetailModal({ isOpen, onClose, request }) {
  // 1. KHAI BÁO STATE VÀ HOOKS TRƯỚC (QUAN TRỌNG)
  const [maintenanceDetail, setMaitenanceDetail] = useState(null);
  const [loading, setLoading] = useState(false); // Sửa mặc định là false, khi nào fetch mới true
  const [error, setError] = useState('');

  // 2. Fetch Data
  useEffect(() => {
    // Nếu modal không mở hoặc không có request thì không fetch
    if (!isOpen || !request) return;

    let mounted = true;
    setLoading(true); // Bắt đầu load

    const fetchData = async () => {
      try {
        const res = await getMaintenanceDetail(request.maintenanceID);
        if (mounted) {
          if (res.success && res.data) {
            setMaitenanceDetail(res.data);
            console.log("Chi tiết:", res.data);
          } else {
            throw new Error(res.message || 'Không thể tải chi tiết yêu cầu.');
          }
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    // Cleanup: Reset data khi đóng modal hoặc đổi request để tránh hiển thị data cũ
    return () => { 
        mounted = false; 
        setMaitenanceDetail(null); 
    };
  }, [isOpen, request]); // Thêm dependency request

  // Helper hiển thị badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <Badge type="warning">Đang chờ</Badge>;
      case 'Processing': return <Badge type="info">Đang xử lý</Badge>;
      case 'Completed': return <Badge type="success">Hoàn thành</Badge>;
      default: return <Badge type="default">Khác</Badge>;
    }
  };

  // 3. CHECK ĐIỀU KIỆN RENDER (Sau khi đã gọi Hooks)
  if (!isOpen || !request) return null;

  const formattedCost = request.repairCost > 0 ? `${request.repairCost.toLocaleString()} ₫` : '0 ₫';
  
  // Kiểm tra key của API trả về (thường là camelCase managerNote hoặc PascalCase ManagerNote)
  // Bạn hãy check console.log để chắc chắn tên trường là 'managerNote' hay 'ManagerNote'
  const managerNoteContent = maintenanceDetail?.managerNote || maintenanceDetail?.ManagerNote; 
  const resolveDateContent = request.resolveDate || request.ResolveDate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in px-4">

      {/* Container Modal */}
      <div className="w-full max-w-[500px] bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-in">

        {/* --- HEADER --- */}
        <div className="p-5 border-b border-gray-100 relative bg-gray-50/30">
          <h3 className="text-lg font-bold text-gray-900">Chi Tiết Yêu Cầu Sửa Chữa</h3>
          <p className="text-sm text-gray-500 mt-1">Mã yêu cầu: <span className="font-medium text-gray-900">{request.maintenanceID}</span></p>

          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors bg-white hover:bg-gray-100 p-1 border-gray-100"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* --- BODY --- */}
        <div className="p-6 space-y-6">

          {/* Grid thông tin chính */}
          <div className="grid grid-cols-2 gap-y-5 gap-x-4">

            {/* Trạng thái */}
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1.5">Trạng thái</label>
              <div>{getStatusBadge(request.status)}</div>
            </div>

            {/* Phòng */}
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Phòng</label>
              <p className="text-sm font-medium text-gray-900">{request.roomName}</p>
            </div>

            {/* Thiết bị */}
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Tên thiết bị</label>
              <p className="text-sm font-medium text-gray-900">{request.equipmentName}</p>
            </div>

            {/* Ngày gửi */}
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Ngày gửi</label>
              <p className="text-sm font-medium text-gray-900">{request.issueDate}</p>
            </div>

            {/* --- ĐIỀU KIỆN 1: Ngày giải quyết (Chỉ hiện nếu có dữ liệu) --- */}
            {resolveDateContent && (
                <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">Ngày giải quyết</label>
                <p className="text-sm font-medium text-gray-900">{resolveDateContent}</p>
                </div>
            )}

            {/* Chi phí */}
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Chi phí sửa chữa</label>
              <p className="text-base font-medium text-blue-600">{formattedCost}</p>
            </div>
          </div>

          {/* Mô tả vấn đề */}
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-2">Mô tả vấn đề</label>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm text-gray-700 min-h-[80px]">
              {request.description}
            </div>
          </div>

          {/* --- ĐIỀU KIỆN 2: Quản lý ghi chú (Chỉ hiện nếu có note) --- */}
          {/* Cần kiểm tra maintenanceDetail khác null trước, sau đó mới check content */}
          {maintenanceDetail && managerNoteContent && (
             <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Quản lý ghi chú</label>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-gray-700 min-h-[80px]">
                    {managerNoteContent}
                </div>
             </div>
          )}

          {/* Note cảnh báo */}
          <div className="bg-yellow-50 p-3 rounded-lg flex gap-3 border border-yellow-100">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 shrink-0" />
            <div className="text-sm text-yellow-800 leading-5">
              <span className="font-bold">Lưu ý: </span>
              Bạn không thể chỉnh sửa yêu cầu sau khi đã gửi. Nếu có thay đổi, vui lòng tạo yêu cầu mới hoặc liên hệ trực tiếp với quản lý tòa.
            </div>
          </div>

        </div>

        {/* --- FOOTER --- */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}