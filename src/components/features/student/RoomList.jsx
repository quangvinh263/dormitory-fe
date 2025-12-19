import RoomCard from './RoomCard';

export default function RoomList({ rooms, onSelectRoom }) {
  if (rooms.length === 0) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-100">
      {rooms.map((room) => (
        <RoomCard 
          key={room.id} 
          room={room} 
          onSelect={onSelectRoom} 
        />
      ))}
    </div>
  );
}