import { UserGroupIcon, CurrencyDollarIcon, HomeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button'; 

export default function RoomCard({ room, onSelect }) {
  // Tính toán trạng thái
  const availableSlots = room.capacity - room.currentOccupancy;
  const isFull = availableSlots === 0;
  
  // Format tiền tệ
  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price);

  return (
    <div className={`relative flex flex-col p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white
      ${isFull ? 'border-gray-200 opacity-70 bg-gray-50' : 'border-gray-200 hover:border-primary/50'}
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
        
        <Badge type={isFull ? 'danger' : 'success'} className="px-2.5 py-1">
           {isFull ? 'Hết chỗ' : `Còn ${availableSlots} chỗ`}
        </Badge>
      </div>

      {/* Thông tin chi tiết */}
      <div className="space-y-3 mb-6 flex-1">
         <div className="flex items-center justify-between text-sm text-gray-600 pb-2 border-b border-gray-100 border-dashed">
            <span className="flex items-center gap-2">
                <UserGroupIcon className="w-4 h-4 text-gray-400"/> Loại phòng
            </span>
            <span className="font-medium">{room.capacity} người</span>
         </div>
         
         <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="flex items-center gap-2">
                <CurrencyDollarIcon className="w-4 h-4 text-gray-400"/> Đơn giá
            </span>
            <span className="font-bold text-primary text-base">{formattedPrice}<span className="text-xs font-normal text-gray-400">/tháng</span></span>
         </div>
      </div>

      {/* Button Action */}
      <Button 
        className="w-full justify-center" 
        size="md" 
        disabled={isFull}
        variant={isFull ? 'white' : 'primary'}
        onClick={() => onSelect(room)}
        icon={!isFull && <CheckCircleIcon className="w-5 h-5"/>}
      >
        {isFull ? 'Đã hết chỗ' : 'Chọn phòng này'}
      </Button>
    </div>
  );
}