import React, { useState, useMemo } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

import ViolationStats from '../../components/features/manager/ViolationStats';
import ViolationFilter from '../../components/features/manager/ViolationFilter';
import ViolationTable from '../../components/features/manager/ViolationTable';
import ViolationModal from '../../components/features/manager/ViolationModal';

export default function ViolationDashboard() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'view' | 'update'
  const [selectedViolation, setSelectedViolation] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    floor: '',
    period: ''
  });

  // MOCK DATA
  const [violations, setViolations] = useState([
    // SV A - Lỗi mới nhất
    { id: 'VP005', studentId: 'SV2024001', studentName: 'Nguyễn Văn A', room: 'A301', type: 'Tiếng ồn', date: '20:00 15/12/2024', description: 'Hát karaoke...', resolution: '' },
    // SV A - Lỗi cũ
    { id: 'VP001', studentId: 'SV2024001', studentName: 'Nguyễn Văn A', room: 'A301', type: 'Vệ sinh', date: '09:00 10/11/2024', description: 'Xả rác...', resolution: 'Đã nhắc nhở' },
    
    // SV B
    { id: 'VP002', studentId: 'SV2024089', studentName: 'Trần Thị B', room: 'B205', type: 'An ninh', date: '23:15 08/12/2024', description: 'Dẫn người lạ...', resolution: 'Cảnh cáo' },
    
    // SV D - Lỗi 3
    { id: 'VP004', studentId: 'SV2024999', studentName: 'Phạm Văn D', room: 'A404', type: 'Gây rối', date: '22:30 01/12/2024', description: 'Đánh bài...', resolution: 'Đuổi' },
    // SV D - Lỗi 2
    { id: 'VP006', studentId: 'SV2024999', studentName: 'Phạm Văn D', room: 'A404', type: 'Rượu bia', date: '20:00 20/11/2024', description: 'Uống rượu...', resolution: 'Cảnh cáo' },
    // SV D - Lỗi 1
    { id: 'VP007', studentId: 'SV2024999', studentName: 'Phạm Văn D', room: 'A404', type: 'Vệ sinh', date: '10:00 01/11/2024', description: 'Dơ bẩn...', resolution: 'Nhắc nhở' },
  ]);

  const tableData = useMemo(() => {
    // 1. Tạo Map để gom nhóm theo MSSV
    const studentMap = new Map();

    violations.forEach(v => {
      if (!studentMap.has(v.studentId)) {
        // Nếu chưa có, tạo mới
        studentMap.set(v.studentId, {
          latestViolation: v, // Giả sử data đã sắp xếp theo thời gian, hoặc so sánh date ở đây
          count: 1
        });
      } else {
        // Nếu đã có, cập nhật count và so sánh xem cái nào mới hơn
        const current = studentMap.get(v.studentId);
        current.count += 1;
        
        // Logic đơn giản: ID lớn hơn là mới hơn (hoặc so sánh Date string)
        // Ở đây mình giả định record nằm trên (index nhỏ) là mới hơn theo thói quen log
        // Nếu muốn chắc ăn thì parse Date
      }
    });

    // 2. Chuyển Map thành Array để hiển thị ra bảng
    // Lúc này mỗi item đại diện cho 1 SINH VIÊN (với thông tin của lỗi mới nhất)
    return Array.from(studentMap.values()).map(item => ({
      ...item.latestViolation, // Lấy thông tin lỗi mới nhất làm đại diện hiển thị
      count: item.count        // Ghi đè số lần vi phạm thực tế
    }));

  }, [violations]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedViolation(null);
    setIsModalOpen(true);
  };

  const handleOpenView = (violation) => {
    setModalMode('view');
    setSelectedViolation(violation);
    setIsModalOpen(true);
  };

  const handleOpenUpdate = (violation) => {
    setModalMode('update');
    setSelectedViolation(violation);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formData, mode) => {
    if (mode === 'create') {
      // --- Logic Tạo Mới ---
      const newViolation = {
        id: `VP00${violations.length + 1}`,
        studentId: formData.studentId,
        studentName: 'Sinh Viên Mới', // Tạm thời hardcode
        room: formData.room,
        type: formData.violationType || 'Khác',
        description: formData.description,
        resolution: '', // Mới tạo chưa có xử lý
        date: new Date().toLocaleString('vi-VN'),
        count: 1,
      };
      setViolations([newViolation, ...violations]);
    } 
    else if (mode === 'update') {
      // --- Logic Cập Nhật ---
      // Tìm và update dòng tương ứng
      const updatedList = violations.map(v => 
        v.id === selectedViolation.id 
          ? { ...v, resolution: formData.resolution } // Chỉ cập nhật resolution
          : v
      );
      setViolations(updatedList);
    }

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
      <div>
        <ViolationFilter 
          filters={filters}                   // Truyền state filters
          onFilterChange={handleFilterChange} // Truyền hàm xử lý change
          onOpenCreateModal={handleOpenCreate} 
        />
        
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mt-6">
          <div className="flex justify-between items-center mb-4">
            {/* Hiển thị số lượng sinh viên vi phạm, không phải số biên bản */}
            <h2 className="text-md font-bold text-gray-900">Danh sách biên bản ({tableData.length})</h2>
          </div>
          
          <ViolationTable 
            data={tableData} 
            onView={handleOpenView}    // Truyền hàm xem
            onUpdate={handleOpenUpdate} // Truyền hàm sửa
          />
        </div>
      </div>
        <ViolationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}    // Hàm xử lý chung
        mode={modalMode}                // Chế độ (create/view/update)
        initialData={selectedViolation} // Dữ liệu dòng đang chọn
        allViolations={violations}
      />
    </div>
  );
}