import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

// Import các modules đã tách
import ContractInfo from '../../components/features/student/ContractInfo';
import ContractTerms from '../../components/features/student/ContractTerms';
import EquipmentList from '../../components/features/student/EquipmentList';

export default function StudentContract() {
  // --- MOCK DATA ---
  const contractData = {
    contractCode: 'HD2024001',
    roomName: 'Tòa A - Phòng A301',
    capacity: 4,
    startDate: '1/9/2024',
    endDate: '30/6/2025',
    duration: 10,
    price: '400.000đ/năm', // Thực tế có thể là /tháng tùy quy định
    roommates: [
      { name: 'Trần Văn B', code: 'SV2024002' },
      { name: 'Lê Thị C', code: 'SV2024003' },
      { name: 'Phạm Văn D', code: 'SV2024004' },
    ]
  };

  const termsData = [
    'Sinh viên phải thanh toán tiền phòng đầy đủ và đúng hạn mỗi tháng (hoặc kỳ).',
    'Sinh viên phải giữ gìn vệ sinh phòng ở và khu vực chung, đổ rác đúng nơi quy định.',
    'Không được sử dụng thiết bị điện công suất lớn >1000W (bếp từ, lò sưởi...).',
    'Giữ trật tự, không gây ồn ào sau 22h00.',
    'Không được cho người ngoài qua đêm không đăng ký với ban quản lý.',
    'Vi phạm 3 lần sẽ bị chấm dứt hợp đồng và trục xuất khỏi KTX.'
  ];

  const equipmentsData = [
    { name: 'Giường ngủ', quantity: 4, status: 'Tốt' },
    { name: 'Tủ quần áo', quantity: 4, status: 'Tốt' },
    { name: 'Bàn học', quantity: 4, status: 'Tốt' },
    { name: 'Ghế ngồi', quantity: 4, status: 'Tốt' },
    { name: 'Quạt trần', quantity: 2, status: 'Tốt' },
    { name: 'Điều hòa', quantity: 1, status: 'Tốt' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Link (Nếu cần, tuy nhiên MainLayout đã có MenuTabs nên có thể bỏ qua dòng này nếu muốn sạch hơn) */}
      
      {/* 1. Module Thông tin chung */}
      <ContractInfo data={contractData} />

      {/* 2. Module Điều khoản */}
      <ContractTerms terms={termsData} />

      {/* 3. Module Trang thiết bị */}
      <EquipmentList equipments={equipmentsData} />
      
    </div>
  );
}