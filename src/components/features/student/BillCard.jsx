import { BoltIcon, CreditCardIcon, ClockIcon } from '@heroicons/react/24/outline';
import { GiWaterDrop } from "react-icons/gi";
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';

export default function BillCard({ bill, onPay }) {
  // Helper format tiền
  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all hover:shadow-lg ${bill.status === 'unpaid' ? 'border-orange-200' : 'border-gray-200'}`}>
      
      {/* 1. HEADER CARD */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Hóa đơn tháng {bill.month}</h3>
          <p className="text-sm text-gray-500 mt-1">Mã hóa đơn: <span className="font-mono font-medium text-gray-700">{bill.code}</span></p>
        </div>
        
        {/* Badge trạng thái */}
        <Badge type={bill.status === 'unpaid' ? 'warning' : 'success'} className="px-3 py-1">
           {bill.status === 'unpaid' ? 'Chưa thanh toán' : 'Đã thanh toán'}
        </Badge>
      </div>

      {/* 2. BODY: Grid Điện & Nước */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Cột ĐIỆN */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-yellow-50 rounded-lg text-yellow-600 border border-yellow-100">
                 <BoltIcon className="w-5 h-5"/>
              </div>
              <span className="font-bold text-gray-700">Tiền Điện</span>
           </div>

           <div className="pl-9 space-y-3">
              <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Chỉ số (Cũ → Mới)</span>
                 <span className="font-medium text-gray-900">{bill.electric.old} → {bill.electric.new} kWh</span>
              </div>
              <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Tiêu thụ</span>
                 <span className="font-medium text-gray-900">{bill.electric.usage} kWh × {bill.electric.rate.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-base pt-2 border-t border-dashed border-gray-200">
                 <span className="font-medium text-gray-900">Thành tiền</span>
                 <span className="font-bold text-gray-900">{formatMoney(bill.electric.total)}</span>
              </div>
           </div>
        </div>

        {/* Cột NƯỚC (Có đường kẻ ngăn cách trên mobile nếu cần, ở đây dùng gap) */}
        <div className="space-y-4 md:border-l md:border-gray-100 md:pl-8">
           <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600 border border-blue-100">
                 <GiWaterDrop className="w-5 h-5"/> 
              </div>
              <span className="font-bold text-gray-700">Tiền Nước</span>
           </div>

           <div className="pl-9 space-y-3">
              <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Chỉ số (Cũ → Mới)</span>
                 <span className="font-medium text-gray-900">{bill.water.old} → {bill.water.new} m³</span>
              </div>
              <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Tiêu thụ</span>
                 <span className="font-medium text-gray-900">{bill.water.usage} m³ × {bill.water.rate.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-base pt-2 border-t border-dashed border-gray-200">
                 <span className="font-medium text-gray-900">Thành tiền</span>
                 <span className="font-bold text-gray-900">{formatMoney(bill.water.total)}</span>
              </div>
           </div>
        </div>

      </div>

      {/* 3. FOOTER: Tổng tiền & Action */}
      <div className="bg-gray-50 p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
         
         {/* Thông tin tổng */}
         <div className="w-full sm:w-auto">
            <p className="text-sm text-gray-500 mb-1">Tổng cộng phải thanh toán</p>
            <div className="flex items-end gap-3">
               <span className="text-2xl font-bold text-gray-900">{formatMoney(bill.totalAmount)}</span>
               {bill.status === 'unpaid' && (
                  <div className="flex items-center gap-1 text-xs text-orange-600 font-medium mb-1.5 bg-orange-50 px-2 py-0.5 rounded">
                     <ClockIcon className="w-3.5 h-3.5"/>
                     Hạn: {bill.deadline}
                  </div>
               )}
            </div>
         </div>

         {/* Nút thanh toán (Chỉ hiện khi chưa thanh toán) */}
         {bill.status === 'unpaid' && (
            <Button 
               onClick={() => onPay(bill)} 
               className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200"
               icon={<CreditCardIcon className="w-5 h-5"/>}
            >
               Thanh toán ngay
            </Button>
         )}

         {/* Nếu đã thanh toán thì hiện ngày thanh toán */}
         {bill.status === 'paid' && (
            <div className="text-right">
               <p className="text-xs text-gray-500">Đã thanh toán vào lúc</p>
               <p className="text-sm font-medium text-green-600">{bill.paidDate}</p>
            </div>
         )}
      </div>

    </div>
  );
}