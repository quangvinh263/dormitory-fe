import { HomeIcon, TicketIcon, BanknotesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Section from '../../shared/Section';

export default function InvoiceInfo({ room = {} }) {
   const serviceFee = 50000;
   const totalAmount = (room.price || 0) + serviceFee;

   const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

   const orderCode = room.orderCode || `DK${String(room.id || '2024').padStart(6, '0')}`;

   return (
      <Section className="animate-fade-in-up">
         {/* Header */}
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-white rounded-md shadow-sm">
                  <HomeIcon className="w-5 h-5 text-blue-600" />
               </div>
               <div>
                  <h2 className="text-lg font-semibold text-gray-900">Thanh Toán Tiền Phòng</h2>
                  <p className="text-sm text-gray-500">Mã đơn: <span className="font-medium text-gray-800">{orderCode}</span></p>
               </div>
            </div>
         </div>

         {/* Success alert */}
         <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-100 flex items-start gap-3">
            <div className="text-green-600 mt-0.5">
               <CheckCircleIcon className="w-6 h-6" />
            </div>
            <div>
               <p className="font-semibold text-sm text-green-800">Đăng ký phòng thành công!</p>
               <p className="text-sm text-green-700">Vui lòng thanh toán tiền phòng kỳ đầu để hoàn tất đăng ký.</p>
            </div>
         </div>

         {/* Selected room info */}
         <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Thông tin phòng đã chọn:</h3>

            <div className="bg-gray-50 rounded-lg border border-gray-100 p-3 grid grid-cols-1 gap-3">
               <div className="flex justify-between">
                  <div className="text-sm text-gray-500">Phòng:</div>
                  <div className="font-medium text-gray-900">{room.name || 'A1.02'}</div>
               </div>
               <div className="flex justify-between">
                  <div className="text-sm text-gray-500">Tòa nhà:</div>
                  <div className="font-medium text-gray-900">Tòa {room.building || 'A'} (Khu Phổ thông)</div>
               </div>
               <div className="flex justify-between">
                  <div className="text-sm text-gray-500">Loại phòng:</div>
                  <div className="font-medium text-gray-900">Phòng {room.capacity || 8} người</div>
               </div>
               <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">Số tiền cần thanh toán:</div>
                  <div className="font-bold text-green-600 text-lg">{formatMoney(room.price || 0)}</div>
               </div>
            </div>
         </div>

      </Section>
   );
}