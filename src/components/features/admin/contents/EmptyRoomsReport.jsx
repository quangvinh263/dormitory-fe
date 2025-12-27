import React from 'react';
import Badge from '../../../ui/Badge'; 

const EmptyRoomsReport = () => {
  const data = [
    { id: 'A101', building: 'Tòa A', type: 'Dịch vụ 4', capacity: 4, current: 2, price: 1500000 },
    { id: 'B202', building: 'Tòa B', type: 'Thường 8', capacity: 8, current: 0, price: 800000 },
  ];

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm animate-fade-in">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 text-md">Danh sách Phòng còn trống</h3>
        <span className="text-sm text-gray-500">Tìm thấy {data.length} phòng</span>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th className="w-[15%] px-6 py-3 text-left text-sm font-bold text-gray-500">Tên phòng</th>
            <th className="w-[15%] px-6 py-3 text-left text-sm font-bold text-gray-500">Loại phòng</th>
            <th className="w-[15%] px-6 py-3 text-left text-sm font-bold text-gray-500">Sức chứa</th>
            <th className="w-[15%] px-6 py-3 text-left text-sm font-bold text-gray-500">Đang ở</th>
            <th className="w-[20%] px-6 py-3 text-left text-sm font-bold text-gray-500">Giá</th>
            <th className="w-[20%] px-6 py-3 text-left text-sm font-bold text-gray-500">Tình trạng</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-bold text-gray-900 text-sm">{item.id}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.type}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.capacity}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.current}</td>
              <td className="px-6 py-4 text-sm font-medium">{item.price.toLocaleString()}đ</td>
              <td className="px-6 py-4"><Badge type="success">Còn {item.capacity - item.current} chỗ</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default EmptyRoomsReport;