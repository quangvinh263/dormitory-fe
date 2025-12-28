import { useState, useEffect, useContext } from 'react';
import { ArrowDownTrayIcon, BellAlertIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';

// Components
import ContractStats from '../../components/features/manager/ContractStats';
import ContractFilter from '../../components/features/manager/ContractFilter';
import ContractTable from '../../components/features/manager/ContractTable';
import RoomChangeModal from '../../components/features/manager/RoomChangeModal';
import Button from '../../components/ui/Button';

// API
import { getContractFiltered } from '../../services/contractApi';
import { getManagerInfo } from '../../services/managerApi';

export default function ContractPage() {

  const { auth } = useContext(AuthContext);

  // --- STATE ---
  const [loading, setLoading] = useState(true); // Loading tổng ban đầu
  const [listLoading, setListLoading] = useState(false); // Loading khi filter chạy
  
  // 1. ID tòa nhà của quản lý (Quan trọng nhất)
  const [managerBuildingId, setManagerBuildingId] = useState(null);

  // 2. Dữ liệu
  const [contracts, setContracts] = useState([]);          // Dữ liệu hiển thị ở Bảng (Có filter)
  const [allContracts, setAllContracts] = useState([]);    // Dữ liệu tổng quan (Không filter - dùng cho Stats)

  const [isRoomChangeModalOpen, setIsRoomChangeModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  // 3. Filter (Chỉ chứa các trường user nhập, không chứa buildingId)
  const [filters, setFilterParams] = useState({
    keyword: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  // --- BƯỚC 1: LẤY THÔNG TIN QUẢN LÝ (BUILDING ID) ---
  useEffect(() => {
    let mounted = true;
    const accountId = auth?.accountId || localStorage.getItem('accountId');

    if (!accountId) {
        setLoading(false);
        return;
    }

    const fetchManagerData = async () => {
      try {
        const res = await getManagerInfo(accountId);
        
        if (!mounted) return;

        if (res.success && res.data?.buildingDto?.buildingID) {
            setManagerBuildingId(res.data.buildingDto.buildingID);
        } else {
            console.error("Không tìm thấy thông tin tòa nhà của quản lý.");
        }
      } catch (err) {
        console.error("Lỗi fetchManagerData:", err);
      } finally {
         // Lưu ý: Chưa tắt loading ở đây vội, đợi lấy xong dữ liệu contracts mới tắt
         // hoặc tắt luôn nếu không tìm thấy building
      }
    };

    fetchManagerData();
    return () => { mounted = false; };
  }, [auth]);

  // --- BƯỚC 2: LẤY DỮ LIỆU THỐNG KÊ (STATS) ---
  // Chỉ chạy khi đã có managerBuildingId
  useEffect(() => {
    if (!managerBuildingId) return;

    const fetchAllStats = async () => {
        try {
            // Gọi API chỉ với buildingId để lấy toàn bộ danh sách (cho Stats)
            const res = await getContractFiltered({ buildingId: managerBuildingId });
            if (res.success && Array.isArray(res.data)) {
                setAllContracts(res.data);
            }
        } catch (error) {
            console.error("Lỗi lấy stats contract:", error);
        }
    };
    fetchAllStats();
  }, [managerBuildingId]);

  // --- BƯỚC 3: LẤY DỮ LIỆU BẢNG (LIST) ---
  // Chạy khi có managerBuildingId HOẶC user thay đổi Filter
  useEffect(() => {
    let mounted = true;
    if (!managerBuildingId) return;

    const fetchFilteredContracts = async () => {
      setListLoading(true);
      try {
        // Merge: Filter user nhập + BuildingID bắt buộc
        const params = {
            ...filters,
            buildingId: managerBuildingId
        };

        const res = await getContractFiltered(params);
        
        if (mounted) {
            if (res.success && Array.isArray(res.data)) {
                setContracts(res.data);
            } else {
                setContracts([]);
            }
        }
      } catch (err) {
        console.error("Lỗi fetchContracts:", err);
        if (mounted) setContracts([]);
      } finally {
        if (mounted) {
            setListLoading(false);
            setLoading(false); // Dữ liệu đã về, tắt loading màn hình
        }
      }
    };

    fetchFilteredContracts();
    return () => { mounted = false; };
  }, [managerBuildingId, filters]); // Filter thay đổi -> Gọi lại API

  // --- HANDLERS ---
  const handleOpenRoomChange = (contract) => {
    setSelectedContract(contract);
    setIsRoomChangeModalOpen(true);
  };

  // --- RENDER ---

  // Màn hình Loading ban đầu (khi chưa có BuildingID)
  if (loading && !managerBuildingId) {
    return (
      <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up space-y-6 pb-10">
      
      {/* 1. Header Page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo Cáo Hợp Đồng</h1>
          <p className="text-sm text-gray-500 mt-1">
             {managerBuildingId 
                ? `Quản lý hợp đồng tại tòa nhà ${managerBuildingId}` 
                : 'Theo dõi và quản lý các hợp đồng sắp hết hạn'}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="white" icon={<BellAlertIcon className="w-4 h-4"/>}>
            Gửi nhắc nhở
          </Button>
          <Button variant="primary" icon={<ArrowDownTrayIcon className="w-4 h-4"/>} className="bg-gray-900 text-white">
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* 2. Thống kê (Dùng allContracts để số liệu không đổi khi filter) */}
      <ContractStats contracts={allContracts} />

      {/* 3. Bộ lọc */}
      <ContractFilter 
        filters={filters}
        setFilterParams={setFilterParams}
      />

      {/* 4. Bảng dữ liệu */}
      <div className="relative min-h-[300px]">
          {listLoading && (
              <div className="absolute inset-0 z-10 bg-white/50 flex items-start justify-center pt-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
          )}
          
          <ContractTable 
            contracts={contracts} 
            onRoomChange={handleOpenRoomChange} 
          />
          
          {!listLoading && contracts.length === 0 && (
             <div className="text-center py-8 text-gray-500 text-sm">
                 Không tìm thấy hợp đồng nào phù hợp.
             </div>
          )}
      </div>

      {/* 5. Footer Info Alert */}
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