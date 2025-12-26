import React from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';
import Badge from '../../ui/Badge';

const PaymentTable = ({ data, onViewDetail }) => {
  
  // Helper render Badge cho Loại thanh toán
  const renderTypeBadge = (type) => {
    const typeStyles = {
      'Điện nước': 'bg-blue-50 text-blue-700 border-blue-100',
      'Gia hạn': 'bg-purple-50 text-purple-700 border-purple-100',
      'Bảo hiểm': 'bg-green-50 text-green-700 border-green-100',
    };
    
    // Sử dụng custom class cho Badge nếu component Badge hỗ trợ className
    return (
      <Badge className={`px-2 py-0.5 rounded text-[12px] font-medium border ${typeStyles[type] || 'bg-gray-50 text-gray-600'}`}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-sm text-gray-500 bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 whitespace-nowrap">Mã TT</th>
              <th className="px-6 py-3 whitespace-nowrap">MSSV</th>
              <th className="px-6 py-3 whitespace-nowrap">Họ và tên</th>
              <th className="px-6 py-3 whitespace-nowrap">Phòng</th>
              <th className="px-6 py-3 whitespace-nowrap">Loại</th>
              <th className="px-6 py-3 whitespace-nowrap">Tháng</th>
              <th className="px-6 py-3 whitespace-nowrap">Số tiền</th>
              <th className="px-6 py-3 whitespace-nowrap">Ngày thanh toán</th>
              <th className="px-6 py-3 whitespace-nowrap text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>
                <td className="px-6 py-4 text-gray-500">{item.studentId}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 text-gray-500">{item.room}</td>
                <td className="px-6 py-4">{renderTypeBadge(item.type)}</td>
                <td className="px-6 py-4 text-gray-500">{item.month || '-'}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{item.amount}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{item.date}</td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => onViewDetail(item)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Xem chi tiết"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Empty State nếu không có dữ liệu */}
      {data.length === 0 && (
        <div className="p-8 text-center text-gray-500 text-sm">
          Không tìm thấy dữ liệu phù hợp.
        </div>
      )}
    </div>
  );
};

export default PaymentTable;