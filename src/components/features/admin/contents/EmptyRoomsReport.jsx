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
        <h3 className="font-bold text-gray-800 text-sm">Danh sách Phòng còn trống</h3>
        <span className="text-xs text-gray-500">Tìm thấy {data.length} phòng</span>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Mã phòng</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tòa nhà</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Loại</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Giá</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tình trạng</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-bold text-gray-900 text-sm">{item.id}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.building}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.type}</td>
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