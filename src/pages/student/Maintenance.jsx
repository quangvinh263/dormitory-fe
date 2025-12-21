import { useState } from 'react';
import { WrenchIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';

// Import Modules
import RequestStats from '../../components/features/student/RequestStats';
import RequestItem from '../../components/features/student/RequestItem';
import CreateRequestModal from '../../components/features/student/CreateRequestModal';
import RequestDetailModal from '../../components/features/student/RequestDetailModal';

// MOCK DATA (Giống trong hình Figma của bạn)
const MOCK_DATA = [
  { 
    id: 1, code: 'MNT_001', 
    status: 'pending', 
    room: 'A1.01', device: 'Điều hòa', 
    description: 'Điều hòa không hoạt động, cần kiểm tra sửa chữa gấp', 
    date: '17/12/2025', cost: 0 
  },
  { 
    id: 2, code: 'MNT_002', 
    status: 'processing', 
    room: 'A3.01', device: 'Vòi nước', 
    description: 'Vòi nước bị hỏng, nước chảy yếu', 
    date: '17/12/2025', cost: 150000 
  },
  { 
    id: 3, code: 'MNT_003', 
    status: 'done', 
    room: 'A1.01', device: 'Bóng đèn', 
    description: 'Đèn trong phòng không sáng, nghi hỏng bóng đèn', 
    date: '07/12/2025', cost: 50000 
  },
];

export default function Maintenance() {
  const [requests] = useState(MOCK_DATA);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);


  // Tính toán số liệu thống kê
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    processing: requests.filter(r => r.status === 'processing').length,
    done: requests.filter(r => r.status === 'done').length,
  };

  const handleCreateRequest = (newData) => {
    const newRequest = {
      id: Date.now(),
      code: `MNT_00${requests.length + 1}`,
      status: 'pending',
      room: newData.room,
      device: newData.device,
      description: newData.description,
      date: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY
      cost: 0
    };

    requests([newRequest, ...requests]);
    setIsCreateModalOpen(false); // Đóng modal sau khi tạo xong
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Module Thống kê */}
      <RequestStats stats={stats} />

      {/* 2. Main Content Wrapper */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
         
         {/* Header của List */}
         <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h2 className="text-lg font-bold text-gray-900">Yêu Cầu Sửa Chữa Phòng</h2>
               <p className="text-sm text-gray-500 mt-1">Tạo và theo dõi tiến độ xử lý các sự cố kỹ thuật</p>
            </div>
            
            <Button size="sm" icon={<WrenchIcon className="w-4 h-4"/>} onClick={() => setIsCreateModalOpen(true)}>
               Tạo yêu cầu mới
            </Button>
         </div>

         {/* Danh sách Items */}
         <div className="p-4 bg-gray-50 min-h-[400px]">
            <div className="space-y-3">
               {requests.map((req) => (
                  <div key={req.id} onClick={() => setSelectedRequest(req)} className="cursor-pointer">
                     <RequestItem request={req} />
                  </div>
               ))}
            </div>
         </div>

      </div>
      
      <CreateRequestModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSubmit={handleCreateRequest}
      />

      <RequestDetailModal
        isOpen={!!selectedRequest} 
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
      />

    </div>
  );
}