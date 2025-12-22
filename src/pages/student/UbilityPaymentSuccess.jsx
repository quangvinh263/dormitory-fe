import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ArrowDownTrayIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Lấy data từ URL params (ZaloPay trả về)
  // Ví dụ URL: /payment-success?amount=425000&appid=2554&apptransid=250420_123456&bankcode=ATM&checksum=...&status=1
  const [transaction, setTransaction] = useState({
    amount: searchParams.get('amount') || 425000,
    transId: searchParams.get('apptransid') || `VNPAY_HD082024_${Date.now()}`, // Fallback giả lập
    info: 'Thanh toán hóa đơn tháng 08/2024',
    time: new Date().toLocaleString('vi-VN'),
    invoiceCode: 'HD082024',
    month: '08/2024'
  });

  return (
    <div className="w-full space-y-6">
      
      {/* Card Success */}
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up">
         
         {/* 1. Header Xanh */}
         <div className="p-6 border-b border-gray-50 flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
               <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
            
            <div>
               <h1 className="text-xl font-bold text-green-600">Thanh toán thành công!</h1>
               <p className="text-sm text-gray-500 mt-1">Mã giao dịch: <span className="font-bold text-gray-700">{transaction.transId}</span></p>
            </div>
         </div>

         {/* 2. Body Info */}
         <div className="p-6 space-y-6">
            
            {/* Thông báo chính */}
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 space-y-2">
               <p className="text-sm text-green-800 font-medium">
                  {transaction.info} đã thành công.
               </p>
               <p className="text-green-700 font-bold text-lg">
                  Số tiền: {Number(transaction.amount).toLocaleString()}đ
               </p>
            </div>

            {/* Chi tiết giao dịch */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
               <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-2">Thông tin giao dịch:</h3>
               
               <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Mã hóa đơn:</span>
                  <span className="font-medium text-gray-900">{transaction.invoiceCode}</span>
               </div>
               <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tháng:</span>
                  <span className="font-medium text-gray-900">{transaction.month}</span>
               </div>
               <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Số tiền:</span>
                  <span className="font-bold text-gray-900">{Number(transaction.amount).toLocaleString()}đ</span>
               </div>
               <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Thời gian:</span>
                  <span className="font-medium text-gray-900">{transaction.time}</span>
               </div>
            </div>
         </div>

         {/* 3. Footer Action */}
         <div className="p-6 pt-0 flex gap-3">
            <Button 
               variant="white" 
               className="flex-1 justify-center"
               icon={<ArrowDownTrayIcon className="w-4 h-4"/>}
               onClick={() => alert("Đang tải hóa đơn PDF...")}
            >
               Tải hóa đơn
            </Button>
            
            <Button 
               className="flex-1 justify-center"
               icon={<ArrowLeftIcon className="w-4 h-4"/>}
               onClick={() => navigate('/student/utility')} // Quay về trang Điện nước
            >
               Quay lại
            </Button>
         </div>

      </div>
      
    </div>
  );
}