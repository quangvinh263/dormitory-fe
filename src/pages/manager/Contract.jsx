import { useState,useEffect } from 'react';
import { ArrowDownTrayIcon, BellAlertIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import * as contractApi from '../../services/contractApi'
import ContractStats from '../../components/features/manager/ContractStats';
import ContractFilter from '../../components/features/manager/ContractFilter';
import ContractTable from '../../components/features/manager/ContractTable';
import RoomChangeModal from '../../components/features/manager/RoomChangeModal';
import Button from '../../components/ui/Button';

export default function ContractPage() {

  const [contracts, setContracts] = useState([]); // Chứa danh sách hợp đồng từ API
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [isRoomChangeModalOpen, setIsRoomChangeModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [contractsRes, statsRes] = await Promise.all([
        contractApi.getAllContracts(),
        contractApi.getContractOverview()
      ]);

      if (contractsRes.success) {
        setContracts(contractsRes.data || []);
      }
      
      if (statsRes.success) {
        console.log("Dữ liệu Stat nhận được:", statsRes.data);
        setStats(statsRes.data);
      }
    } catch (error) {
      toast.error('Không thể tải dữ liệu hợp đồng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenRoomChange = (contract) => {
    setSelectedContract(contract);
    setIsRoomChangeModalOpen(true);
  };

  return (
    <div className="animate-fade-in-up space-y-6 pb-10">
      
      {/* 1. Header Page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo Cáo Hợp Đồng</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi và quản lý các hợp đồng sắp hết hạn hoặc đã quá hạn</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="white" icon={<BellAlertIcon className="w-4 h-4"/>}>
            Gửi nhắc nhở hàng loạt
          </Button>
          <Button variant="primary" icon={<ArrowDownTrayIcon className="w-4 h-4"/>} className="bg-gray-900 text-white">
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* 2. Thống kê */}
      <ContractStats stats={stats} />

      {/* 3. Bộ lọc */}
      <ContractFilter />

      {/* 4. Bảng dữ liệu */}
      <ContractTable 
        contracts={contracts}
        loading={loading}
        onRoomChange={handleOpenRoomChange} 
      />

      {/* 5. Footer Info Alert (Màu xanh dương) */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 items-start">
        <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-800 leading-relaxed">
            <span className="font-bold block mb-1 text-sm">Lưu ý quan trọng:</span>
            Bạn chỉ có thể xem báo cáo thống kê và gửi email nhắc nhở cho sinh viên. 
            Hệ thống không cho phép sửa đổi ngày kết thúc hợp đồng tại đây. 
            Để gia hạn, vui lòng hướng dẫn sinh viên nộp đơn gia hạn thông qua Cổng thông tin sinh viên.
        </div>
      </div>

      <RoomChangeModal 
        isOpen={isRoomChangeModalOpen}
        onClose={() => setIsRoomChangeModalOpen(false)}
        contract={selectedContract}
      />

    </div>
  );
}