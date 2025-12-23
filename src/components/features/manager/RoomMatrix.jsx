import React from 'react';
import Section from '../../shared/Section'; 

export default function RoomMatrix() {
  // Mock data: Tòa nhà có 2 tầng làm mẫu
  const floors = [
    { name: 'Tầng 1', rooms: [
      { id: '101', status: 'full', slots: '8/8' },
      { id: '102', status: 'available', slots: '5/8' }, 
      { id: '103', status: 'maintenance', slots: '0/8' }, 
      { id: '104', status: 'full', slots: '8/8' },
    ]},
    { name: 'Tầng 2', rooms: [
      { id: '201', status: 'full', slots: '8/8' },
      { id: '202', status: 'available', slots: '2/8' },
      { id: '203', status: 'full', slots: '8/8' },
      { id: '204', status: 'full', slots: '8/8' },
    ]},
  ];

  // Helper function để lấy màu theo trạng thái
  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200';
      case 'maintenance': return 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200';
      default: return 'bg-gray-100 border-gray-200 text-gray-500'; // Full
    }
  };

  return (
    <Section title="Sơ Đồ Trực Quan Tòa Nhà">
      <div className="space-y-4">
        {/* Chú thích màu (Legend) */}
        <div className="flex gap-4 text-xs text-gray-600 mb-2">
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div> Còn trống</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div> Bảo trì/Hỏng</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div> Đầy</span>
        </div>

        {/* Render từng tầng */}
        {floors.map((floor) => (
          <div key={floor.name} className="flex flex-col md:flex-row gap-4 items-start md:items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="w-20 font-bold text-gray-700">{floor.name}</div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {floor.rooms.map((room) => (
                <div 
                  key={room.id} 
                  className={`p-2 rounded border text-center cursor-pointer transition-colors ${getStatusColor(room.status)}`}
                  title={`Phòng ${room.id} - ${room.status === 'full' ? 'Đã đầy' : `Còn trống: ${room.slots}`}`}
                >
                  <div className="font-bold text-sm">P.{room.id}</div>
                  <div className="text-xs mt-1 opacity-80">{room.slots}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}