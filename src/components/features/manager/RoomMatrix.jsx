import React, { useState, useEffect } from 'react';
import Section from '../../shared/Section';
import { getRoomDetailsForManager } from '../../../services/roomApi';

export default function RoomMatrix() {
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const accountId = localStorage.getItem('accountId');

  useEffect(() => {
    const fetchRoomsData = async () => {
      try {
        setLoading(true);
        setError('');

        const result = await getRoomDetailsForManager(accountId);

        if (!result.success) {
          throw new Error(result.message || 'Không thể tải danh sách phòng');
        }

        const apiRooms = result.data || [];
        
        // Group rooms by floor
        const floorMap = {};

        apiRooms.forEach(room => {
          // Extract floor number from room name
          // Ví dụ: "A1.01" -> lấy "1", "B2.05" -> lấy "2"
          const floorNumber = extractFloorFromRoomName(room.roomName);
          
          if (!floorMap[floorNumber]) {
            floorMap[floorNumber] = [];
          }

          // Determine room status
          const isMaintenance = room.isUnderMaintenance || room.isBeingCleaned;
          const isFull = room.currentOccupancy >= room.capacity;
          
          let status = 'available';
          if (isMaintenance) status = 'maintenance';
          else if (isFull) status = 'full';

          floorMap[floorNumber].push({
            id: room.roomName,
            status,
            slots: `${room.currentOccupancy}/${room.capacity}`,
            buildingName: room.buildingName,
            roomTypeName: room.roomTypeName
          });
        });

        // Convert to array and sort floors
        const floorsArray = Object.keys(floorMap)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map(floorNum => ({
            name: `Tầng ${floorNum}`,
            rooms: floorMap[floorNum].sort((a, b) => a.id.localeCompare(b.id))
          }));

        setFloors(floorsArray);

      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu phòng');
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchRoomsData();
    }
  }, [accountId]);

  // Function to extract floor number from room name
  const extractFloorFromRoomName = (roomName) => {
    // Ví dụ: "A1.01" -> "1", "B2.05" -> "2", "C10.03" -> "10"
    const match = roomName.match(/[A-Za-z]+(\d+)\./);
    return match ? match[1] : '1'; // Default to floor 1 if no match
  };

  // Helper function để lấy màu theo trạng thái
  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200';
      case 'maintenance': return 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200';
      default: return 'bg-gray-100 border-gray-200 text-gray-500'; // Full
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'available': return 'Còn trống';
      case 'maintenance': return 'Bảo trì';
      default: return 'Đã đầy';
    }
  };

  if (loading) {
    return (
      <Section title="Sơ Đồ Trực Quan Tòa Nhà">
        <div className="text-center py-8 text-gray-500">
          Đang tải dữ liệu phòng...
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section title="Sơ Đồ Trực Quan Tòa Nhà">
        <div className="text-center py-8 text-red-500">
          Lỗi: {error}
        </div>
      </Section>
    );
  }

  return (
    <Section title="Sơ Đồ Trực Quan Tòa Nhà">
      <div className="space-y-4">
        {/* Chú thích màu (Legend) */}
        <div className="flex gap-4 text-xs text-gray-600 mb-2">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div> 
            Còn trống
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div> 
            Bảo trì/Hỏng
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div> 
            Đầy
          </span>
        </div>

        {floors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Không có dữ liệu phòng
          </div>
        ) : (
          /* Render từng tầng */
          floors.map((floor) => (
            <div key={floor.name} className="flex flex-col md:flex-row gap-4 items-start md:items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-20 font-bold text-gray-700">{floor.name}</div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {floor.rooms.map((room) => (
                  <div 
                    key={room.id} 
                    className={`p-2 rounded border text-center cursor-pointer transition-colors ${getStatusColor(room.status)}`}
                    title={`Phòng ${room.id} - ${getStatusText(room.status)} - ${room.roomTypeName} - ${room.buildingName} - Hiện tại: ${room.slots}`}
                  >
                    <div className="font-bold text-sm">{room.id}</div>
                    <div className="text-xs mt-1 opacity-80">{room.slots}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Section>
  );
}