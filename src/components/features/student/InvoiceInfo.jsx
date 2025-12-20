import { HomeIcon, TicketIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import Section from '../../shared/Section';

export default function InvoiceInfo({ room }) {
  // Logic tính toán: Chỉ gồm Tiền phòng + Phí hồ sơ
  const serviceFee = 50000; 
  const totalAmount = room.price + serviceFee;

  // Format tiền tệ
  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <Section className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-6 border-b border-gray-100 pb-4">
         <h2 className="text-lg font-bold text-gray-900">Chi Tiết Hóa Đơn</h2>
         <p className="text-sm text-gray-500">Vui lòng kiểm tra các khoản phí trước khi thanh toán</p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Item 1: Tiền phòng */}
        <div className="flex items-center gap-4">
           <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
              <HomeIcon className="w-6 h-6"/>
           </div>
           <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">Tiền phòng tháng đầu</p>
              <p className="font-bold text-gray-900 text-base">{room.name} - Tòa {room.building}</p>
           </div>
           <div className="text-right">
              <p className="font-bold text-gray-900">{formatMoney(room.price)}</p>
           </div>
        </div>

        {/* Item 2: Phí hồ sơ */}
        <div className="flex items-center gap-4">
           <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
              <TicketIcon className="w-6 h-6"/>
           </div>
           <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">Phí dịch vụ</p>
              <p className="font-bold text-gray-900 text-base">Lệ phí hồ sơ & Thẻ KTX</p>
           </div>
           <div className="text-right">
              <p className="font-bold text-gray-900">{formatMoney(serviceFee)}</p>
           </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-dashed bg-gray-200 my-2"></div>

        {/* Tổng cộng */}
        <div className="flex items-center gap-4">
           <div className="p-3 bg-green-50 text-green-600 rounded-xl shrink-0">
              <BanknotesIcon className="w-6 h-6"/>
           </div>
           <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">Tổng thanh toán</p>
              <p className="font-bold text-primary text-xl">Thành tiền</p>
           </div>
           <div className="text-right">
              <p className="font-bold text-primary text-2xl">{formatMoney(totalAmount)}</p>
           </div>
        </div>

      </div>
    </Section>
  );
}