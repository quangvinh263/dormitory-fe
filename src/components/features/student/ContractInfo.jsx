import { 
  HomeIcon, CalendarDaysIcon, BanknotesIcon, 
  UserIcon, PhoneIcon, MapPinIcon, EnvelopeIcon 
} from '@heroicons/react/24/outline';
import Section from '../../shared/Section';
import Badge from '../../ui/Badge';

export default function ContractInfo({ data }) {
  
  // Xác định trạng thái badge
  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return { type: 'success', text: 'Đang hoạt động' };
    } else if (status === 'Expired') {
      return { type: 'danger', text: 'Đã hết hạn' };
    }
    return { type: 'default', text: status };
  };

  const statusBadge = getStatusBadge(data.status);

  return (
    <Section className="animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Hợp Đồng Ký Túc Xá</h2>
          <p className="text-sm text-gray-500">Mã hợp đồng: <span className="font-mono font-medium text-gray-700">{data.contractCode}</span></p>
        </div>
        <div>
           <Badge type={statusBadge.type} className="px-4 py-2 text-sm">{statusBadge.text}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 gap-x-12">
        
        {/* === CỘT TRÁI (50%): THÔNG TIN HỢP ĐỒNG === */}
        <div className="flex flex-col h-full">
          <h3 className="font-bold text-gray-900 mb-6 pb-2">Thông tin phòng</h3>
          
          <div className="flex-1 flex flex-col justify-between gap-6"> 
            
            {/* Item 1 */}
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <HomeIcon className="w-6 h-6"/>
               </div>
               <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">Phòng ở</p>
                  <p className="font-bold text-gray-900 text-lg">{data.roomName}</p>
                  <p className="text-sm text-gray-500">{data.capacity}</p>
               </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <CalendarDaysIcon className="w-6 h-6"/>
               </div>
               <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">Thời hạn</p>
                  <p className="font-bold text-gray-900 text-lg">{data.startDate} - {data.endDate}</p>
                  <p className="text-sm text-gray-500">{data.duration} tháng</p>
               </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <BanknotesIcon className="w-6 h-6"/>
               </div>
               <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">Chi phí</p>
                  <p className="font-bold text-gray-900 text-lg">{data.price}</p>
                  <p className="text-sm text-gray-500">Đã bao gồm phí dịch vụ</p>
               </div>
            </div>
          </div>
        </div>

        {/* === CỘT PHẢI (50%): THÔNG TIN QUẢN LÝ === */}
        <div className="flex flex-col h-full lg:pl-12">
          <h3 className="font-bold text-gray-900 mb-6 pb-2">Quản lý tòa nhà</h3>

          <div className="flex-1 flex flex-col justify-between gap-6">
            
            {/* Item 1 */}
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <UserIcon className="w-5 h-5"/>
               </div>
               <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">Phụ trách</p>
                  <p className="font-bold text-gray-900 text-base">{data.managerName}</p>
               </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <PhoneIcon className="w-5 h-5"/>
               </div>
               <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">Điện thoại</p>
                  <p className="font-bold text-gray-900 text-base">{data.managerPhone}</p>
               </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <EnvelopeIcon className="w-5 h-5"/>
               </div>
               <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">Email</p>
                  <p className="font-bold text-gray-900 text-base">{data.managerEmail}</p>
               </div>
            </div>

            {/* Item 4 */}
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <MapPinIcon className="w-5 h-5"/>
               </div>
               <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">Văn phòng</p>
                  <p className="font-bold text-gray-900 text-base">Văn phòng {data.buildingName}</p>
               </div>
            </div>
          </div>
        </div>

      </div>
    </Section>
  );
}