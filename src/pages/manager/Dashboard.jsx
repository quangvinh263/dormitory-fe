import { 
  DocumentTextIcon, UserGroupIcon, BoltIcon, ExclamationTriangleIcon, 
  CheckCircleIcon, XCircleIcon 
} from '@heroicons/react/24/outline';
import StatCard from '../../components/shared/StatCard';
import Section from '../../components/shared/Section';

export default function ManagerDashboard() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* 1. THỐNG KÊ QUẢN LÝ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Đơn chờ duyệt" value="3" subtext="Cần xử lý ngay" icon={<DocumentTextIcon className="w-5 h-5"/>} type="warning" />
        <StatCard title="Phòng trống" value="111" subtext="Tổng: 132 phòng" icon={<UserGroupIcon className="w-5 h-5"/>} />
        <StatCard title="Thanh toán chờ xác nhận" value="1" subtext="Tháng 8/2024" icon={<BoltIcon className="w-5 h-5"/>} />
        <StatCard title="Vi phạm mới" value="2" subtext="Tăng so với tháng trước" icon={<ExclamationTriangleIcon className="w-5 h-5"/>} type="danger" />
      </div>

      {/* 2. DANH SÁCH ĐƠN MỚI */}
      <Section title="Đơn Đăng Ký Mới Nhất">
        <div className="space-y-4">
          {/* Mockup Item 1 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
             <div>
                <div className="flex items-center gap-2">
                   <h4 className="font-bold text-gray-900">Nguyễn Văn A</h4>
                   <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded font-medium">Con liệt sĩ</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">SV2024001 • Đăng ký phòng A3.01</p>
             </div>
             <div className="flex items-center gap-2 mt-3 md:mt-0">
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-white border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 shadow-sm transition-colors cursor-pointer">
                  <CheckCircleIcon className="w-4 h-4"/> Duyệt
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 shadow-sm transition-colors cursor-pointer">
                  <XCircleIcon className="w-4 h-4"/> Từ chối
                </button>
             </div>
          </div>
          
          {/* Mockup Item 2 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
             <div>
                <div className="flex items-center gap-2">
                   <h4 className="font-bold text-gray-900">Lê Thị C</h4>
                   <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-medium">Hộ nghèo</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">SV2024002 • Đăng ký phòng A2.05</p>
             </div>
             <div className="flex items-center gap-2 mt-3 md:mt-0">
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-white border border-gray-200 rounded-lg hover:bg-green-50 shadow-sm cursor-pointer">
                  <CheckCircleIcon className="w-4 h-4"/> Duyệt
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-gray-200 rounded-lg hover:bg-red-50 shadow-sm cursor-pointer">
                  <XCircleIcon className="w-4 h-4"/> Từ chối
                </button>
             </div>
          </div>
        </div>
      </Section>

      {/* 3. NHIỆM VỤ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Section title="Nhiệm Vụ Hôm Nay">
            <ul className="space-y-3">
               {['Nhập chỉ số điện nước T8', 'Kiểm tra vệ sinh tầng 3', 'Duyệt hồ sơ tân sinh viên'].map((task, i) => (
                 <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    {task}
                 </li>
               ))}
            </ul>
         </Section>

         <Section title="Cảnh Báo Hệ Thống">
            <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex gap-3 items-start">
               <ExclamationTriangleIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5"/>
               <div>
                 <p className="text-sm font-bold text-gray-900">Phòng A301 - Hỏng máy lạnh</p>
                 <p className="text-xs text-gray-500">Báo cáo lúc: 08:30 sáng nay</p>
               </div>
            </div>
         </Section>
      </div>
    </div>
  );
}