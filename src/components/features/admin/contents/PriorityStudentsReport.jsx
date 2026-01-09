import React, { useState, useEffect } from 'react';
import Badge from '../../../ui/Badge';
import { getPriorityStudents } from '../../../../services/reportApi';

const PriorityStudentsReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPriorityStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await getPriorityStudents();
        
        if (result.success) {
          // Filter out students with "Không thuộc diện ưu tiên"
          const filteredData = result.data.filter(student => 
            student.priorityID !== 'PR-NONE' && 
            student.priorityName !== 'Không thuộc diện ưu tiên'
          );
          setData(filteredData);
        } else {
          setError(result.message || 'Không thể tải dữ liệu sinh viên ưu tiên');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchPriorityStudents();
  }, []);

  // Pagination logic
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
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 text-md">Sinh viên diện ưu tiên</h3>
        <span className="text-sm text-gray-500">Tìm thấy {data.length} sinh viên</span>
      </div>
      {data.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          Không có sinh viên diện ưu tiên
        </div>
      ) : (
        <>
      <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-500">MSSV</th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-500">Họ và tên</th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-500">Email</th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-500">Số điện thoại</th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-500">Diện ưu tiên</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentData.map((item, i) => (
            <tr key={item.studentID || i} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-bold text-gray-900 text-sm">{item.studentID || item.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.fullName || item.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.email}</td>
              <td className="px-6 py-4 text-sm text-blue-600 font-medium">{item.phoneNumber}</td>
              <td className="px-6 py-4"><Badge type="info">{item.priorityName}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị {startIndex + 1} - {Math.min(endIndex, data.length)} trong tổng số {data.length} sinh viên
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
export default PriorityStudentsReport;