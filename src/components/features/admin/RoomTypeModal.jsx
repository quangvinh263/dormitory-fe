// src/pages/admin/RoomTypeManagementModal.jsx

import React, { useState, useEffect } from 'react';
import { XMarkIcon, PencilSquareIcon, CheckIcon, SwatchIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getRoomTypesInRegistration, updateRoomType, createRoomType, deleteRoomType } from '../../../services/roomTypeApi';

const RoomTypeModal = ({ isOpen, onClose, onUpdateRoomTypes }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [editForm, setEditForm] = useState({
    typeID: '',
    typeName: '',
    description: '',
    capacity: 0,
    price: 0
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadRoomTypes();
      resetForm();
    }
  }, [isOpen]);

  const loadRoomTypes = async () => {
    try {
      setLoading(true);
      const response = await getRoomTypesInRegistration();
      
      if (response.success) {
        setRoomTypes(response.data);
        if (onUpdateRoomTypes) {
          onUpdateRoomTypes(response.data);
        }
      } else {
        console.error('Failed to load room types:', response.message);
      }
    } catch (error) {
      console.error('Error loading room types:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedType(null);
    setIsCreateMode(false);
    setEditForm({
      typeID: '',
      typeName: '',
      description: '',
      capacity: 0,
      price: 0
    });
  };

  const handleSelectType = (roomType) => {
    setIsCreateMode(false);
    setSelectedType(roomType);
    setEditForm({
      typeID: roomType.roomTypeID,
      typeName: roomType.typeName,
      description: roomType.description,
      capacity: roomType.capacity,
      price: roomType.price
    });
  };

  const handleCreateNew = () => {
    setIsCreateMode(true);
    setSelectedType(null);
    setEditForm({
      typeID: '',
      typeName: '',
      description: '',
      capacity: 0,
      price: 0
    });
  };

  const handleDelete = async (e, roomType) => {
    e.stopPropagation(); // Prevent triggering select
    
    if (!confirm(`Bạn có chắc chắn muốn xóa loại phòng "${roomType.typeName}"?\n\nLưu ý: Chỉ có thể xóa nếu không có phòng nào đang sử dụng loại phòng này.`)) {
      return;
    }

    try {
      setDeleting(roomType.roomTypeID);
      const response = await deleteRoomType(roomType.roomTypeID);

      if (response.success) {
        alert('Xóa loại phòng thành công!');
        
        // If deleted room type is currently selected, reset form
        if (selectedType?.roomTypeID === roomType.roomTypeID) {
          resetForm();
        }
        
        await loadRoomTypes();
      } else {
        alert(`Lỗi: ${response.message}`);
      }
    } catch (error) {
      console.error('Error deleting room type:', error);
      alert('Có lỗi xảy ra khi xóa loại phòng!');
    } finally {
      setDeleting(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!editForm.typeName.trim()) {
      alert('Vui lòng nhập tên loại phòng!');
      return;
    }

    if (editForm.capacity <= 0) {
      alert('Sức chứa phải lớn hơn 0!');
      return;
    }

    if (editForm.price < 0) {
      alert('Giá phòng không được âm!');
      return;
    }

    try {
      setSubmitting(true);
      let response;

      if (isCreateMode) {
        // Create new room type
        response = await createRoomType({
          typeName: editForm.typeName,
          description: editForm.description,
          capacity: editForm.capacity,
          price: editForm.price
        });
      } else {
        // Update existing room type
        response = await updateRoomType(editForm);
      }

      if (response.success) {
        alert(isCreateMode ? 'Tạo loại phòng mới thành công!' : 'Cập nhật loại phòng thành công!');
        await loadRoomTypes();
        resetForm();
      } else {
        alert(`Lỗi: ${response.message}`);
      }
    } catch (error) {
      console.error('Error saving room type:', error);
      alert('Có lỗi xảy ra khi xử lý yêu cầu!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'price' ? Number(value) : value
    }));
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <SwatchIcon className="w-5 h-5 text-green-600"/>
            Quản lý Cấu hình Loại phòng
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={submitting}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* BODY: SPLIT VIEW */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* CỘT TRÁI: DANH SÁCH (35%) */}
          <div className="w-[35%] border-r border-gray-200 flex flex-col bg-gray-50/50">
            <div className="p-3 border-b border-gray-200 bg-white flex justify-between items-center">
              <div className="text-xs font-medium text-gray-500">
                Chọn loại phòng để chỉnh sửa
              </div>
              <button
                onClick={handleCreateNew}
                className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                title="Thêm loại phòng mới"
                disabled={submitting}
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                </div>
              ) : roomTypes.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-8">
                  Không có loại phòng nào
                </div>
              ) : (
                roomTypes.map(roomType => (
                  <div 
                    key={roomType.roomTypeID}
                    onClick={() => handleSelectType(roomType)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition
                      ${selectedType?.roomTypeID === roomType.roomTypeID 
                        ? 'bg-white border-green-500 shadow-sm ring-1 ring-green-500' 
                        : 'bg-white border-gray-200 hover:border-green-300'}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-800 text-sm flex-1">
                        {roomType.typeName}
                      </h4>
                      <div className="flex items-center gap-1 ml-2">
                        {selectedType?.roomTypeID === roomType.roomTypeID && (
                          <PencilSquareIcon className="w-4 h-4 text-green-600" />
                        )}
                        <button
                          onClick={(e) => handleDelete(e, roomType)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition disabled:opacity-50"
                          title="Xóa loại phòng"
                          disabled={deleting === roomType.roomTypeID}
                        >
                          {deleting === roomType.roomTypeID ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                          ) : (
                            <TrashIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center text-xs">
                      <span className="text-gray-500">{roomType.capacity} người</span>
                      <span className="font-semibold text-green-700">
                        {formatMoney(roomType.price)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CỘT PHẢI: FORM (65%) */}
          <div className="flex-1 p-6 overflow-y-auto bg-white">
            {selectedType || isCreateMode ? (
              <>
                <h3 className="text-md font-bold text-gray-800 mb-4 pb-2 border-b">
                  {isCreateMode ? 'Thêm loại phòng mới' : `Chỉnh sửa: ${selectedType.typeName}`}
                </h3>
                
                <form onSubmit={handleSave} className="space-y-4">
                  {/* Tên loại phòng */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên loại phòng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="typeName"
                      value={editForm.typeName}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="VD: VIP 2 người"
                      disabled={submitting}
                      required
                    />
                  </div>

                  {/* Sức chứa & Đơn giá */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sức chứa (người) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        value={editForm.capacity}
                        onChange={handleChange}
                        min="1"
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={submitting}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Đơn giá (VNĐ/tháng) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={editForm.price}
                        onChange={handleChange}
                        min="0"
                        step="100000"
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={submitting}
                        required
                      />
                    </div>
                  </div>

                  {/* Mô tả tiện ích */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả tiện ích
                    </label>
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder="VD: Máy lạnh, tủ lạnh riêng, bao điện nước..."
                      disabled={submitting}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
                      disabled={submitting}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-md transition disabled:opacity-50"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <CheckIcon className="w-5 h-5" />
                          {isCreateMode ? 'Tạo mới' : 'Lưu thay đổi'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <SwatchIcon className="w-16 h-16 mb-4" />
                <p className="text-lg font-medium">Chọn loại phòng để chỉnh sửa</p>
                <p className="text-sm mt-2">Nhấn vào loại phòng bên trái để bắt đầu</p>
                <p className="text-sm mt-1">hoặc nhấn nút + để thêm mới</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomTypeModal;