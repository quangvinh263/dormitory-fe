import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import ManagerTable from '../../components/features/admin/ManagerTable';
import DeleteManagerModal from '../../components/features/admin/DeleteManagerModal';
import ManagerFormModal from '../../components/features/admin/ManagerFormModal';
import { getAllManagers, updateManager, createManager, deleteManager } from '../../services/managerApi';

const ManagerManagement = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingManager, setDeletingManager] = useState(null);

  // Fetch managers data from API
  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const response = await getAllManagers();
      console.log('Managers API Response:', response);
      
      if (response.success) {
        // Map API data to component format with new fields
        const mappedManagers = response.data.map(manager => ({
          id: manager.managerID,
          code: manager.managerID,
          name: manager.fullName,
          email: manager.email,
          phone: manager.phoneNumber,
          address: manager.address,
          citizenId: manager.citizenId,
          dateOfBirth: manager.dateOfBirth ? new Date(manager.dateOfBirth).toISOString().split('T')[0] : '',
          building: manager.buildingDto?.buildingName || 'Chưa phân công',
          buildingId: manager.buildingDto?.buildingID
        }));
        
        setManagers(mappedManagers);
        setError(null);
      } else {
        setError(response.message || 'Không thể tải dữ liệu trưởng tòa');
      }
    } catch (err) {
      console.error('Error fetching managers:', err);
      setError('Không thể tải dữ liệu trưởng tòa');
    } finally {
      setLoading(false);
    }
  };

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
  const handleFormSubmit = async (formData) => {
    try {
      if (editingManager) {
        // UPDATE MODE: Gọi API Update
        const updateData = {
          managerID: editingManager.id,
          fullName: formData.FullName,
          citizenId: formData.CitizenID,
          dateOfBirth: formData.DateOfBirth,
          phoneNumber: formData.PhoneNumber,
          address: formData.Address
        };

        console.log("Update Manager Data:", updateData);
        
        const response = await updateManager(updateData);
        
        if (response.success) {
          alert("Cập nhật thông tin trưởng tòa thành công!");
          setIsFormModalOpen(false);
          // Reload danh sách managers
          fetchManagers();
        } else {
          alert(`Lỗi: ${response.message}`);
        }
      } else {
        // CREATE MODE: Gọi API Create
        const createData = {
          email: formData.Email,
          password: formData.Password,
          fullName: formData.FullName,
          phoneNumber: formData.PhoneNumber,
          address: formData.Address,
          citizenId: formData.CitizenID,
          dateOfBirth: formData.DateOfBirth
        };

        console.log("Create New Manager Data:", createData);
        
        const response = await createManager(createData);
        
        if (response.success) {
          alert("Tạo tài khoản trưởng tòa thành công!");
          setIsFormModalOpen(false);
          // Reload danh sách managers
          fetchManagers();
        } else {
          alert(`Lỗi: ${response.message}`);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Có lỗi xảy ra khi xử lý yêu cầu!');
    }
  };

  // Mở modal xóa
  const handleOpenDelete = (manager) => {
    setDeletingManager(manager);
    setIsDeleteModalOpen(true);
  };

  // Xác nhận xóa
  const handleConfirmDelete = async () => {
    console.log("Delete Manager ID:", deletingManager.id);
    const response = await deleteManager(deletingManager.id);
    if (!response.success) {
      alert(`Lỗi: ${response.message}`);
      return;
    }
    window.location.reload();
    alert(`Đã xóa trưởng tòa ${deletingManager.name}`);
    setIsDeleteModalOpen(false);
    setDeletingManager(null);
  };

  // Xử lý tìm kiếm
  const filteredManagers = managers.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in-up">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in-up">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Trưởng Tòa</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tạo và quản lý tài khoản trưởng tòa ({managers.length} trưởng tòa)
          </p>
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
            placeholder="Tìm kiếm theo tên, email, tòa nhà, địa chỉ..."
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
          <p className="text-sm text-gray-500">
            Hiển thị <span className="font-medium">{filteredManagers.length}</span> / <span className="font-medium">{managers.length}</span> kết quả
          </p>
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