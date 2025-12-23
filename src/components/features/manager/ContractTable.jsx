import React from 'react';
import { BellAlertIcon } from '@heroicons/react/24/outline';
import Badge from '../../ui/Badge'; 

const ContractTable = () => {
  // Mock Data chuẩn theo hình Figma
  const contracts = [
    { id: 'SV2024001', name: 'Nguyễn Văn A', room: 'A301 (Tòa A)', endDate: '20/08/2024', daysLeft: 5, status: 'warning' },
    { id: 'SV2024005', name: 'Trần Thị B', room: 'A302 (Tòa A)', endDate: '10/08/2024', daysLeft: -5, status: 'danger' }, // Âm là quá hạn
    { id: 'SV2024009', name: 'Lê Văn C', room: 'A303 (Tòa A)', endDate: '25/08/2024', daysLeft: 10, status: 'warning' },
    { id: 'SV2024017', name: 'Hoàng Văn E', room: 'B201 (Tòa B)', endDate: '01/09/2024', daysLeft: 17, status: 'success' },
    { id: 'SV2024021', name: 'Đỗ Thị F', room: 'B202 (Tòa B)', endDate: '18/08/2024', daysLeft: 3, status: 'warning' },
    { id: 'SV2024025', name: 'Phạm Thị G', room: 'B205 (Tòa B)', endDate: '30/08/2024', daysLeft: 15, status: 'success' },
  ];

  // Helper render Badge
  const renderStatus = (status) => {
    const map = {
      danger: { type: 'danger', label: 'Đã hết hạn' },
      warning: { type: 'warning', label: 'Sắp hết hạn' },
      success: { type: 'success', label: 'Còn hạn' },
    };
    const config = map[status] || map.success;
    return <Badge type={config.type}>{config.label}</Badge>;
  };

  // Helper render text ngày còn lại
  const renderDaysText = (days) => {
      if (days < 0) return <span className="text-red-600 font-bold">Quá hạn {Math.abs(days)} ngày</span>;
      if (days <= 7) return <span className="text-orange-600 font-bold">{days} ngày</span>;
      if (days <= 14) return <span className="text-orange-500 font-medium">{days} ngày</span>;
      return <span className="text-green-600 font-medium">{days} ngày</span>;
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
            {contracts.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{item.id}</td>
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4 text-gray-500">{item.room}</td>
                <td className="px-6 py-4">{item.endDate}</td>
                <td className="px-6 py-4">{renderDaysText(item.daysLeft)}</td>
                <td className="px-6 py-4">{renderStatus(item.status)}</td>
                <td className="px-6 py-4 text-center">
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm">
                    <BellAlertIcon className="w-3.5 h-3.5" />
                    Nhắc nhở
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