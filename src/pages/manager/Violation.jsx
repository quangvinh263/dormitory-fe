import React, { useState, useMemo, useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { getAllViolationsForManager, updateViolationResolution, createViolationReport } from '../../services/violationApi';

import ViolationStats from '../../components/features/manager/ViolationStats';
import ViolationFilter from '../../components/features/manager/ViolationFilter';
import ViolationTable from '../../components/features/manager/ViolationTable';
import ViolationModal from '../../components/features/manager/ViolationModal';

export default function ViolationDashboard() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'view' | 'update'
  const [selectedViolation, setSelectedViolation] = useState(null);

  // Cập nhật filters state
  const [filters, setFilters] = useState({
    search: '',
    violationCount: '', // Thay đổi từ 'floor' thành 'violationCount'
    period: ''
  });

  // API Data States
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const accountId = localStorage.getItem('accountId');

  // Fetch violations from API
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

  useEffect(() => {
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
      // --- Logic Tạo Mới qua API ---
      try {
        setCreateLoading(true);

        // Validation
        if (!formData.studentId || !formData.violationType || !formData.description) {
          throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
        }

        // Gọi API tạo vi phạm
        const createResult = await createViolationReport({
          studentId: formData.studentId,
          accountId: accountId,
          violationAct: formData.violationType,
          description: formData.description
        });

        if (!createResult.success) {
          throw new Error(createResult.message || 'Không thể tạo biên bản vi phạm');
        }

        // Refresh danh sách vi phạm sau khi tạo thành công
        await fetchViolations();

        // Hiển thị thông báo thành công
        alert('Lập biên bản vi phạm thành công!');

      } catch (err) {
        alert(`Lỗi: ${err.message}`);
        return; // Không đóng modal nếu có lỗi
      } finally {
        setCreateLoading(false);
      }
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

  // Filter tableData based on filters
  const filteredTableData = useMemo(() => {
    let filtered = [...tableData];

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.studentId.toLowerCase().includes(searchLower) ||
        item.studentName.toLowerCase().includes(searchLower) ||
        item.id.toLowerCase().includes(searchLower) ||
        item.room.toLowerCase().includes(searchLower)
      );
    }

    // Filter by violation count
    if (filters.violationCount) {
      const count = parseInt(filters.violationCount);
      filtered = filtered.filter(item => item.count === count);
    }

    // Filter by period
    if (filters.period) {
      const now = new Date();
      filtered = filtered.filter(item => {
        if (item.originalData?.violationTime === '0001-01-01T00:00:00') return false;
        
        const violationDate = new Date(item.originalData?.violationTime);
        
        switch (filters.period) {
          case 'this_month':
            return violationDate.getMonth() === now.getMonth() && 
                   violationDate.getFullYear() === now.getFullYear();
          case 'last_month':
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
            return violationDate.getMonth() === lastMonth.getMonth() && 
                   violationDate.getFullYear() === lastMonth.getFullYear();
          case 'this_week':
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            weekStart.setHours(0, 0, 0, 0);
            return violationDate >= weekStart;
          case 'yesterday':
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);
            const todayStart = new Date(now);
            todayStart.setHours(0, 0, 0, 0);
            return violationDate >= yesterday && violationDate < todayStart;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [tableData, filters]);

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
    <ViolationStats violations={violations} />

    {/* 4. Bộ lọc & Bảng danh sách */}
    <div>
      <ViolationFilter 
        filters={filters}
        onFilterChange={handleFilterChange}
        onOpenCreateModal={handleOpenCreate} 
        violations={violations}
      />
      
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md font-bold text-gray-900">
            Danh sách biên bản ({filteredTableData.length})
            {filteredTableData.length !== tableData.length && (
              <span className="text-gray-500 font-normal"> / {tableData.length}</span>
            )}
          </h2>
        </div>
        
        <ViolationTable 
          data={filteredTableData} 
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
      createLoading={createLoading}
    />
  </div>
);
}