import { CalendarDaysIcon, BanknotesIcon, EyeIcon ,CreditCardIcon} from '@heroicons/react/24/outline';
import Badge from '../../ui/Badge'; // Tận dụng Badge có sẵn

export default function RequestItem({ request,handlePayment }) {
  // Helper render trạng thái giống design
  const renderStatus = (status) => {
    switch(status) {
        case 'Pending': 
            return { label: 'Đang chờ', color: 'warning', text: 'text-yellow-700' };
        case 'Processing': 
            return { label: 'Đang xử lý', color: 'info', text: 'text-blue-700' };
        case 'Completed': 
            return { label: 'Hoàn thành', color: 'success', text: 'text-green-700' };
         case 'Confirmed':
            return { label: 'Đã xác nhận', color: 'success', text: 'text-green-700' };
         case 'Wait Payment':
            return { label: 'Chờ thanh toán', color: 'success', text: 'text-green-700' };
        default: 
            return { label: 'Khác', color: 'default', text: 'text-gray-700' };
    }
  };

  const statusInfo = renderStatus(request.status);
  const formattedCost = request.repairCost > 0 ? `${request.repairCost} ₫` : '0 ₫';

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all group">
       <div className="flex flex-col md:flex-row gap-4">
          
          {/* Cột chính: Thông tin */}
          <div className="flex-1 space-y-3">
             {/* Header: ID + Status */}
             <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-900">{request.maintenanceID}</span>
                <Badge type={statusInfo.color} className="px-2 py-0.5 text-xs tracking-wide">
                   {statusInfo.label}
                </Badge>
             </div>

             {/* Room & Device Info */}
             <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex gap-1">
                   <span className="font-bold">Phòng:</span>
                   <span>{request.roomName}</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex gap-1">
                   <span className="font-bold">Thiết bị:</span>
                   <span>{request.equipmentName}</span>
                </div>
             </div>

             {/* Description */}
             <p className="text-sm text-gray-700 line-clamp-1">
                <span className="font-bold">Mô tả: </span>
                {request.description}
               </p>
             
             {/* Footer: Date & Cost */}
             <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-100 border-dashed mt-2">
                  <div className="flex items-center gap-4">
                     {/* Ngày tháng */}
                     <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <CalendarDaysIcon className="w-3.5 h-3.5"/>
                        <span>Ngày tạo: {request.issueDate}</span>
                     </div>

                     {/* Chi phí */}
                     <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">
                        <BanknotesIcon className="w-3.5 h-3.5"/>
                        <span>Chi phí: {formattedCost}</span>
                     </div>
                  </div>
                  <div>
                     {request.repairCost > 0 && request.status === 'Wait Payment' && (
                           <button 
                              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 flex items-center gap-2"
                              onClick={handlePayment}
                           >
                              <CreditCardIcon className="w-4 h-4" />
                              Thanh toán ngay
                           </button>
                     )}
                  </div>
             </div>
             
          </div>

          {/* Cột phụ: Action Button (3 chấm) */}
          <div className="flex justify-end md:justify-start items-start">
             <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                <EyeIcon className="w-5 h-5"/>
             </button>
          </div>
       </div>
    </div>
  );
}