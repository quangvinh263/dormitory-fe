import React, { useState } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import ManagerTable from '../../components/features/admin/ManagerTable';
import DeleteManagerModal from '../../components/features/admin/DeleteManagerModal';
import ManagerFormModal from '../../components/features/admin/ManagerFormModal';

const ManagerManagement = () => {
  // Mock Data (Dữ liệu giả lập)
  const [managers, setManagers] = useState([
    { code: 'TT001', name: 'Nguyễn Văn A', email: 'manager.a@dorm.vn', phone: '0912345678', building: 'Tòa A', status: 'active' },
    { code: 'TT002', name: 'Trần Thị B', email: 'manager.b@dorm.vn', phone: '0923456789', building: 'Tòa B', status: 'active' },
    { code: 'TT003', name: 'Lê Văn C', email: 'manager.c@dorm.vn', phone: '0934567890', building: 'Tòa C', status: 'inactive' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState(null); // null = Create Mode, object = Edit Mode

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingManager, setDeletingManager] = useState(null);

  const handleOpenCreate = () => {
    setEditingManager(null);
    setIsFormModalOpen(true);
  };

  // Mở modal sửa
  const handleOpenEdit = (manager) => {
    setEditingManager(manager);
    setIsFormModalOpen(true);
  };

  // Xử lý Submit Form (Create & Update)
  const handleFormSubmit = (formData) => {
    if (editingManager) {
      // Logic gọi API Update
      console.log("Update Manager ID:", editingManager.id, "Data:", formData);
      alert("Đã cập nhật thành công!");
    } else {
      // Logic gọi API Create
      console.log("Create New Manager Data:", formData);
      alert("Đã thêm mới thành công!");
    }
    setIsFormModalOpen(false);
    // Sau khi API thành công thì gọi reload data...
  };

  // Mở modal xóa
  const handleOpenDelete = (manager) => {
    setDeletingManager(manager);
    setIsDeleteModalOpen(true);
  };

  // Xác nhận xóa
  const handleConfirmDelete = () => {
    console.log("Delete Manager ID:", deletingManager.id);
    // Gọi API Delete...
    alert(`Đã xóa trưởng tòa ${deletingManager.name}`);
    setIsDeleteModalOpen(false);
    setDeletingManager(null);
  };

  // Xử lý tìm kiếm
  const filteredManagers = managers.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.building.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Trưởng Tòa</h1>
          <p className="text-sm text-gray-500 mt-1">Tạo và quản lý tài khoản trưởng tòa</p>
        </div>
        
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all font-medium text-sm">
          <PlusIcon className="w-5 h-5" />
          <span>Thêm trưởng tòa</span>
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Tìm kiếm theo tên, email, tòa nhà..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 3. Data Table */}
      <ManagerTable 
        managers={filteredManagers} 
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />
      
      {/* 4. Pagination (Optional) */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-500">Hiển thị <span className="font-medium">{filteredManagers.length}</span> kết quả</p>
          <div className="flex gap-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm disabled:opacity-50" disabled>Trước</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm">Sau</button>
          </div>
      </div>

      {/* Form Modal (Create/Edit) */}  
      <ManagerFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingManager}
      />

      {/* Delete Confirmation Modal */}
      <DeleteManagerModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={deletingManager?.name}
      />

    </div>
  );
};

export default ManagerManagement;