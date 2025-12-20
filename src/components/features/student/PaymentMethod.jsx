import { CheckCircleIcon } from '@heroicons/react/24/solid';
import ZaloPayLogo from '../../../assets/images/zalopay-logo.png';
import Section from '../../shared/Section';

export default function PaymentMethod() {
  return (
    <Section className="animate-fade-in-up delay-100">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Phương Thức Thanh Toán</h2>
      
      {/* Card ZaloPay được chọn sẵn */}
      <div className="relative flex items-center gap-4 p-4 rounded-xl border-2 border-blue-500 bg-blue-50/30 cursor-pointer transition-all">
        
        {/* Logo ZaloPay (Dùng text hoặc ảnh nếu có) */}
        <div className="w-14 h-14 bg-white rounded-lg border border-gray-100 flex items-center justify-center shrink-0">
           <img src={ZaloPayLogo} alt="ZaloPay Logo" className="w-10 h-10" />
        </div>

        <div className="flex-1">
           <h4 className="font-bold text-gray-900">Ví điện tử ZaloPay</h4>
           <p className="text-sm text-gray-500">Quét mã QR để thanh toán nhanh chóng</p>
        </div>

        {/* Icon Selected */}
        <div className="absolute top-4 right-4">
           <CheckCircleIcon className="w-6 h-6 text-blue-600"/>
        </div>
      </div>

      {/* Note nhỏ */}
      <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 text-xs rounded-lg border border-yellow-100">
         <span className="font-bold">Lưu ý:</span> Hệ thống sẽ chuyển hướng bạn sang cổng thanh toán ZaloPay Gateway. Vui lòng không tắt trình duyệt trong quá trình xử lý.
      </div>
    </Section>
  );
}