import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Import Modules
import ReceiptStatusTabs from '../../components/features/manager/ReceiptStatusTabs';
import ReceiptTable from '../../components/features/manager/ReceiptTable';
import ReceiptDetailModal from '../../components/features/manager/ReceiptDetailModal';
import Input from '../../components/ui/Input';

export default function BillManagement() {
  const [currentTab, setCurrentTab] = useState('completed'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleViewDetail = (paymentItem) => {
    setSelectedPayment(paymentItem);
    setIsModalOpen(true);
  };

  // Mock Data (Dựa trên hình ảnh)
  const allData = [
    { id: 'TT001', studentId: 'SV2024001', name: 'Nguyễn Văn A', room: 'A301', type: 'Điện nước', month: '08/2024', amount: '₫425.000', date: '10:30:00 15/8/2024', status: 'completed' },
    { id: 'TT002', studentId: 'SV2024002', name: 'Trần Thị B', room: 'A205', type: 'Gia hạn', month: '-', amount: '₫1.200.000', date: '14:20:00 14/8/2024', status: 'completed' },
    { id: 'TT003', studentId: 'SV2024003', name: 'Lê Văn C', room: 'A402', type: 'Bảo hiểm', month: '-', amount: '₫250.000', date: '09:15:00 13/8/2024', status: 'completed' },
    { id: 'TT004', studentId: 'SV2024004', name: 'Phạm Thị D', room: 'A101', type: 'Điện nước', month: '08/2024', amount: '₫380.000', date: '16:45:00 12/8/2024', status: 'completed' },
  ];

  // Tính toán số lượng cho Badge và Tabs
  const counts = {
    pending: 0,
    completed: allData.filter(i => i.status === 'completed').length,
    rejected: 0
  };

  // Lọc dữ liệu theo tab
  const filteredData = allData.filter(item => item.status === currentTab);

  return (
    <div className="animate-fade-in-up space-y-6 pb-10">
      
      {/* 1. Header Page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Xác Nhận Thanh Toán</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">Xác nhận và quản lý các khoản thanh toán của sinh viên</p>
        </div>
      </div>

      {/* 2. Search & Filter Area */}
      <div className="flex flex-col gap-4">
        {/* Thanh tìm kiếm full-width */}
        <div className="w-full">
          <Input 
            placeholder="Tìm kiếm theo tên, MSSV, phòng..." 
            icon={<MagnifyingGlassIcon className="w-4 h-4" />}
            className="bg-gray-50 border-gray-100" // Style nhẹ nhàng như thiết kế
          />
        </div>

        {/* Tabs chuyển đổi trạng thái */}
        <div className="flex justify-start">
            <ReceiptStatusTabs 
                currentTab={currentTab} 
                onTabChange={setCurrentTab} 
                counts={counts}
            />
        </div>
      </div>

      {/* 3. Table Data */}
      <ReceiptTable 
        data={filteredData}
        onViewDetail={handleViewDetail}
      />

      {/* Modal Chi tiết */}
      <ReceiptDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={selectedPayment} 
      />

    </div>
  );
}