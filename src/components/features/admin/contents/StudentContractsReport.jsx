import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, CalendarIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Badge from '../../../ui/Badge';
import { getContractsByStudentId, exportStudentContracts } from '../../../../services/reportApi';

const StudentContractsReport = () => {
  const [studentId, setStudentId] = useState('');
  const [contracts, setContracts] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const itemsPerPage = 10;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!studentId.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      setCurrentPage(1);
      
      const result = await getContractsByStudentId(studentId.trim());
      
      if (result.success) {
        setContracts(result.data || []);
      } else {
        setError(result.message || 'Không thể tải dữ liệu hợp đồng');
        setContracts([]);
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi tải dữ liệu');
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(contracts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = contracts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleExport = async () => {
    if (!studentId.trim()) {
      alert('Vui lòng nhập MSSV để xuất báo cáo');
      return;
    }
    try {
      setExporting(true);
      const result = await exportStudentContracts(studentId.trim());
      if (!result.success) {
        alert(result.message || 'Đã xảy ra lỗi khi xuất báo cáo');
      }
    } catch (err) {
      alert('Đã xảy ra lỗi khi xuất báo cáo');
    } finally {
      setExporting(false);
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
        
        <div className="flex items-center gap-3">
          {/* Export Button */}
          {hasSearched && contracts.length > 0 && (
            <button
              onClick={handleExport}
              disabled={exporting}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition shadow-sm ${
                exporting
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              {exporting ? 'Đang xuất...' : 'Xuất Excel'}
            </button>
          )}
          
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
          {loading ? (
             <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-500 text-sm">
                   Đang tải dữ liệu...
                </td>
             </tr>
          ) : error ? (
             <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-red-500 text-sm">
                   {error}
                </td>
             </tr>
          ) : !hasSearched ? (
             <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-400 text-sm">
                   Vui lòng nhập Mã số sinh viên để tra cứu hợp đồng.
                </td>
             </tr>
          ) : contracts.length === 0 ? (
             <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-500 text-sm">
                   Không tìm thấy hợp đồng nào.
                </td>
             </tr>
          ) : (
             currentData.map((item, i) => {
                const startDate = item.startDate || item.StartDate;
                const endDate = item.endDate || item.EndDate;
                const contractStatus = item.status || item.contractStatus;
                const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString('vi-VN') : 'N/A';
                const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString('vi-VN') : 'N/A';
                
                return (
                <tr key={item.contractID || item.ContractID || i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 text-sm">{item.contractID || item.ContractID}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.studentName || item.StudentName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.roomName || item.RoomName}</td>
                  
                  {/* Cột Thời gian hiển thị rõ ràng ngày bắt đầu và ngày kết thúc mới nhất */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-1.5 rounded-md w-fit border border-gray-200">
                        <CalendarIcon className="w-4 h-4 text-gray-500"/>
                        <span className="font-medium">{formattedStartDate}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-bold text-blue-700">{formattedEndDate}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4" align="center">
                    {contractStatus === 'Active' 
                        ? <Badge type="success">Đang hiệu lực</Badge> 
                        : <Badge type="default">Đã kết thúc</Badge>}
                  </td>
                </tr>
                );
             })
          )}
        </tbody>
      </table>
      
      {/* Pagination */}
      {!loading && contracts.length > 0 && totalPages > 1 && (
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị {startIndex + 1} - {Math.min(endIndex, contracts.length)} trong tổng số {contracts.length} hợp đồng
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              Trước
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === page
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentContractsReport;