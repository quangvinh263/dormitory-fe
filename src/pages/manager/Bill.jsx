import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getReceiptsForManager } from '../../services/managerApi';

// Import Modules
import ReceiptStatusTabs from '../../components/features/manager/ReceiptStatusTabs';
import ReceiptTable from '../../components/features/manager/ReceiptTable';
import ReceiptDetailModal from '../../components/features/manager/ReceiptDetailModal';
import Input from '../../components/ui/Input';

export default function BillManagement() {
  const [currentTab, setCurrentTab] = useState('pending'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [receiptsData, setReceiptsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  const accountId = localStorage.getItem('accountId');

  // Fetch receipts data
  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        setLoading(true);
        const requestBody = {
          accountId: accountId,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize
        };

        console.log('Fetching receipts with request body:', requestBody);
        
        const response = await getReceiptsForManager(requestBody);
        console.log('Receipts API Response:', response);
        
        if (response.success) {
          // Map API data to component format
          const mappedData = response.data.items.map(receipt => ({
            id: receipt.receiptId,
            studentId: receipt.studentId,
            name: receipt.studentName,
            room: receipt.roomName,
            type: receipt.paymentType === 'Utility' ? 'Điện nước' : 
                  receipt.paymentType === 'MaintenanceFee' ? 'Bảo trì' : 
                  receipt.paymentType === 'RenewalContract' ? 'Gia hạn hợp đồng' :
                  receipt.paymentType === 'HealthInsurance' ? 'Bảo hiểm y tế' :
                  receipt.paymentType === 'RoomChangeCharge' ? 'Phí đổi phòng' :  
                  receipt.paymentType === 'Registration' ? 'Đăng ký ở' : receipt.paymentType,
            month: receipt.paymentType === 'Utility' ? 
                   new Date(receipt.createdDate).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }) : '-',
            amount: `₫${receipt.amount.toLocaleString('vi-VN')}`,
            date: new Date(receipt.createdDate).toLocaleDateString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }).replace(',', ''),
            status: receipt.status.toLowerCase() === 'pending' ? 'pending' :
                    receipt.status.toLowerCase() === 'success' ? 'completed' :
                    receipt.status.toLowerCase() === 'rejected' ? 'rejected' :
                    receipt.status.toLowerCase()
          }));
          
          setReceiptsData(mappedData);
          setPagination(prev => ({
            ...prev,
            totalPages: response.data.totalPages,
            totalItems: response.data.totalItems
          }));
          setError(null);
        } else {
          setError(response.message || 'Không thể tải dữ liệu hóa đơn');
        }
      } catch (err) {
        console.error('Error fetching receipts:', err);
        setError('Không thể tải dữ liệu hóa đơn');
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchReceipts();
    } else {
      setError('Không tìm thấy thông tin tài khoản');
      setLoading(false);
    }
  }, [accountId, pagination.pageIndex, pagination.pageSize]);

  const handleViewDetail = (paymentItem) => {
    setSelectedPayment(paymentItem);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPageIndex) => {
    setPagination(prev => ({
      ...prev,
      pageIndex: newPageIndex
    }));
  };

  const handleTabChange = (newTab) => {
    setCurrentTab(newTab);
    setPagination(prev => ({
      ...prev,
      pageIndex: 1 // Reset to first page when changing tab
    }));
  };

  // Tính toán số lượng cho Badge và Tabs từ dữ liệu thực
  const counts = {
    pending: receiptsData.filter(i => i.status === 'pending').length,
    completed: receiptsData.filter(i => i.status === 'completed').length,
    rejected: receiptsData.filter(i => i.status === 'rejected').length
  };

  // Lọc dữ liệu theo tab và search term
  const filteredData = receiptsData.filter(item => {
    const matchesTab = item.status === currentTab;
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.room.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <div className="animate-fade-in-up space-y-6 pb-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in-up space-y-6 pb-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up space-y-6 pb-10">
      
      {/* 1. Header Page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Xác Nhận Thanh Toán</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Xác nhận và quản lý các khoản thanh toán của sinh viên 
            ({pagination.totalItems} tổng cộng)
          </p>
        </div>
      </div>

      {/* 2. Search & Filter Area */}
      <div className="flex flex-col gap-4">
        {/* Thanh tìm kiếm full-width */}
        <div className="w-full">
          <Input 
            placeholder="Tìm kiếm theo tên, MSSV, phòng..." 
            icon={<MagnifyingGlassIcon className="w-4 h-4" />}
            className="bg-gray-50 border-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabs chuyển đổi trạng thái */}
        <div className="flex justify-start">
            <ReceiptStatusTabs 
                currentTab={currentTab} 
                onTabChange={handleTabChange} 
                counts={counts}
            />
        </div>
      </div>

      {/* 3. Table Data */}
      <ReceiptTable 
        data={filteredData}
        onViewDetail={handleViewDetail}
      />

      {/* 4. Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(pagination.pageIndex - 1)}
            disabled={pagination.pageIndex === 1}
            className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Trước
          </button>
          
          <span className="px-4 py-2 text-sm text-gray-600">
            Trang {pagination.pageIndex} / {pagination.totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.pageIndex + 1)}
            disabled={pagination.pageIndex === pagination.totalPages}
            className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sau
          </button>
        </div>
      )}

      {/* Modal Chi tiết */}
      <ReceiptDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={selectedPayment} 
      />

    </div>
  );
}