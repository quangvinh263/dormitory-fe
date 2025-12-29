import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getAllManagers } from '../../../services/managerApi';
import { createBuilding, updateBuilding } from '../../../services/buildingApi';

const BuildingModal = ({ isOpen, onClose, initialData, buildings }) => {
  const [formData, setFormData] = useState({
    buildingName: '',
    managerID: ''
  });
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isEditMode = !!initialData;

  useEffect(() => {
    if (isOpen) {
      loadManagers();
      
      if (initialData) {
        // Edit mode: set existing data
        setFormData({
          buildingName: initialData.buildingName || '',
          managerID: initialData.managerID || ''
        });
      } else {
        // Create mode: reset form
        setFormData({
          buildingName: '',
          managerID: ''
        });
      }
    }
  }, [isOpen, initialData]);

  const loadManagers = async () => {
    try {
      setLoading(true);
      const response = await getAllManagers();
      
      if (response.success) {
        setManagers(response.data);
      } else {
        console.error('Failed to load managers:', response.message);
      }
    } catch (error) {
      console.error('Error loading managers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.buildingName.trim()) {
      alert('Vui lòng nhập tên tòa nhà!');
      return;
    }

    if (!formData.managerID) {
      alert('Vui lòng chọn quản lý!');
      return;
    }

    try {
      setSubmitting(true);
      let response;

      if (isEditMode) {
        // Update building
        response = await updateBuilding({
          buildingID: initialData.buildingID,
          managerID: formData.managerID
        });
      } else {
        // Create building
        response = await createBuilding({
          buildingName: formData.buildingName,
          managerID: formData.managerID
        });
      }

      if (response.success) {
        alert(isEditMode ? 'Cập nhật tòa nhà thành công!' : 'Tạo tòa nhà mới thành công!');
        onClose();
        // Reload page to refresh data
        window.location.reload();
      } else {
        alert(`Lỗi: ${response.message}`);
      }
    } catch (error) {
      console.error('Error submitting building form:', error);
      alert('Có lỗi xảy ra khi xử lý yêu cầu!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getManagerDisplayText = (manager) => {
    if (!manager.buildingDto) {
      return `${manager.fullName} (Chưa quản lý tòa nào)`;
    }
    const buildingName = manager.buildingDto.buildingName || 'Chưa quản lý tòa nào';
    return `${manager.fullName} (${buildingName})`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditMode ? 'Chỉnh sửa Tòa nhà' : 'Thêm Tòa nhà mới'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
              disabled={submitting}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Building Name - Only in Create Mode */}
              {!isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên tòa nhà <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="buildingName"
                    value={formData.buildingName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên tòa nhà"
                    disabled={submitting}
                    required
                  />
                </div>
              )}

              {/* Display Building Name in Edit Mode */}
              {isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên tòa nhà
                  </label>
                  <input
                    type="text"
                    value={formData.buildingName}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Không thể thay đổi tên tòa nhà</p>
                </div>
              )}

              {/* Manager Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quản lý <span className="text-red-500">*</span>
                </label>
                <select
                  name="managerID"
                  value={formData.managerID}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={submitting}
                  required
                >
                  <option value="">-- Chọn quản lý --</option>
                  {managers.map(manager => (
                    <option key={manager.managerID} value={manager.managerID}>
                      {getManagerDisplayText(manager)}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {managers.length} quản lý khả dụng
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            disabled={submitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={submitting || loading}
          >
            {submitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {submitting ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Tạo mới')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildingModal;