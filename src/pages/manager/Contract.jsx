import { useState, useEffect, useMemo, useContext } from 'react';
import { ArrowDownTrayIcon, BellAlertIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { toast, Toaster } from 'react-hot-toast';
import { AuthContext } from "../../context/AuthContext";
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
  const { auth } = useContext(AuthContext);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    endDate: ''
  });

 

  const fetchData = async () => {
    try {
      const params = {
        buildingID: auth.buildingID || ''
      }
      setLoading(true);
      const [contractsRes, statsRes] = await Promise.all([
        contractApi.getAllContracts(params),
        contractApi.getContractOverview(params)
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

  const filteredContracts = useMemo(() => {
    return contracts.filter(item => {
      // 1. Lọc theo search (MSSV, Tên, Phòng)
      const matchesSearch = !filters.search || 
        item.studentName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.studentID?.includes(filters.search) ||
        item.roomName?.toLowerCase().includes(filters.search.toLowerCase());

      // 2. Lọc theo trạng thái (Dựa trên logic ngày còn lại)
      let matchesStatus = true;
      if (filters.status === 'expired') matchesStatus = item.remainingDays < 0;
      else if (filters.status === 'warning') matchesStatus = item.remainingDays >= 0 && item.remainingDays <= 14;
      else if (filters.status === 'valid') matchesStatus = item.remainingDays > 14;

      // 3. Lọc theo ngày kết thúc chính xác
      const matchesDate = !filters.endDate || item.endDate === filters.endDate;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [contracts, filters]);

  const handleOpenRoomChange = (contract) => {
    setSelectedContract(contract);
    setIsRoomChangeModalOpen(true);
  };

  const handleBulkReminder = async () => {
    const toastId = toast.loading("Đang gửi thông báo...");
    
    try {
      const res = await contractApi.remindBulk();
      // 2. Cập nhật thành công
      if (res && res.data) {
         toast.success(res.data.message || "Gửi thành công!", { id: toastId });
      } else {
         toast.success("Đã gửi thông báo.", { id: toastId });
      }
    } catch (error) {
      // 3. Cập nhật lỗi
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi gửi thông báo';
      toast.error(msg, { id: toastId });
    }
  };

  // --- HÀM 2: Gửi nhắc nhở cá nhân ---
  const handleSingleReminder = async (studentId) => {
    const toastId = toast.loading("Đang gửi yêu cầu...");

    try {
      const res = await contractApi.remindSingle(studentId);
      // 2. Cập nhật thành công
      toast.success(res.data?.message || "Đã gửi nhắc nhở thành công!", { id: toastId });
    } catch (error) {
      // 3. Cập nhật lỗi
      toast.error(error.response?.data?.message || "Không thể gửi thông báo.", { id: toastId });
    }
  };
  return (
    <div className="animate-fade-in-up space-y-6 pb-10">
      <Toaster position="bottom-right" reverseOrder={false} />
      {/* 1. Header Page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo Cáo Hợp Đồng</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi và quản lý các hợp đồng sắp hết hạn hoặc đã quá hạn</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="white" 
            icon={<BellAlertIcon className="w-4 h-4"/>}
            onClick={handleBulkReminder}
          >
            Gửi thông báo hàng loạt
          </Button>
          <Button variant="primary" icon={<ArrowDownTrayIcon className="w-4 h-4"/>} className="bg-gray-900 text-white">
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* 2. Thống kê */}
      <ContractStats stats={stats} />

      {/* 3. Bộ lọc */}
      <ContractFilter
        filters={filters} 
        setFilters={setFilters} 
        totalResults={filteredContracts.length}
       />

      {/* 4. Bảng dữ liệu */}
      <ContractTable 
        contracts={filteredContracts}
        loading={loading}
        onRoomChange={handleOpenRoomChange} 
        onRemind={handleSingleReminder}
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