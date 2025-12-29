import { InformationCircleIcon } from '@heroicons/react/24/outline';
import RoomCard from './RoomCard';

export default function RoomList({ rooms, onSelectRoom }) {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 animate-fade-in-up">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🔍</span>
        </div>
        <p className="font-medium text-gray-900">Không tìm thấy phòng nào phù hợp</p>
        <p className="text-sm text-gray-500 mt-1">Vui lòng thử thay đổi bộ lọc tìm kiếm của bạn.</p>
      </div>
    );
  }

  return (
    <>
      {/* Guidance/Instructions Panel */}
      <div className="mb-6 p-4 bg-white rounded-2xl border border-gray-200 flex gap-3 items-start animate-fade-in-up">
        <InformationCircleIcon className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-bold text-sm text-gray-700 mb-1">Hướng dẫn:</p>
          <p className="text-sm text-gray-600 mb-2">Các phòng được mã hóa màu sắc:</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded font-medium">Đỏ</span>
              <span>= Đầy,</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded font-medium">Xanh lá</span>
              <span>= Có người ở,</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-medium">Xám</span>
              <span>= Còn trống hoàn toàn</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-100 text-amber-400 rounded font-medium">Vàng</span>
              <span>= Có người đăng ký</span>
            </div>
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <RoomCard 
            key={room.id} 
            room={room} 
            onSelect={onSelectRoom} 
          />
        ))}
      </div>
    </>
  );
}