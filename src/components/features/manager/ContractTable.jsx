import React from 'react';
import { BellAlertIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Badge from '../../ui/Badge'; 

const ContractTable = ({ contracts, onRoomChange }) => {

  // Helper: Format ngày từ yyyy-mm-dd sang dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString || dateString === '0001-01-01') return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN'); // Ra định dạng 20/08/2024
  };

  // Helper: Map trạng thái từ API sang UI Badge
  const renderStatus = (status, remainingDays) => {
    // Logic: Nếu API trả về status text hoặc dựa vào ngày còn lại
    // Giả sử API trả về: "Active", "Expired", "NearExpiration"
    
    let type = 'success';
    let label = 'Đang hiệu lực';

    if (status === 'Expired' || remainingDays < 0) {
        type = 'danger';
        label = 'Đã hết hạn';
    } else if (status === 'NearExpiration' || remainingDays <= 15) {
        type = 'warning';
        label = 'Sắp hết hạn';
    }

    return <Badge type={type}>{label}</Badge>;
  };

  // Helper: Render text ngày còn lại
  const renderDaysText = (days) => {
      if (days < 0) return <span className="text-red-600 font-bold">Quá hạn {Math.abs(days)} ngày</span>;
      if (days === 0) return <span className="text-red-600 font-bold">Hết hạn hôm nay</span>;
      if (days <= 7) return <span className="text-orange-600 font-bold">{days} ngày</span>;
      if (days <= 15) return <span className="text-orange-500 font-medium">{days} ngày</span>;
      return <span className="text-green-600 font-medium">{days} ngày</span>;
  }

  // Xử lý trường hợp không có dữ liệu
  if (!contracts || contracts.length === 0) {
      return (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
              Không tìm thấy hợp đồng nào phù hợp với bộ lọc.
          </div>
      );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-sm text-gray-500 bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 whitespace-nowrap">MSSV</th>
              <th className="px-6 py-3 whitespace-nowrap">Tên sinh viên</th>
              <th className="px-6 py-3 whitespace-nowrap">Phòng</th>
              <th className="px-6 py-3 whitespace-nowrap">Ngày kết thúc</th>
              <th className="px-6 py-3 whitespace-nowrap">Còn lại</th>
              <th className="px-6 py-3 whitespace-nowrap">Trạng thái</th>
              <th className="px-6 py-3 whitespace-nowrap text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {contracts.map((item) => (
              <tr key={item.contractID || item.studentID} className="hover:bg-gray-50 transition-colors">
                
                {/* 1. MSSV */}
                <td className="px-6 py-4 font-bold text-gray-900">
                    {item.studentID}
                </td>

                {/* 2. Tên SV */}
                <td className="px-6 py-4 font-medium">
                    {item.studentName}
                </td>

                {/* 3. Phòng */}
                <td className="px-6 py-4 text-gray-500">
                    {item.roomName} <span className="text-xs text-gray-400"></span>
                </td>

                {/* 4. Ngày kết thúc */}
                <td className="px-6 py-4">
                    {formatDate(item.endDate)}
                </td>

                {/* 5. Số ngày còn lại */}
                <td className="px-6 py-4">
                    {renderDaysText(item.remainingDays)}
                </td>

                {/* 6. Trạng thái */}
                <td className="px-6 py-4">
                    {renderStatus(item.status, item.remainingDays)}
                </td>

                {/* 7. Button Thao tác */}
                <td className="px-6 py-4 text-center gap-2 flex justify-center">
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm">
                    <BellAlertIcon className="w-3.5 h-3.5" />
                    Nhắc
                  </button>
                  <button 
                        onClick={() => onRoomChange(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-lg text-xs font-medium text-orange-600 hover:bg-orange-100 hover:border-orange-200 transition-colors shadow-sm"
                    >
                        <ArrowPathIcon className="w-3.5 h-3.5" />
                        Đổi phòng
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractTable;