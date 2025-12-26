import React from 'react';
import Badge from '../../../ui/Badge';

const EquipmentReport = () => {
  const data = [
    { code: 'DH-A101-01', name: 'Điều hòa Panasonic', room: 'A.101', status: 'Hỏng', note: 'Kêu to' },
    { code: 'G-B202-04', name: 'Giường tầng sắt', room: 'B.202', status: 'Tốt', note: '' },
  ];

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm animate-fade-in">
      <div className="p-4 border-b bg-gray-50"><h3 className="font-bold text-gray-800 text-sm">Tình trạng trang thiết bị</h3></div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Mã TB</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tên thiết bị</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Vị trí</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tình trạng</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Ghi chú</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-bold text-gray-900 text-sm">{item.code}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.room}</td>
              <td className="px-6 py-4">{item.status === 'Hỏng' ? <Badge type="danger">Hỏng</Badge> : <Badge type="success">Tốt</Badge>}</td>
              <td className="px-6 py-4 text-sm text-gray-500 italic">{item.note || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default EquipmentReport;