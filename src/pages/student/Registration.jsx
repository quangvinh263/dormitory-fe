import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRegistrationRooms } from '../../services/roomApi';
import { getBuildingsForRegistration } from '../../services/buildingApi';
import { getRoomTypesInRegistration } from '../../services/roomTypeApi';
import { createRegistration } from '../../services/registrationApi';
import { AuthContext } from '../../context/AuthContext';

// Import các Module Features
import RoomFilters from '../../components/features/student/RoomFilters';
import RoomList from '../../components/features/student/RoomList';

export default function Registration() {
  const navigate = useNavigate();
  
  // State quản lý filter
  const [filters, setFilters] = useState({
    building: 'all',
    type: 'all',
    priceRange: 'all'
  });

  const [rooms, setRooms] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [error, setError] = useState('');

  // Fetch buildings và room types khi component mount
  useEffect(() => {
    const fetchFilterData = async () => {
      setLoadingFilters(true);
      try {
        const [buildingsResult, roomTypesResult] = await Promise.all([
          getBuildingsForRegistration(),
          getRoomTypesInRegistration()
        ]);

        if (buildingsResult.success) {
          setBuildings(buildingsResult.data);
        }

        if (roomTypesResult.success) {
          setRoomTypes(roomTypesResult.data);
        }
      } catch (err) {
        console.error('Error fetching filter data:', err);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilterData();
  }, []);

  // Fetch rooms khi filters thay đổi
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError('');
      
      try {
        const requestData = {
          buildingId: filters.building === 'all' ? '' : filters.building,
          roomTypeId: filters.type === 'all' ? '' : filters.type,
          price: filters.priceRange === 'all' ? 0 : 
                 filters.priceRange === 'low' ? 1000000 :
                 filters.priceRange === 'medium' ? 1500000 :
                 2000000,
          onlyAvailable: true
        };

        const result = await getRegistrationRooms(requestData);
        
        if (result.success) {
          console.log('Fetched rooms:', result.data);
          // Transform data từ API sang format UI cần
          const transformedRooms = result.data.map(room => ({
            id: room.roomId,
            name: room.roomName,
            building: room.buildingName,
            type: room.roomType,
            capacity: room.capacity,
            currentOccupancy: room.currentOccupancy,
            pendingRegistrations: room.registeredOccupancy, // Số người đang đăng ký
            price: room.price,
            gender: room.gender,
            fullRoomId: room.roomId,
            fullRoomType: room.roomType
          }));
          
          setRooms(transformedRooms);
        } else {
          setError(result.message || 'Không thể tải danh sách phòng');
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Đã xảy ra lỗi khi tải danh sách phòng');
      } finally {
        setLoading(false);
      }
    };

    // Chỉ fetch rooms sau khi đã load xong filter data
    if (!loadingFilters) {
      fetchRooms();
    }
  }, [filters, loadingFilters]);

  // Handle thay đổi filter
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle chọn phòng
  const handleSelectRoom = async (room) => {
    const confirmMsg = `Xác nhận đăng ký ${room.name}?\nLoại: ${room.fullRoomType}\nGiá: ${room.price.toLocaleString()}đ/năm`;
    
    if (window.confirm(confirmMsg)) {
      // Gọi API tạo đăng ký
      const accountId = localStorage.getItem('accountId');
      const data = { accountId, roomId: room.id };
      console.log('Creating registration with data:', data);
      const result = await createRegistration(data);
      console.log('Create Registration Result:', result);
      if(result.success) {
        navigate('/student/payment', { state: { room, registrationId: result.registrationId } }); 
      }
      else
      {
        alert(result.message || 'Đăng ký phòng thất bại. Vui lòng thử lại.');
      } 
    }
  };

  // Loading state
  if (loadingFilters) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                <span className="ml-2 text-xl font-bold text-primary">{rooms.length}</span>
                <span className="ml-2 text-sm text-gray-400">phòng phù hợp</span>
            </div>
         </div>
      </div>

      {/* SECTION 1: BỘ LỌC (Filter) */}
      <RoomFilters 
        filters={filters} 
        onChange={handleFilterChange}
        buildings={buildings}
        roomTypes={roomTypes}
        loading={loading}
      />

      {/* SECTION 2: DANH SÁCH PHÒNG (Grid) */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải danh sách phòng...</p>
          </div>
        </div>
      ) : (
        <RoomList 
          rooms={rooms} 
          onSelectRoom={handleSelectRoom} 
        />
      )}
      
    </div>
  );
}