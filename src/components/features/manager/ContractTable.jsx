import React from 'react';
import { BellAlertIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Badge from '../../ui/Badge'; 

const ContractTable = ({ contracts, onRoomChange, onRemind, loading }) => {

  const renderStatus = (daysLeft) => {
    if (daysLeft < 0) return <Badge type="danger">Đã hết hạn</Badge>;
    if (daysLeft <= 14) return <Badge type="warning">Sắp hết hạn</Badge>;
    return <Badge type="success">Còn hạn</Badge>;
  };

  const renderDaysText = (days) => {
      if (days < 0) return <span className="text-red-600 font-bold">Quá hạn {Math.abs(days)} ngày</span>;
      if (days <= 14) return <span className="text-orange-600 font-bold">{days} ngày</span>;
      return <span className="text-green-600 font-medium">{days} ngày</span>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
            {contracts && contracts.length > 0 ? (
              contracts.map((item) => {
                const isExpired = item.remainingDays < 0; 
                const showRemindButton = item.remainingDays <= 14;
                return (
                  <tr key={item.contractID} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{item.studentID}</td>
                    <td className="px-6 py-4 font-medium">{item.studentName}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.roomName} <span className="text-xs">({item.buildingName})</span>
                    </td>
                    <td className="px-6 py-4">
                      {item.endDate ? new Date(item.endDate).toLocaleDateString('vi-VN') : '---'}
                    </td>
                    <td className="px-6 py-4">{renderDaysText(item.remainingDays)}</td>
                    <td className="px-6 py-4">{renderStatus(item.remainingDays)}</td>
                    
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        {showRemindButton && (
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemind(item.studentID);
                              }}
                              title={isExpired ? "Gửi cảnh cáo" : "Gửi nhắc nhở gia hạn"}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-95 shadow-sm
                                ${isExpired 
                                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300' 
                                  : 'bg-white text-blue-600 border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                                }`}
                            >
                              <BellAlertIcon className={`w-3.5 h-3.5 ${isExpired ? 'animate-pulse' : ''}`} />
                              {isExpired ? 'Gửi cảnh cáo' : 'Nhắc gia hạn'}
                            </button>
                        )}

                        <button 
                          onClick={() => onRoomChange(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-lg text-xs font-medium text-orange-600 hover:bg-orange-100 transition-colors shadow-sm"
                        >
                          <ArrowPathIcon className="w-4 h-4" />
                          Đổi phòng
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-gray-400 italic">
                  Không có dữ liệu hợp đồng nào được tìm thấy.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractTable;