import { CalendarDaysIcon, CurrencyDollarIcon, CheckCircleIcon, DocumentTextIcon,ClockIcon } from '@heroicons/react/24/outline';
import Button from '../../ui/Button';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};
export default function InsuranceInfoCard({ onRegister,price,year,currentInsurance }) {
   const isRegistered = currentInsurance?.status === 'Active';
   const isPending = currentInsurance?.status === 'Pending';
   const hasInsurance = isRegistered || isPending;
   return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* 1. Khối Thời gian & Trạng thái */}
            <div className="p-6">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    {/* Phần hiển thị ngày tháng */}
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                            <CalendarDaysIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-bold text-gray-500 mb-1">Thời gian đăng ký:</p>
                                <p className="text-gray-900 font-medium">01/12/{year - 1} - 31/12/{year - 1}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-500 mb-1">Hiệu lực bảo hiểm:</p>
                                <p className="text-gray-900 font-medium">01/01/{year} - 31/12/{year}</p>
                            </div>
                        </div>
                    </div>

                    {/* --- PHẦN MỚI: HIỂN THỊ TRẠNG THÁI (Nếu đã đăng ký) --- */}
                    {hasInsurance && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 animate-fade-in">
                            <div className={`p-2 rounded-lg ${isRegistered ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                {isRegistered ? <CheckCircleIcon className="w-6 h-6" /> : <ClockIcon className="w-6 h-6" />}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-500 mb-1">Trạng thái hiện tại:</p>
                                <p className={`font-bold text-base ${isRegistered ? 'text-green-700' : 'text-yellow-700'}`}>
                                    {isRegistered ? 'ĐÃ ĐĂNG KÝ THÀNH CÔNG' : 'ĐANG CHỜ THANH TOÁN'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

      <div className="px-6 pb-6 space-y-6">
        
        {/* 2. Khối Chi phí (Cost Block - Blue BG) */}
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
           <div className="flex justify-between items-center mb-1">
              <span className="text-gray-900 font-medium text-base">Chi phí bảo hiểm</span>
              <span className="text-2xl font-bold text-blue-600">{price > 0 ? formatCurrency(price) : 'Đang cập nhật...'}</span>
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
        {!isRegistered && (
                    <div className="pt-2">
                        <Button
                            onClick={onRegister}
                            className="w-full justify-center py-3 text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 text-white"
                        >
                            {/* Nếu là Pending thì hiện nút Thanh toán, còn không thì hiện Đăng ký */}
                            {isPending ? 'Thanh toán ngay' : 'Bắt đầu đăng ký'}
                        </Button>
                    </div>
                )}

      </div>
    </div>
  );
}