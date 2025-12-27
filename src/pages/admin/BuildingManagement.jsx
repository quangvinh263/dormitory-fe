import React, { useState } from 'react';
import { 
  BuildingOffice2Icon, 
  PlusIcon,
  SwatchIcon, 
  PencilSquareIcon,  
  HomeModernIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

import Badge from '../../components/ui/Badge'; 
import BuildingStats from '../../components/features/admin/BuildingStats';
import BuildingModal from '../../components/features/admin/BuildingModal'; 
import RoomModal from '../../components/features/admin/RoomModal';
import RoomTypeModal from '../../components/features/admin/RoomTypeModal';

const BuildingManagement = () => {
  // --- 1. MOCK DATA THEO SCHEMA ---
  
  // Bảng Buildings
  const [buildings, setBuildings] = useState([
    { BuildingID: 1, BuildingName: 'Tòa nhà A', ManagerID: 'MN001', ManagerName: 'Nguyễn Văn A' },
    { BuildingID: 2, BuildingName: 'Tòa nhà B', ManagerID: 'MN002', ManagerName: 'Trần Thị B' },
  ]);

  // Bảng RoomTypes (Lưu giá và tên loại)
  const [roomTypes, setRoomTypes] = useState([
    { RoomTypeID: 1, TypeName: 'Thường 8 người', Capacity: 8, Price: 800000, Description: 'Phòng tiêu chuẩn' },
    { RoomTypeID: 2, TypeName: 'Dịch vụ 4 người', Capacity: 4, Price: 1500000, Description: 'Phòng máy lạnh' },
    { RoomTypeID: 3, TypeName: 'VIP 2 người', Capacity: 2, Price: 2500000, Description: 'Full nội thất' },
  ]);

  // Bảng Rooms
  const [rooms, setRooms] = useState([
    { RoomID: 101, BuildingID: 1, RoomTypeID: 2, RoomName: 'A.101', Capacity: 4, CurrentOccupancy: 3, RoomStatus: 'Available', IsUnderMaintenance: false, IsBeingCleaned: false, Gender: 'Nam' },
    { RoomID: 102, BuildingID: 1, RoomTypeID: 1, RoomName: 'A.102', Capacity: 8, CurrentOccupancy: 8, RoomStatus: 'Full', IsUnderMaintenance: false, IsBeingCleaned: false, Gender: 'Nam' },
    { RoomID: 103, BuildingID: 1, RoomTypeID: 1, RoomName: 'A.103', Capacity: 8, CurrentOccupancy: 0, RoomStatus: 'Maintenance', IsUnderMaintenance: true, IsBeingCleaned: false, Gender: 'Nam' },
    { RoomID: 201, BuildingID: 2, RoomTypeID: 2, RoomName: 'B.201', Capacity: 4, CurrentOccupancy: 2, RoomStatus: 'Available', IsUnderMaintenance: false, IsBeingCleaned: true, Gender: 'Nữ' },
  ]);

  // --- STATE ---
  const [selectedBuildingID, setSelectedBuildingID] = useState(1);
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isRoomTypeModalOpen, setIsRoomTypeModalOpen] = useState(false);

  // Filter Data
  const currentRooms = rooms.filter(r => r.BuildingID === selectedBuildingID);
  const currentBuilding = buildings.find(b => b.BuildingID === selectedBuildingID);

  // Helpers
  const getRoomType = (id) => roomTypes.find(t => t.RoomTypeID === id);
  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  // Handlers
  const handleEditBuilding = (e, building) => {
    e.stopPropagation();
    setEditingItem(building);
    setIsBuildingModalOpen(true);
  };

  const handleEditRoom = (room) => {
    setEditingItem(room);
    setIsRoomModalOpen(true);
  };

  // Helper render status
  const renderRoomStatus = (room) => {
    if (room.IsUnderMaintenance) return <Badge type="danger">Bảo trì</Badge>;
    if (room.IsBeingCleaned) return <Badge type="warning">Đang dọn</Badge>;
    if (room.CurrentOccupancy >= room.Capacity) return <Badge type="default">Đã đầy</Badge>;
    return <Badge type="success">Còn chỗ</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up h-full flex flex-col">
      
      {/* HEADER */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Tòa nhà & Phòng</h1>
          <p className="text-sm text-gray-500 mt-1">Cấu hình sơ đồ phòng ốc ký túc xá</p>
        </div>
      </div>

      <div className='shrink-0'>
        <BuildingStats rooms={rooms} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* === CỘT TRÁI: DANH SÁCH TÒA NHÀ (Buildings) === */}
        <div className="w-full lg:w-1/4 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <BuildingOffice2Icon className="w-5 h-5"/> Danh sách Tòa
            </h3>
            <button 
              onClick={() => { setEditingItem(null); setIsBuildingModalOpen(true); }}
              className="p-1.5 bg-white border hover:bg-gray-100 rounded-lg text-blue-600 transition"
            >
              <PlusIcon className="w-5 h-5"/>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {buildings.map(b => (
              <div 
                key={b.BuildingID}
                onClick={() => setSelectedBuildingID(b.BuildingID)}
                className={`group p-4 rounded-xl border-2 cursor-pointer transition-all relative
                  ${selectedBuildingID === b.BuildingID 
                    ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500' 
                    : 'border-transparent bg-gray-50 hover:bg-gray-100 hover:border-gray-200'}
                `}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-bold text-lg ${selectedBuildingID === b.BuildingID ? 'text-blue-700' : 'text-gray-800'}`}>
                        {b.BuildingName}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">Quản lý: {b.ManagerName}</p>
                  </div>
                  <div className={`flex gap-1 ${selectedBuildingID === b.BuildingID ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button onClick={(e) => handleEditBuilding(e, b)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md"><PencilSquareIcon className="w-4 h-4"/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === CỘT PHẢI: DANH SÁCH PHÒNG (Rooms join RoomTypes) === */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center shrink-0">
             <div>
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <HomeModernIcon className="w-5 h-5 text-gray-500"/> 
                  Danh sách phòng - {currentBuilding?.BuildingName}
                </h3>
             </div>
            <div className="flex gap-3">
                 <button 
                    onClick={() => setIsRoomTypeModalOpen(true)}
                    className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition"
                    title="Cấu hình giá và loại phòng"
                 >
                   <SwatchIcon className="w-5 h-5 text-green-600"/> 
                   <span className="hidden sm:inline">QL Loại phòng</span>
                 </button>

                 <button 
                    onClick={() => { setEditingItem(null); setIsRoomModalOpen(true); }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
                 >
                   <PlusIcon className="w-5 h-5"/> 
                   <span className="hidden sm:inline">Thêm phòng</span>
                 </button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Tên phòng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Loại phòng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Giới tính</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Giá (RoomType)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Sức chứa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Trạng thái</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500">Sửa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {currentRooms.map((room) => {
                    const rType = getRoomType(room.RoomTypeID);
                    return (
                        <tr key={room.RoomID} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-bold text-gray-900">{room.RoomName}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{rType?.TypeName}</td>
                            
                            {/* Cột Gender */}
                            <td className="px-6 py-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${room.Gender === 'Nam' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
                                    {room.Gender}
                                </span>
                            </td>

                            {/* Cột Price (Lấy từ RoomType) */}
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {formatMoney(rType?.Price || 0)}
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <UsersIcon className="w-4 h-4 text-gray-400"/>
                                    <span className="text-sm">{room.CurrentOccupancy}/{room.Capacity}</span>
                                </div>
                            </td>

                            {/* Cột Status (Logic phức tạp) */}
                            <td className="px-6 py-4">
                                {renderRoomStatus(room)}
                            </td>

                            <td className="px-6 py-4 text-center">
                                <button onClick={() => handleEditRoom(room)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-md">
                                    <PencilSquareIcon className="w-5 h-5"/>
                                </button>
                            </td>
                        </tr>
                    );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <BuildingModal 
        isOpen={isBuildingModalOpen} 
        onClose={() => setIsBuildingModalOpen(false)} 
        initialData={editingItem} 
      />
      <RoomModal 
        isOpen={isRoomModalOpen} 
        onClose={() => setIsRoomModalOpen(false)} 
        initialData={editingItem} 
        currentBuildingName={currentBuilding?.BuildingName}
        roomTypes={roomTypes} // Truyền RoomTypes vào để select
      />

      <RoomTypeModal 
        isOpen={isRoomTypeModalOpen}
        onClose={() => setIsRoomTypeModalOpen(false)}
        roomTypes={roomTypes}
        onUpdateRoomTypes={setRoomTypes} // Hàm cập nhật state roomTypes của cha
      />

    </div>
  );
};

export default BuildingManagement;