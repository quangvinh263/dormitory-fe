import React, { useState, useEffect } from 'react';
import { 
  HomeModernIcon, 
  UserGroupIcon, 
  NoSymbolIcon, 
  WrenchScrewdriverIcon 
} from '@heroicons/react/24/outline';

import StatCard from '../../components/shared/StatCard';
import Section from '../../components/shared/Section';

import RoomFilter from '../../components/features/manager/RoomFilter';
import RoomCard from '../../components/features/manager/RoomCard';
import RoomDetailModal from '../../components/features/manager/RoomDetailModal';
import { getRoomDetailsForManager } from '../../services/roomApi';

export default function RoomDashboard() {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [statsData, setStatsData] = useState([
    { label: 'Tổng số phòng', value: '0', type: 'default', icon: <HomeModernIcon className="w-6 h-6" /> },
    { label: 'Còn trống', value: '0', type: 'success', icon: <UserGroupIcon className="w-6 h-6" /> },
    { label: 'Đã đầy', value: '0', type: 'default', icon: <NoSymbolIcon className="w-6 h-6" /> },
    { label: 'Bảo trì/Dọn dẹp', value: '0', type: 'warning', icon: <WrenchScrewdriverIcon className="w-6 h-6" /> },
  ]);

  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    roomType: '',
    minCapacity: '',
    maxCapacity: ''
  });

  const accountId = localStorage.getItem('accountId');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError('');

        const result = await getRoomDetailsForManager(accountId);

        if (!result.success) {
          throw new Error(result.message || 'Không thể tải danh sách phòng');
        }

        const apiRooms = result.data || [];

        // Map dữ liệu API -> dữ liệu cho RoomCard
        const mappedRooms = apiRooms.map(r => {
          const isMaintenance = r.isUnderMaintenance || r.isBeingCleaned;
          const isFull = r.currentOccupancy >= r.capacity;

          let status = 'Empty';
          if (isMaintenance) status = 'Maintenance';
          else if (isFull) status = 'Full';

          return {
            id: r.roomName,
            building: r.buildingName,
            status,
            type: r.roomTypeName,
            current: r.currentOccupancy,
            max: r.capacity,
            price: 0,
            // Thêm dữ liệu gốc để filter
            originalData: r
          };
        });

        setRooms(mappedRooms);
        setFilteredRooms(mappedRooms);

        // Tính stats từ apiRooms
        const total = apiRooms.length;
        const maintenanceCount = apiRooms.filter(r => r.isUnderMaintenance || r.isBeingCleaned).length;
        const fullCount = apiRooms.filter(r => 
          !r.isUnderMaintenance && 
          !r.isBeingCleaned && 
          r.currentOccupancy >= r.capacity
        ).length;
        const availableCount = apiRooms.filter(r =>
          !r.isUnderMaintenance &&
          !r.isBeingCleaned &&
          r.currentOccupancy < r.capacity &&
          r.roomStatus === 'Available'
        ).length;

        setStatsData([
          { label: 'Tổng số phòng', value: String(total), type: 'default', icon: <HomeModernIcon className="w-6 h-6" /> },
          { label: 'Còn trống', value: String(availableCount), type: 'success', icon: <UserGroupIcon className="w-6 h-6" /> },
          { label: 'Đã đầy', value: String(fullCount), type: 'default', icon: <NoSymbolIcon className="w-6 h-6" /> },
          { label: 'Bảo trì/Dọn dẹp', value: String(maintenanceCount), type: 'warning', icon: <WrenchScrewdriverIcon className="w-6 h-6" /> },
        ]);
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi khi tải danh sách phòng');
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchRooms();
    }
  }, [accountId]);

  // Apply filters
  useEffect(() => {
    let filtered = [...rooms];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(room => 
        room.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        room.building.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      if (filters.status === 'empty') {
        filtered = filtered.filter(room => room.status === 'Empty');
      } else if (filters.status === 'full') {
        filtered = filtered.filter(room => room.status === 'Full');
      } else if (filters.status === 'maintenance') {
        filtered = filtered.filter(room => room.status === 'Maintenance');
      }
    }

    // Room type filter
    if (filters.roomType) {
      filtered = filtered.filter(room => room.max.toString() === filters.roomType);
    }

    // Capacity range filter
    if (filters.minCapacity) {
      filtered = filtered.filter(room => room.max >= parseInt(filters.minCapacity));
    }
    if (filters.maxCapacity) {
      filtered = filtered.filter(room => room.max <= parseInt(filters.maxCapacity));
    }

    setFilteredRooms(filtered);
  }, [filters, rooms]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      roomType: '',
      minCapacity: '',
      maxCapacity: ''
    });
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Header Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Phòng</h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý thông tin phòng ở và trạng thái sử dụng</p>
      </div>

      {/* MODULE 1: THỐNG KÊ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <div key={index} className="h-full">
            <StatCard
              title={stat.label}
              value={stat.value}
              type={stat.type}
              icon={stat.icon}
            />
          </div>
        ))}
      </div>

      {/* MODULE 2: BỘ LỌC */}
      <RoomFilter 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Thông báo loading / error */}
      {loading && (
        <p className="text-sm text-gray-500">Đang tải danh sách phòng...</p>
      )}
      {error && (
        <p className="text-sm text-red-500">Lỗi: {error}</p>
      )}

      {/* MODULE 3: DANH SÁCH PHÒNG */}
      <Section title={`Danh sách phòng (${filteredRooms.length})`}>
        <div className="mb-5 text-xs text-gray-500 -mt-4">
          Hiển thị {filteredRooms.length} phòng {rooms.length > 0 && `/ ${rooms.length} tổng`}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredRooms.map((room) => (
            <RoomCard 
              key={room.id} 
              room={room}
              onClick={() => setSelectedRoom(room)} 
            />
          ))}
        </div>
      </Section>

      <RoomDetailModal 
        isOpen={!!selectedRoom}      
        room={selectedRoom}    
        onClose={() => setSelectedRoom(null)}
      />
    </div>
  );
}