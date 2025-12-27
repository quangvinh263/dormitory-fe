import React, { useState } from 'react';
import Badge from '../../../ui/Badge';

const ExpiredContractsReport = () => {

  const [olderThan, setOlderThan] = useState(new Date().toISOString().slice(0, 10));

  const handleDateChange = (e) => {
    setOlderThan(e.target.value);
    console.log("Tìm hợp đồng hết hạn trước ngày:", e.target.value);
  };

  const data = [
    { id: 'HD099', student: 'Trần Văn A', room: 'A101', end: '2024-12-01', status: 'expired' },
    { id: 'HD102', student: 'Lê Thị B', room: 'B302', end: '2024-12-31', status: 'warning' },
  ];

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm animate-fade-in">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-bold text-gray-800 text-md">Hợp đồng hết hạn / Sắp hết hạn</h3>
        {/* Khu vực Input */}
        <div className="pt-2 flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Hết hạn trước:</span>
            <input 
                type="date" 
                value={olderThan}
                onChange={handleDateChange}
                className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
            />
        </div>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th className="w-[20%] px-6 py-3 text-left text-sm font-bold text-gray-500">Mã hợp đồng</th>
            <th className="w-[20%] px-6 py-3 text-left text-sm font-bold text-gray-500">Sinh viên</th>
            <th className="w-[15%] px-6 py-3 text-left text-sm font-bold text-gray-500">Phòng</th>
            <th className="w-[25%] px-6 py-3 text-left text-sm font-bold text-gray-500">Ngày hết hạn</th>
            <th className="w-[20%] px-6 py-3 text-left text-sm font-bold text-gray-500">Trạng thái</th>
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