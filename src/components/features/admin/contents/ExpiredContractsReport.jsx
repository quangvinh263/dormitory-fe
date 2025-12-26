import React from 'react';
import Badge from '../../../ui/Badge';

const ExpiredContractsReport = () => {
  const data = [
    { id: 'HD099', student: 'Trần Văn A', room: 'A101', end: '2024-12-01', status: 'expired' },
    { id: 'HD102', student: 'Lê Thị B', room: 'B302', end: '2024-12-31', status: 'warning' },
  ];

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm animate-fade-in">
      <div className="p-4 border-b bg-gray-50"><h3 className="font-bold text-gray-800 text-sm">Hợp đồng hết hạn / Sắp hết hạn</h3></div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Số HĐ</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Sinh viên</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Phòng</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Ngày hết hạn</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-bold text-gray-900 text-sm">{item.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.student}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.room}</td>
              <td className="px-6 py-4 text-sm font-medium text-red-600">{item.end}</td>
              <td className="px-6 py-4">{item.status === 'expired' ? <Badge type="danger">Đã hết hạn</Badge> : <Badge type="warning">Sắp hết hạn</Badge>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ExpiredContractsReport;