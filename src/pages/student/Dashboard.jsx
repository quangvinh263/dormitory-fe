import { 
  HomeIcon, CurrencyDollarIcon, ExclamationTriangleIcon, 
  HeartIcon, ClockIcon, DocumentTextIcon, BoltIcon, ShieldCheckIcon 
} from '@heroicons/react/24/outline';
import StatCard from '../../components/shared/StatCard';
import Section from '../../components/shared/Section';

export default function StudentDashboard() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* 1. CẢNH BÁO (Mockup) */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 flex items-start gap-4 shadow-sm">
        <div className="p-2 bg-orange-100 rounded-lg shrink-0">
           <ExclamationTriangleIcon className="w-8 h-8 text-orange-600" />
        </div>
        <div className="flex-1">
           <h3 className="text-lg font-bold text-orange-800 mb-1">Hợp đồng sắp hết hạn!</h3>
           <p className="text-orange-700 text-sm mb-4">
             Hợp đồng của bạn sẽ hết hạn vào ngày <span className="font-bold">15/01/2025</span> (10 ngày nữa). 
             Hãy gia hạn sớm để tránh gián đoạn lưu trú.
           </p>
           <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer">
             Gia hạn ngay
           </button>
        </div>
      </div>

      {/* 2. THỐNG KÊ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Trạng thái ở" value="Đang ở" subtext="Phòng A301" icon={<HomeIcon className="w-5 h-5"/>} type="success" />
        <StatCard title="Hóa đơn nợ" value="1" subtext="Cần thanh toán" icon={<CurrencyDollarIcon className="w-5 h-5"/>} type="warning" />
        <StatCard title="Vi phạm" value="0" subtext="Không có vi phạm" icon={<ExclamationTriangleIcon className="w-5 h-5"/>} type="success" />
        <StatCard title="Bảo hiểm Y tế" value="Đã mua" subtext="Hết hạn: 12/2025" icon={<HeartIcon className="w-5 h-5"/>} />
      </div>

      {/* 3. THAO TÁC NHANH */}
      <Section title="Thao Tác Nhanh">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Đăng ký / Gia hạn', icon: <DocumentTextIcon className="w-6 h-6"/> },
              { label: 'Thanh toán điện nước', icon: <BoltIcon className="w-6 h-6"/> },
              { label: 'Đăng ký BHYT', icon: <HeartIcon className="w-6 h-6"/> },
              { label: 'Xem hợp đồng', icon: <ShieldCheckIcon className="w-6 h-6"/> },
            ].map((btn, idx) => (
              <button key={idx} className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-purple-200 hover:shadow-md transition-all cursor-pointer group">
                 <div className="p-3 bg-white rounded-full shadow-sm text-gray-500 group-hover:text-purple-600 transition-colors">
                   {btn.icon}
                 </div>
                 <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">{btn.label}</span>
              </button>
            ))}
         </div>
      </Section>
    </div>
  );
}