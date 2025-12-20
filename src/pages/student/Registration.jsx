import { useState, useMemo } from 'react';
import { useNavigate} from 'react-router-dom';

// Import các Module Features
import RoomFilters from '../../components/features/student/RoomFilters';
import RoomList from '../../components/features/student/RoomList';

// --- MOCK DATA (Dữ liệu giả lập) ---
const MOCK_ROOMS = [
  { id: 1, name: 'Phòng A101', building: 'A', type: '8', capacity: 8, currentOccupancy: 6, price: 400000 },
  { id: 2, name: 'Phòng A102', building: 'A', type: '8', capacity: 8, currentOccupancy: 8, price: 400000 }, // Full
  // Có 1 người đăng ký chờ (amber)
  { id: 3, name: 'Phòng A201', building: 'A', type: '6', capacity: 6, currentOccupancy: 3, pendingRegistrations: 1, price: 650000 },
  { id: 4, name: 'Phòng B101', building: 'B', type: '6', capacity: 6, currentOccupancy: 0, price: 600000 },
  // Có nhiều người đăng ký chờ (amber)
  { id: 5, name: 'Phòng B205', building: 'B', type: '4', capacity: 4, currentOccupancy: 2, pendingRegistrations: 2, price: 850000 },
  { id: 6, name: 'Phòng C301', building: 'C', type: '2', capacity: 2, currentOccupancy: 1, price: 1500000 },
  { id: 7, name: 'Phòng C302', building: 'C', type: '2', capacity: 2, currentOccupancy: 0, price: 1500000 },
];

export default function Registration() {
  const navigate = useNavigate();
  
  // State quản lý filter
  const [filters, setFilters] = useState({
    building: 'all',
    type: 'all',
    priceRange: 'all'
  });

  // Handle thay đổi filter
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Logic lọc phòng (Sử dụng useMemo để tối ưu hiệu năng)
  const filteredRooms = useMemo(() => {
    return MOCK_ROOMS.filter(room => {
      // 1. Lọc tòa
      if (filters.building !== 'all' && room.building !== filters.building) return false;
      
      // 2. Lọc loại phòng
      if (filters.type !== 'all' && room.type !== filters.type) return false;
      
      // 3. Lọc giá
      if (filters.priceRange === 'low' && room.price >= 500000) return false;
      if (filters.priceRange === 'medium' && (room.price < 500000 || room.price > 1000000)) return false;
      if (filters.priceRange === 'high' && room.price <= 1000000) return false;
      
      return true;
    });
  }, [filters]);

  // Handle chọn phòng
  const handleSelectRoom = (room) => {
    // Trong thực tế, bạn sẽ gọi API để giữ chỗ hoặc tạo hợp đồng nháp tại đây
    const confirmMsg = `Xác nhận đăng ký ${room.name} (Tòa ${room.building})?\nGiá: ${room.price.toLocaleString()}đ/năm`;
    
    if (window.confirm(confirmMsg)) {
      // Chuyển hướng sang trang thanh toán
      navigate('/student/payment', { state: { room } }); 
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Page */}
      <div className="flex flex-col gap-2">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Chọn Phòng Ký Túc Xá</h1>
                <p className="text-gray-500 mt-1">Lựa chọn không gian sống phù hợp nhất với nhu cầu của bạn.</p>
            </div>
            <div className="text-right hidden md:block">
                <span className="text-sm font-medium text-gray-500">Hiển thị</span>
                <span className="ml-2 text-xl font-bold text-primary">{filteredRooms.length}</span>
                <span className="ml-2 text-sm text-gray-400">phòng phù hợp</span>
            </div>
         </div>
      </div>

      {/* SECTION 1: BỘ LỌC (Filter) */}
      <RoomFilters 
        filters={filters} 
        onChange={handleFilterChange} 
      />

      {/* SECTION 2: DANH SÁCH PHÒNG (Grid) */}
      <RoomList 
        rooms={filteredRooms} 
        onSelectRoom={handleSelectRoom} 
      />
      
    </div>
  );
}