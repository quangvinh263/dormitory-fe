import React, { useState, useEffect } from 'react';
import Badge from '../../../ui/Badge';
import { getExpiredContracts, exportExpiredContracts } from '../../../../services/reportApi';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const ExpiredContractsReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const itemsPerPage = 10;
  const [olderThan, setOlderThan] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const fetchExpiredContracts = async () => {
      try {
        setLoading(true);
        setError(null);
        setCurrentPage(1); // Reset to first page when date changes
        
        const result = await getExpiredContracts(olderThan);
        
        if (result.success) {
          setData(result.data || []);
        } else {
          setError(result.message || 'Không thể tải dữ liệu hợp đồng hết hạn');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchExpiredContracts();
  }, [olderThan]);

  const handleDateChange = (e) => {
    setOlderThan(e.target.value);
  };

  // Tính toán pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

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
    try {
      setExporting(true);
      const result = await exportExpiredContracts(olderThan);
      if (!result.success) {
        alert(result.message || 'Đã xảy ra lỗi khi xuất báo cáo');
      }
    } catch (err) {
      alert('Đã xảy ra lỗi khi xuất báo cáo');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm animate-fade-in p-8">
        <div className="flex justify-center items-center">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm animate-fade-in p-8">
        <div className="flex justify-center items-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm animate-fade-in">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-md">Hợp đồng hết hạn / Sắp hết hạn</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Tìm thấy {data.length} hợp đồng</span>
            <button
              onClick={handleExport}
              disabled={exporting || data.length === 0}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition shadow-sm ${
                exporting || data.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              {exporting ? 'Đang xuất...' : 'Xuất Excel'}
            </button>
          </div>
        </div>
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
      {data.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          Không có hợp đồng hết hạn hoặc sắp hết hạn
        </div>
      ) : (
        <>
      <div className="overflow-x-auto">
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
          {currentData.map((item, i) => {
            const endDate = new Date(item.endDate || item.end);
            const today = new Date();
            const isExpired = endDate < today;
            const formattedDate = endDate.toLocaleDateString('vi-VN');
            
            return (
            <tr key={item.contractID || i} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-bold text-gray-900 text-sm">{item.contractID || item.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.studentName || item.student}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.roomName || item.room}</td>
              <td className="px-6 py-4 text-sm font-medium text-red-600">{formattedDate}</td>
              <td className="px-6 py-4">{isExpired ? <Badge type="danger">Đã hết hạn</Badge> : <Badge type="warning">Sắp hết hạn</Badge>}</td>
            </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị {startIndex + 1} - {Math.min(endIndex, data.length)} trong tổng số {data.length} hợp đồng
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
      </>
      )}
    </div>
  );
};
export default ExpiredContractsReport;