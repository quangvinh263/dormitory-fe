import React, { useState } from 'react';
import { MagnifyingGlassIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Badge from '../../../ui/Badge';

const StudentContractsReport = () => {
  const [studentId, setStudentId] = useState('');
  const [contracts, setContracts] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!studentId.trim()) return;
    setHasSearched(true);

    // MOCK DATA: Mô phỏng logic BE update trực tiếp vào bản ghi cũ
    // Dữ liệu chỉ gồm các trường cơ bản từ StudentContractDto của bạn
    if (studentId === 'SV001') {
        setContracts([
            { 
              ContractID: 'HĐ-SV001-A101', 
              StudentName: 'Nguyễn Văn A', 
              RoomName: 'A.101', 
              StartDate: '2023-09-01', // Ngày vào đầu tiên
              EndDate: '2025-06-30',   // Ngày kết thúc mới nhất (đã cập nhật)
              ContractStatus: 'Active'
            }
        ]);
    } else {
        setContracts([]);
    }
  };

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm animate-fade-in">
      
      {/* HEADER */}
      <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
            <h3 className="font-bold text-gray-800 text-md">Tra cứu thông tin Hợp đồng</h3>
            <p className="text-sm text-gray-500 mt-0.5">Xem thời hạn hợp đồng hiện tại của sinh viên</p>
        </div>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Nhập MSSV (VD: SV001)..."
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-48 shadow-sm"
                />
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-2.5 top-1.5" />
            </div>
            <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition shadow-sm">
                Tra cứu
            </button>
        </form>
      </div>

      {/* TABLE */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th className="w-[20%] px-6 py-3 text-left text-sm font-bold text-gray-500 tracking-wider">Mã hợp đồng</th>
            <th className="w-[15%] px-6 py-3 text-left text-sm font-bold text-gray-500 tracking-wider">Sinh viên</th>
            <th className="w-[15%] px-6 py-3 text-left text-sm font-bold text-gray-500 tracking-wider">Phòng</th>
            <th className="w-[30%] px-6 py-3 text-left text-sm font-bold text-gray-500 tracking-wider">Thời hạn (Ngày bắt đầu - Ngày kết thúc)</th>
            <th className="w-[20%] px-6 py-3 text-center text-sm font-bold text-gray-500 tracking-wider">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {!hasSearched ? (
             <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-400 text-sm">
                   Vui lòng nhập Mã số sinh viên để xem thông tin hợp đồng.
                </td>
             </tr>
          ) : contracts.length === 0 ? (
             <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-500 text-sm">
                   Không tìm thấy hợp đồng nào cho sinh viên này.
                </td>
             </tr>
          ) : (
             contracts.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 text-sm">{item.ContractID}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.StudentName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.RoomName}</td>
                  
                  {/* Cột Thời gian hiển thị rõ ràng ngày bắt đầu và ngày kết thúc mới nhất */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-1.5 rounded-md w-fit border border-gray-200">
                        <CalendarIcon className="w-4 h-4 text-gray-500"/>
                        <span className="font-medium">{item.StartDate}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-bold text-blue-700">{item.EndDate}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4" align="center">
                    {item.ContractStatus === 'Active' 
                        ? <Badge type="success">Đang hiệu lực</Badge> 
                        : <Badge type="default">Đã kết thúc</Badge>}
                  </td>
                </tr>
             ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentContractsReport;