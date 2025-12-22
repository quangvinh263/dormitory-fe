import { CalendarDaysIcon, CurrencyDollarIcon, CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Button from '../../ui/Button';

export default function InsuranceInfoCard({ onRegister }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      
      {/* 1. Khối Thời gian (Time Block) */}
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4">
           <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
              <CalendarDaysIcon className="w-6 h-6"/>
           </div>
           <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                 <p className="text-sm font-bold text-gray-500 mb-1">Thời gian đăng ký:</p>
                 <p className="text-gray-900 font-medium">01/08/2024 - 31/08/2024</p>
              </div>
              <div>
                 <p className="text-sm font-bold text-gray-500 mb-1">Hiệu lực bảo hiểm:</p>
                 <p className="text-gray-900 font-medium">01/09/2024 - 31/08/2025</p>
              </div>
           </div>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-6">
        
        {/* 2. Khối Chi phí (Cost Block - Blue BG) */}
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
           <div className="flex justify-between items-center mb-1">
              <span className="text-gray-900 font-medium text-base">Chi phí bảo hiểm</span>
              <span className="text-2xl font-bold text-blue-600">250.000đ</span>
           </div>
           <p className="text-sm text-gray-600">Áp dụng cho cả năm học (12 tháng)</p>
        </div>

        {/* 3. Khối Quyền lợi (Benefits) */}
        <div className="space-y-3">
           <h3 className="font-bold text-gray-900 text-base">Quyền lợi bảo hiểm:</h3>
           <ul className="space-y-3">
              {[
                'Khám chữa bệnh tại cơ sở y tế đã đăng ký',
                'Được chi trả 80-100% chi phí điều trị nội trú',
                'Được cấp thuốc miễn phí theo danh mục',
                'Hỗ trợ chi phí xét nghiệm và chẩn đoán hình ảnh',
                'Được khám chữa bệnh tại các bệnh viện tuyến trên khi cần'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                   <CheckCircleIcon className="w-5 h-5 text-green-600 shrink-0 mt-0.5"/>
                   <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
           </ul>
        </div>

        {/* 4. Khối Hồ sơ (Requirements) */}
        <div className="space-y-3">
           <h3 className="font-bold text-gray-900 text-base">Hồ sơ cần chuẩn bị:</h3>
           <ul className="space-y-2">
              <li className="flex items-center gap-3">
                 <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                 <span className="text-sm text-gray-700">Thông tin cơ sở khám chữa bệnh ban đầu</span>
              </li>
           </ul>
        </div>

        {/* 5. Button Action */}
        <div className="pt-2">
            <Button 
                onClick={onRegister}
                className="w-full justify-center py-3 text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
            >
                Bắt đầu đăng ký
            </Button>
        </div>

      </div>
    </div>
  );
}