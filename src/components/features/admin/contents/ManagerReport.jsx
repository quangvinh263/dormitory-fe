import React from 'react';

const ManagerReport = () => {
  const data = [
    { code: 'QL01', name: 'Nguyễn Văn Quản', phone: '0912345678', building: 'Tòa A', email: 'quan.nv@ktx.edu.vn' },
    { code: 'QL02', name: 'Trần Thị Lý', phone: '0998765432', building: 'Tòa B', email: 'ly.tt@ktx.edu.vn' },
  ];

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm animate-fade-in">
      <div className="p-4 border-b bg-gray-50"><h3 className="font-bold text-gray-800 text-sm">Danh sách Nhân sự BQL</h3></div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500">Mã NV</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500">Họ và tên</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500">Phụ trách</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500">SĐT</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500">Email</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-bold text-gray-900 text-sm">{item.code}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
              <td className="px-6 py-4 text-sm font-medium text-blue-600">{item.building}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.phone}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ManagerReport;