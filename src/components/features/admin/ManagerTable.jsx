import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Badge from '../../ui/Badge'; 

const ManagerTable = ({ managers, onEdit, onDelete }) => {
  
  const renderStatus = (status) => {
    if (status === 'active') {
      return <Badge type="success">Hoạt động</Badge>; 
    }
    return <Badge type="default">Ngừng</Badge>; // Màu xám
  };

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">Mã</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">Họ tên</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">Số điện thoại</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">Tòa nhà</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">Trạng thái</th>
            <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {managers.map((manager, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{manager.code}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{manager.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{manager.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{manager.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{manager.building}</td>
              
              {/* 👇 3. Gọi hàm renderStatus */}
              <td className="px-6 py-4 whitespace-nowrap">
                {renderStatus(manager.status)}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div className="flex items-center justify-center gap-2">
                  <button 
                    onClick={() => onEdit(manager)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => onDelete(manager)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa / Khóa"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerTable;