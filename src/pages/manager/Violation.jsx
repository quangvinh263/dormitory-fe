import React, { useState, useMemo, useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { getAllViolationsForManager, updateViolationResolution } from '../../services/violationApi';

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

  // API Data States
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  const accountId = localStorage.getItem('accountId');

  // Fetch violations from API
  useEffect(() => {
    const fetchViolations = async () => {
      try {
        setLoading(true);
        setError('');

        const result = await getAllViolationsForManager(accountId);

        if (!result.success) {
          throw new Error(result.message || 'Không thể tải danh sách vi phạm');
        }

        const apiData = result.data || [];

        // Map API response to component format
        const mappedViolations = apiData.map(item => ({
          id: item.violationId || `VIO-${Date.now()}-${Math.random()}`, // Tạo ID tạm nếu null
          studentId: item.studentId,
          studentName: item.studentName,
          room: item.roomName,
          type: item.violationAct,
          date: item.violationTime === '0001-01-01T00:00:00' 
            ? 'Chưa cập nhật' 
            : new Date(item.violationTime).toLocaleString('vi-VN'),
          description: item.description,
          resolution: item.resolution || '',
          totalViolations: item.totalViolationsOfStudent,
          // Thêm thông tin gốc để dễ xử lý
          originalData: item
        }));

        setViolations(mappedViolations);

      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu vi phạm');
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchViolations();
    }
  }, [accountId]);

  const tableData = useMemo(() => {
    if (violations.length === 0) return [];

    // 1. Tạo Map để gom nhóm theo MSSV
    const studentMap = new Map();

    violations.forEach(v => {
      if (!studentMap.has(v.studentId)) {
        // Nếu chưa có, tạo mới
        studentMap.set(v.studentId, {
          latestViolation: v,
          count: v.totalViolations || 1 // Dùng totalViolations từ API
        });
      } else {
        // Nếu đã có, cập nhật nếu vi phạm này mới hơn
        const current = studentMap.get(v.studentId);
        
        // So sánh thời gian để lấy vi phạm mới nhất
        const currentTime = new Date(current.latestViolation.originalData.violationTime);
        const newTime = new Date(v.originalData.violationTime);
        
        if (newTime > currentTime) {
          current.latestViolation = v;
        }
        
        // Cập nhật count từ API (totalViolationsOfStudent)
        current.count = v.totalViolations || current.count;
      }
    });

    // 2. Chuyển Map thành Array để hiển thị ra bảng
    return Array.from(studentMap.values()).map(item => ({
      ...item.latestViolation,
      count: item.count // Số lần vi phạm thực tế của sinh viên
    }));

  }, [violations]);

  // Tính số sinh viên vi phạm >= 2 lần cho cảnh báo
  const criticalStudents = useMemo(() => {
    return tableData.filter(item => item.count >= 2).length;
  }, [tableData]);

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

  const handleModalSubmit = async (formData, mode) => {
    if (mode === 'create') {
      // --- Logic Tạo Mới ---
      const newViolation = {
        id: `VP-${Date.now()}`,
        studentId: formData.studentId,
        studentName: 'Sinh Viên Mới', // TODO: Tìm tên từ studentId
        room: formData.room,
        type: formData.violationType || 'Khác',
        description: formData.description,
        resolution: '',
        date: new Date().toLocaleString('vi-VN'),
        totalViolations: 1,
      };
      setViolations([newViolation, ...violations]);
    } 
    else if (mode === 'update') {
      // --- Logic Cập Nhật qua API ---
      try {
        setUpdateLoading(true);

        // Tìm violationId từ originalData
        const violationId = selectedViolation.originalData?.violationId || selectedViolation.id;
        
        if (!violationId) {
          throw new Error('Không thể cập nhật vi phạm này (không có ID hợp lệ)');
        }

        // Gọi API cập nhật
        const updateResult = await updateViolationResolution({
          violationId: violationId,
          resolution: formData.resolution
        });

        if (!updateResult.success) {
          throw new Error(updateResult.message || 'Không thể cập nhật xử lý vi phạm');
        }

        // Cập nhật local state
        const updatedList = violations.map(v => 
          v.id === selectedViolation.id 
            ? { ...v, resolution: formData.resolution }
            : v
        );
        setViolations(updatedList);

        // Hiển thị thông báo thành công
        alert('Cập nhật xử lý vi phạm thành công!');

      } catch (err) {
        alert(`Lỗi: ${err.message}`);
        return; // Không đóng modal nếu có lỗi
      } finally {
        setUpdateLoading(false);
      }
    }

    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="animate-fade-in-up space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Vi Phạm</h1>
          <p className="text-sm text-gray-500 mt-1">Lập biên bản và theo dõi các lỗi vi phạm nội quy của sinh viên</p>
        </div>
        <div className="text-center py-8 text-gray-500">
          Đang tải dữ liệu vi phạm...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in-up space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Vi Phạm</h1>
          <p className="text-sm text-gray-500 mt-1">Lập biên bản và theo dõi các lỗi vi phạm nội quy của sinh viên</p>
        </div>
        <div className="text-center py-8 text-red-500">
          Lỗi: {error}
        </div>
      </div>
    );
  }

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
          <span className="font-bold">Cảnh báo:</span> Có <span className="font-bold">{criticalStudents} sinh viên</span> đã vi phạm từ 2 lần trở lên, cần theo dõi đặc biệt. Vi phạm lần 3 sẽ tự động kích hoạt quy trình chấm dứt hợp đồng.
        </p>
      </div>

      {/* 3. Thống kê */}
      <ViolationStats />

      {/* 4. Bộ lọc & Bảng danh sách */}
      <div>
        <ViolationFilter 
          filters={filters}
          onFilterChange={handleFilterChange}
          onOpenCreateModal={handleOpenCreate} 
        />
        
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-md font-bold text-gray-900">Danh sách biên bản ({tableData.length})</h2>
          </div>
          
          <ViolationTable 
            data={tableData} 
            onView={handleOpenView}
            onUpdate={handleOpenUpdate}
          />
        </div>
      </div>
      
      <ViolationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        mode={modalMode}
        initialData={selectedViolation}
        allViolations={violations}
        updateLoading={updateLoading}
      />
    </div>
  );
}