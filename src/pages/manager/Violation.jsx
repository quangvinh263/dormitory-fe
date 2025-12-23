import React, { useState } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

import ViolationStats from '../../components/features/manager/ViolationStats';
import ViolationFilter from '../../components/features/manager/ViolationFilter';
import ViolationTable from '../../components/features/manager/ViolationTable';
import CreateViolationModal from '../../components/features/manager/CreateViolationModel';

export default function ViolationDashboard() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  // MOCK DATA
  const [violations] = useState([
    {
      id: 'VP001',
      studentId: 'SV2024001',
      studentName: 'Nguyễn Văn X',
      room: 'A301',
      type: 'Vệ sinh',
      date: '14:30 10/08/2024',
      count: 2, // Đã vi phạm 2 lần -> Badge đỏ
    },
    {
      id: 'VP002',
      studentId: 'SV2024089',
      studentName: 'Trần Thị Y',
      room: 'B205',
      type: 'Tiếng ồn',
      date: '23:15 08/08/2024',
      count: 2, // Badge đỏ
    },
    {
      id: 'VP003',
      studentId: 'SV2024156',
      studentName: 'Lê Văn Z',
      room: 'C104',
      type: 'Qua đêm',
      date: '08:00 05/08/2024',
      count: 1, // Badge thường
    },
  ]);

  const handleCreateViolation = (formData) => {
    const newViolation = {
      id: `VP00${violations.length + 1}`, 
      studentId: formData.studentId,
      studentName: 'Sinh Viên Mới',
      room: formData.room,
      type: formData.violationType || 'Khác',
      date: new Date().toLocaleString('vi-VN'), 
      count: 1, 
    };

    setViolations([newViolation, ...violations]);

    setIsModalOpen(false);
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      
      {/* 1. Header Page */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Vi Phạm</h1>
        <p className="text-sm text-gray-500 mt-1">Lập biên bản và theo dõi các lỗi vi phạm nội quy của sinh viên</p>
      </div>

      {/* 2. Cảnh báo (Alert) */}
      <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3">
        <ExclamationCircleIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <p className="text-sm text-red-800">
          <span className="font-bold">Cảnh báo:</span> Có <span className="font-bold">2 sinh viên</span> đã vi phạm từ 2 lần trở lên, cần theo dõi đặc biệt. Vi phạm lần 3 sẽ tự động kích hoạt quy trình chấm dứt hợp đồng.
        </p>
      </div>

      {/* 3. Thống kê */}
      <ViolationStats />

      {/* 4. Bộ lọc & Bảng danh sách */}
      {/* Không dùng Section bọc ngoài để tách biệt Filter và Table cho thoáng */}
      <div>
        <ViolationFilter onOpenCreateModal={() => setIsModalOpen(true)} />
        
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-md font-bold text-gray-900">Danh sách biên bản ({violations.length})</h2>
          </div>
          
          <ViolationTable data={violations} />
        </div>
      </div>
        <CreateViolationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateViolation}
        />
    </div>
  );
}