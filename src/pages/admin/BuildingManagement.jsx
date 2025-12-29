import React, { useState, useEffect } from 'react';
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
import { 
  getBuildingsForRegistration, 
  getBuildingsWithManager, 
  getRoomsResponseByManager,
  buildingsStats
} from '../../services/buildingApi';
import { getRoomTypesInRegistration } from '../../services/roomTypeApi';
import { updateRoom, createRoom } from '../../services/roomApi';

const BuildingManagement = () => {
  // --- STATE ---
  const [buildings, setBuildings] = useState([]);
  const [buildingsWithManager, setBuildingsWithManager] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalAvailableRooms: 0,
    totalFullRooms: 0,
    totalMaintenanceRooms: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBuildingID, setSelectedBuildingID] = useState(null);
  const [selectedManagerID, setSelectedManagerID] = useState(null);
  
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isRoomTypeModalOpen, setIsRoomTypeModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // --- LOAD DATA FROM API ---
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const statsResponse = await buildingsStats();
      console.log('Building Stats Response:', statsResponse);
      
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
      // 1. Load danh sách tòa nhà cơ bản
      const buildingsResponse = await getBuildingsForRegistration();
      console.log('Buildings Response:', buildingsResponse);
      
      if (buildingsResponse.success) {
        setBuildings(buildingsResponse.data);
        
        // 2. Load thông tin tòa nhà với manager cho từng tòa
        const buildingsWithManagerPromises = buildingsResponse.data.map(building => 
          getBuildingsWithManager(building.buildingID)
        );
        
        const buildingsWithManagerResponses = await Promise.all(buildingsWithManagerPromises);
        
        // Combine data từ các response
        const buildingsWithManagerData = [];
        buildingsWithManagerResponses.forEach((response, index) => {
          if (response.success && response.data.length > 0) {
            buildingsWithManagerData.push(response.data[0]); // Mỗi tòa có 1 manager
          } else {
            // Nếu không có manager, vẫn thêm building info
            const originalBuilding = buildingsResponse.data[index];
            buildingsWithManagerData.push({
              buildingID: originalBuilding.buildingID,
              buildingName: originalBuilding.buildingName,
              managerID: null,
              managerName: 'Chưa phân công'
            });
          }
        });
        
        setBuildingsWithManager(buildingsWithManagerData);
        
        // 3. Tự động chọn tòa đầu tiên và load phòng
        if (buildingsWithManagerData.length > 0) {
          const firstBuilding = buildingsWithManagerData[0];
          setSelectedBuildingID(firstBuilding.buildingID);
          setSelectedManagerID(firstBuilding.managerID);
          
          if (firstBuilding.managerID) {
            await loadRoomsByManager(firstBuilding.managerID);
          }
          const statsResponse = await buildingsStats();
          if (statsResponse.success) {
            setStats(statsResponse.data);
          }
        }
      } else {
        setError(buildingsResponse.message);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Không thể tải dữ liệu tòa nhà');
    } finally {
      setLoading(false);
    }
  };

  const loadRoomsByManager = async (managerId) => {
    if (!managerId) {
      setRooms([]);
      return;
    }
    
    try {
      const roomsResponse = await getRoomsResponseByManager(managerId);
      console.log('Rooms Response:', roomsResponse);
      
      if (roomsResponse.success) {
        setRooms(roomsResponse.data);
      } else {
        console.error('Failed to load rooms:', roomsResponse.message);
        setRooms([]);
      }
    } catch (err) {
      console.error('Error loading rooms:', err);
      setRooms([]);
    }
  };

  const loadRoomTypes = async () => {
    try {
      const roomTypesResponse = await getRoomTypesInRegistration();
      console.log('Room Types Response:', roomTypesResponse);
      
      if (roomTypesResponse.success) {
        setRoomTypes(roomTypesResponse.data);
        return roomTypesResponse.data;
      } else {
        console.error('Failed to load room types:', roomTypesResponse.message);
        return [];
      }
    } catch (err) {
      console.error('Error loading room types:', err);
      return [];
    }
  };

  // --- HANDLERS ---
  const handleBuildingSelect = async (buildingData) => {
    setSelectedBuildingID(buildingData.buildingID);
    setSelectedManagerID(buildingData.managerID);
    
    // Load rooms cho manager này
    if (buildingData.managerID) {
      await loadRoomsByManager(buildingData.managerID);
    } else {
      setRooms([]);
    }
  };

  const handleEditBuilding = (e, building) => {
    e.stopPropagation();
    setEditingItem(building);
    setIsBuildingModalOpen(true);
  };

  const handleOpenBuildingModal = () => {
    setEditingItem(null);
    setIsBuildingModalOpen(true);
  };

  const handleEditRoom = async (room) => {
    setModalLoading(true);
    
    // Load room types trước khi mở modal
    await loadRoomTypes();
    
    setEditingItem(room);
    setIsRoomModalOpen(true);
    setModalLoading(false);
  };

  const handleOpenRoomModal = async () => {
    setModalLoading(true);
    
    // Load room types trước khi mở modal
    await loadRoomTypes();
    
    setEditingItem(null);
    setIsRoomModalOpen(true);
    setModalLoading(false);
  };

  const handleOpenRoomTypeModal = async () => {
    setModalLoading(true);
    
    // Load room types trước khi mở modal
    await loadRoomTypes();
    
    setIsRoomTypeModalOpen(true);
    setModalLoading(false);
  };

  // Handle Room Form Submit (Create/Update)
  const handleRoomSubmit = async (formData) => {
    try {
      if (editingItem) {
        // UPDATE MODE: Gọi API Update Room
        const updateData = {
          roomID: editingItem.roomID,
          gender: formData.Gender === 'Nam' ? 'Male' : 'Female', // Convert Vietnamese to English
          roomStatus: formData.RoomStatus || "",
          isUnderMaintenance: formData.IsUnderMaintenance,
          isBeingCleaned: formData.IsBeingCleaned
        };

        console.log("Update Room Data:", updateData);
        
        const response = await updateRoom(updateData);
        
        if (response.success) {
          alert("Cập nhật phòng thành công!");
          setIsRoomModalOpen(false);
          // Reload rooms để hiển thị data mới
          if (selectedManagerID) {
            await loadRoomsByManager(selectedManagerID);
          }
        } else {
          alert(`Lỗi: ${response.message}`);
        }
      } else {
        // CREATE MODE: Gọi API Create Room
        if (!selectedBuildingID) {
          alert("Vui lòng chọn tòa nhà trước khi tạo phòng!");
          return;
        }

        const createData = {
          buildingId: selectedBuildingID,
          roomTypeId: formData.RoomTypeID,
          gender: formData.Gender === 'Nam' ? 'Male' : 'Female', // Convert Vietnamese to English
          isUnderMaintenance: formData.IsUnderMaintenance,
          isBeingCleaned: formData.IsBeingCleaned,
          roomName: formData.RoomName
        };

        console.log("Create New Room Data:", createData);
        
        const response = await createRoom(createData);
        
        if (response.success) {
          alert("Tạo phòng mới thành công!");
          setIsRoomModalOpen(false);
          // Reload rooms để hiển thị phòng mới
          if (selectedManagerID) {
            await loadRoomsByManager(selectedManagerID);
          }
        } else {
          alert(`Lỗi: ${response.message}`);
        }
      }
    } catch (error) {
      console.error('Error submitting room form:', error);
      alert('Có lỗi xảy ra khi xử lý yêu cầu!');
    }
  };

  // Filter Data
  const currentRooms = rooms; // Đã được filter theo manager
  const currentBuilding = buildingsWithManager.find(b => b.buildingID === selectedBuildingID);

  // Helpers
  const getRoomType = (id) => roomTypes.find(t => t.roomTypeID === id);
  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  // Helper render status
  const renderRoomStatus = (room) => {
    if (room.isUnderMaintenance) return <Badge type="danger">Bảo trì</Badge>;
    if (room.isBeingCleaned) return <Badge type="warning">Đang dọn</Badge>;
    if (room.currentOccupancy >= room.capacity) return <Badge type="default">Đã đầy</Badge>;
    return <Badge type="success">Còn chỗ</Badge>;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Đang tải dữ liệu tòa nhà...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
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
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up h-full flex flex-col">
      
      {/* HEADER */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Tòa nhà & Phòng</h1>
          <p className="text-sm text-gray-500 mt-1">Cấu hình sơ đồ phòng ốc ký túc xá</p>
        </div>
      </div>

      <div className='shrink-0'>
        <BuildingStats stats={stats} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* === CỘT TRÁI: DANH SÁCH TÒA NHÀ (Buildings with Manager) === */}
        <div className="w-full lg:w-1/4 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <BuildingOffice2Icon className="w-5 h-5"/> Danh sách Tòa ({buildingsWithManager.length})
            </h3>
            <button 
              onClick={handleOpenBuildingModal}
              className="p-1.5 bg-white border hover:bg-gray-100 rounded-lg text-blue-600 transition"
              disabled={modalLoading}
            >
              <PlusIcon className="w-5 h-5"/>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {buildingsWithManager.map(b => (
              <div 
                key={b.buildingID}
                onClick={() => handleBuildingSelect(b)}
                className={`group p-4 rounded-xl border-2 cursor-pointer transition-all relative
                  ${selectedBuildingID === b.buildingID 
                    ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500' 
                    : 'border-transparent bg-gray-50 hover:bg-gray-100 hover:border-gray-200'}
                `}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-bold text-lg ${selectedBuildingID === b.buildingID ? 'text-blue-700' : 'text-gray-800'}`}>
                        {b.buildingName}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Quản lý: {b.managerName}
                    </p>

                  </div>
                  <div className={`flex gap-1 ${selectedBuildingID === b.buildingID ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button onClick={(e) => handleEditBuilding(e, b)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md">
                      <PencilSquareIcon className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === CỘT PHẢI: DANH SÁCH PHÒNG (Rooms from API) === */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center shrink-0">
             <div>
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <HomeModernIcon className="w-5 h-5 text-gray-500"/> 
                  Danh sách phòng - {currentBuilding?.buildingName || 'Chọn tòa nhà'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {currentRooms.length} phòng • Manager: {currentBuilding?.managerName || 'N/A'}
                </p>
             </div>
            <div className="flex gap-3">
                 <button 
                    onClick={handleOpenRoomTypeModal}
                    className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition"
                    title="Cấu hình giá và loại phòng"
                    disabled={modalLoading}
                 >
                   {modalLoading ? (
                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                   ) : (
                     <SwatchIcon className="w-5 h-5 text-green-600"/>
                   )}
                   <span className="hidden sm:inline">QL Loại phòng</span>
                 </button>

                 <button 
                    onClick={handleOpenRoomModal}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
                    disabled={modalLoading}
                 >
                   {modalLoading ? (
                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                   ) : (
                     <PlusIcon className="w-5 h-5"/>
                   )}
                   <span className="hidden sm:inline">Thêm phòng</span>
                 </button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {currentRooms.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-500">
                {selectedManagerID ? 'Không có phòng nào' : 'Vui lòng chọn tòa nhà có quản lý'}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Tên phòng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Loại phòng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Sức chứa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Đang ở</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Trạng thái</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500">Sửa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {currentRooms.map((room) => {
                      return (
                          <tr key={room.roomID} className="hover:bg-gray-50">
                              <td className="px-6 py-4 font-bold text-gray-900">{room.roomName}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{room.roomTypeName}</td>
                              
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                      <UsersIcon className="w-4 h-4 text-gray-400"/>
                                      <span className="text-sm">{room.capacity}</span>
                                  </div>
                              </td>

                              <td className="px-6 py-4">
                                  <span className="text-sm font-medium">{room.currentOccupancy}</span>
                              </td>

                              {/* Cột Status */}
                              <td className="px-6 py-4">
                                  {renderRoomStatus(room)}
                              </td>

                              <td className="px-6 py-4 text-center">
                                  <button 
                                    onClick={() => handleEditRoom(room)} 
                                    className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-md disabled:opacity-50"
                                    disabled={modalLoading}
                                  >
                                      <PencilSquareIcon className="w-5 h-5"/>
                                  </button>
                              </td>
                          </tr>
                      );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      <BuildingModal 
        isOpen={isBuildingModalOpen} 
        onClose={() => setIsBuildingModalOpen(false)} 
        initialData={editingItem}
        buildings={buildings}
      />
      
      <RoomModal 
        isOpen={isRoomModalOpen} 
        onClose={() => setIsRoomModalOpen(false)} 
        initialData={editingItem}
        currentBuildingID={selectedBuildingID}
        currentBuildingName={currentBuilding?.buildingName}
        roomTypes={roomTypes}
        isEditMode={!!editingItem}
        onSubmit={handleRoomSubmit}
      />

      <RoomTypeModal 
        isOpen={isRoomTypeModalOpen}
        onClose={() => setIsRoomTypeModalOpen(false)}
        roomTypes={roomTypes}
        onUpdateRoomTypes={(updatedRoomTypes) => setRoomTypes(updatedRoomTypes)}
      />

    </div>
  );
};

export default BuildingManagement;