import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getContractDetailById } from '../../services/contractApi';

// Import các modules đã tách
import ContractInfo from '../../components/features/student/ContractInfo';
import ContractTerms from '../../components/features/student/ContractTerms';
import EquipmentList from '../../components/features/student/EquipmentList';

export default function StudentContract() {
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contractData, setContractData] = useState(null);

  useEffect(() => {
    const fetchContractDetail = async () => {
      try {
        setLoading(true);
        const result = await getContractDetailById(auth.accountId);
        
        if (result.success && result.data) {
          setContractData(result.data);
        } else {
          setError(result.message || 'Không thể tải thông tin hợp đồng');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    if (auth.accountId) {
      fetchContractDetail();
    }
  }, [auth.accountId]);

  // Transform API data to component format
  const transformedContractData = contractData ? {
    contractCode: contractData.contractID,
    roomName: `${contractData.buildingName} - ${contractData.roomName}`,
    buildingName: contractData.buildingName,
    capacity: contractData.roomTypeName,
    startDate: new Date(contractData.startDate).toLocaleDateString('vi-VN'),
    endDate: new Date(contractData.endDate).toLocaleDateString('vi-VN'),
    duration: Math.round((new Date(contractData.endDate) - new Date(contractData.startDate)) / (1000 * 60 * 60 * 24 * 30)),
    price: `${contractData.roomPrice.toLocaleString('vi-VN')}đ/năm`,
    managerName: contractData.managerName,
    managerPhone: contractData.managerPhone,
    managerEmail: contractData.managerEmail,
    status: contractData.status
  } : null;

  const equipmentsData = contractData?.equipments?.map(eq => ({
    name: eq.equipmentName,
    code: eq.equipmentID,
    status: eq.status
  })) || [];

  const termsData = [
    'Sinh viên phải thanh toán tiền phòng đầy đủ và đúng hạn mỗi tháng (hoặc kỳ).',
    'Sinh viên phải giữ gìn vệ sinh phòng ở và khu vực chung, đổ rác đúng nơi quy định.',
    'Không được sử dụng thiết bị điện công suất lớn >1000W (bếp từ, lò sưởi...).',
    'Giữ trật tự, không gây ồn ào sau 22h00.',
    'Không được cho người ngoài qua đêm không đăng ký với ban quản lý.',
    'Vi phạm 3 lần sẽ bị chấm dứt hợp đồng và trục xuất khỏi KTX.'
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Đang tải thông tin hợp đồng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!contractData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Không tìm thấy thông tin hợp đồng</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Module Thông tin chung */}
      <ContractInfo data={transformedContractData} />

      {/* 2. Module Điều khoản */}
      <ContractTerms terms={termsData} />

      {/* 3. Module Trang thiết bị */}
      <EquipmentList equipments={equipmentsData} />
    </div>
  );
}