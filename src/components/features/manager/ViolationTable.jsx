import React from 'react';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

// Import UI
import Badge from '../../ui/Badge';

export default function ViolationTable({ data }) {
  
  // Helper render Badge số lần vi phạm
  const renderCountBadge = (count) => {
    if (count >= 2) return <Badge type="danger" className="bg-red-600 text-white border-0">{count} lần</Badge>;
    return <Badge type="default">{count} lần</Badge>;
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-sm text-gray-700  bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 whitespace-nowrap">Mã biên bản</th>
            <th className="px-6 py-3 whitespace-nowrap">Sinh viên</th>
            <th className="px-6 py-3 whitespace-nowrap">Phòng</th>
            <th className="px-6 py-3 whitespace-nowrap">Loại vi phạm</th>
            <th className="px-6 py-3 whitespace-nowrap">Thời gian</th>
            <th className="px-6 py-3 whitespace-nowrap text-center">Số lần</th>
            <th className="px-6 py-3 whitespace-nowrap text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="bg-white border-b hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-bold text-gray-900">{row.id}</td>
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{row.studentName}</div>
                <div className="text-xs text-gray-500">{row.studentId}</div>
              </td>
              <td className="px-6 py-4 font-medium text-gray-900">{row.room}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-sm font-medium bg-gray-100 text-gray-800">
                  {row.type}
                </span>
              </td>
              <td className="px-6 py-4 text-xs text-gray-500">{row.date}</td>
              <td className="px-6 py-4 text-center">
                {renderCountBadge(row.count)}
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors" title="Chỉnh sửa">
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}