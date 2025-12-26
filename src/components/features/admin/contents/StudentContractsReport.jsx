import React from 'react';
import Badge from '../../../ui/Badge';

const StudentContractsReport = () => {
  const data = [
    { id: 'HD24-01', student: 'Nguyễn Văn C', room: 'C202', start: '2024-01-01', end: '2024-12-31' },
    { id: 'HD24-05', student: 'Phạm Thị D', room: 'A105', start: '2024-09-01', end: '2025-06-30' },
  ];

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm animate-fade-in">
      <div className="p-4 border-b bg-gray-50"><h3 className="font-bold text-gray-800 text-sm">Tất cả Hợp đồng sinh viên</h3></div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Mã HĐ</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Sinh viên</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Phòng</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Thời hạn</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-bold text-gray-900 text-sm">{item.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.student}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.room}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.start} - {item.end}</td>
              <td className="px-6 py-4"><Badge type="success">Hiệu lực</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default StudentContractsReport;