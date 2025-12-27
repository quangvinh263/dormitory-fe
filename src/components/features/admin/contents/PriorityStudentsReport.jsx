import React from 'react';
import Badge from '../../../ui/Badge';

const PriorityStudentsReport = () => {
  const data = [
    { id: 'SV2001', name: 'Nguyễn Văn Em', email:'nguyenvanem@example.com',phoneNumber:'0123456789', priorityName: 'Con thương binh' },
    { id: 'SV2005', name: 'Lê Thị F', email:'lethif@example.com', phoneNumber:'0987654321', priorityName: 'Hộ nghèo' },
  ];

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm animate-fade-in">
      <div className="p-4 border-b bg-gray-50"><h3 className="font-bold text-gray-800 text-md">Sinh viên diện ưu tiên</h3></div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-500">MSSV</th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-500">Họ và tên</th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-500">Email</th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-500">Số điện thoại</th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-500">Diện ưu tiên</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-bold text-gray-900 text-sm">{item.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.email}</td>
              <td className="px-6 py-4 text-sm text-blue-600 font-medium">{item.phoneNumber}</td>
              <td className="px-6 py-4"><Badge type="info">{item.priorityName}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default PriorityStudentsReport;