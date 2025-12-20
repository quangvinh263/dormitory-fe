import { UserGroupIcon, CurrencyDollarIcon, HomeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { LuUsers } from "react-icons/lu";
import Badge from '../../ui/Badge';
import Button from '../../ui/Button'; 

export default function RoomCard({ room, onSelect }) {
  // Tính toán trạng thái
  const registeredCount = room.pendingRegistrations ?? room.registered ?? 0;
  const currentOccupancy = room.currentOccupancy ?? 0;
  // Available slots = capacity - (current + pending registrations)
  const rawAvailable = room.capacity - (currentOccupancy + registeredCount);
  const availableSlots = Math.max(0, rawAvailable);
  const isFull = availableSlots === 0;
  const hasRegistered = registeredCount > 0;
  
  // Format tiền tệ
  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price);

  // Render occupancy boxes
  const renderOccupancyBoxes = () => {
    const boxes = [];
    const current = room.currentOccupancy || 0;
    const registered = Math.max(0, Math.min(room.pendingRegistrations ?? room.registered ?? 0, Math.max(0, room.capacity - current)));
    for (let i = 0; i < room.capacity; i++) {
      const isOccupied = i < current;
      const isRegistered = !isOccupied && i < current + registered;
      boxes.push(
        <div
          key={i}
          className={`w-7 h-7 rounded-md flex items-center justify-center ${
            isOccupied
              ? 'bg-green-600'
              : isRegistered
              ? 'bg-amber-400'
              : 'bg-gray-200 border border-gray-400'
          }`}
        >
          <LuUsers className={`w-4 h-4 ${isOccupied || isRegistered ? 'text-white' : 'text-gray-500'}`} />
        </div>
      );
    }
    return boxes;
  };

  return (
    <div className={`relative flex flex-col p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
      ${isFull 
        ? 'bg-red-50 border-red-300 opacity-60' 
        : hasRegistered
        ? 'bg-amber-50 border-amber-300'
        : 'bg-green-50 border-green-400'
      }
    `}>
      
      {/* Header Card */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isFull ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-primary'}`}>
             <HomeIcon className="w-6 h-6"/>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-lg">{room.name}</h4>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tòa {room.building}</span>
          </div>
        </div>
        
          <Badge
            type="default"
            className={`px-2.5 py-1 text-xs font-semibold ${
              isFull ? 'bg-red-600 text-white border-red-600' : 'bg-green-600 text-white border-green-600'
            }`}
          >
            {isFull ? 'Hết chỗ' : `Còn ${availableSlots} chỗ`}
          </Badge>
      </div>

      {/* Thông tin chi tiết */}
      <div className="space-y-3 mb-6 flex-1">
         {/* Sức chứa */}
         <div className="flex items-center gap-2 text-sm text-gray-900">
            <UserGroupIcon className="w-4 h-4 text-gray-600"/>
            <span>Phòng {room.capacity} người</span>
         </div>

         {/* Occupancy visualization */}
         <div className="flex flex-col gap-1">
            <div className="flex gap-2 flex-wrap">
              {renderOccupancyBoxes()}
            </div>
            <div className="flex gap-3 text-xs">
              <span className="text-green-700 font-medium">{room.currentOccupancy} đang ở</span>
              {availableSlots > 0 && (
                <span className="text-gray-600 font-medium">{availableSlots} còn trống</span>
              )}
            </div>
         </div>

         {/* Divider */}
         <div className="border-t border-gray-200 pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Giới tính:</span>
              <span className="text-gray-900 font-medium">{room.gender || 'Nam'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Giá phòng:</span>
              <span className="text-green-600 font-bold">{formattedPrice}/năm</span>
            </div>
         </div>
      </div>

      {/* Button Action */}
      <Button 
        className="w-full justify-center" 
        size="md" 
        disabled={isFull}
        variant={isFull ? 'white' : 'primary'}
        onClick={() => onSelect(room)}
      >
        {isFull ? 'Phòng đã đầy' : 'Chọn phòng này'}
      </Button>
    </div>
  );
}