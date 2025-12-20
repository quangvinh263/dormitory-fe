import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon, LockClosedIcon } from '@heroicons/react/24/outline';

import Button from '../../components/ui/Button';
import InvoiceInfo from '../../components/features/student/InvoiceInfo';
import PaymentMethod from '../../components/features/student/PaymentMethod';

export default function StudentPayment() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  // Lấy room từ state (truyền từ trang chọn phòng qua)
  // Nếu reload trang mất state thì dùng fallback mock data
  const room = location.state?.room || { 
    id: 1, name: 'Phòng A101', building: 'A', capacity: 8, price: 400000 
  };

  const [isProcessing, setIsProcessing] = useState(false);

  // Tính lại tổng tiền để hiển thị (Logic giống InvoiceInfo)
  const totalAmount = room.price + 50000; 

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    // Giả lập gọi API ZaloPay
    setTimeout(() => {
       // Trong thực tế: window.location.href = zalopay_gateway_url;
       alert(`Đang chuyển hướng sang ZaloPay để thanh toán ${totalAmount.toLocaleString()}đ...`);
       
       // Giả lập thanh toán xong -> Về trang hợp đồng
       navigate('/student/contract'); 
       setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
         <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-2">
           <ArrowLeftIcon className="w-4 h-4 mr-1"/> Quay lại chọn phòng
         </button>
         <h1 className="text-2xl font-bold text-gray-900">Xác Nhận Thanh Toán</h1>
         <p className="text-gray-500">Vui lòng thanh toán khoản phí đầu vào để giữ chỗ.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Cột trái: Thông tin hóa đơn & Phương thức */}
        <div className="md:col-span-2 space-y-6">
           <InvoiceInfo room={room} />
           <PaymentMethod />
        </div>

        {/* Cột phải: Summary Sticky */}
        <div className="md:col-span-1">
           <div className="sticky top-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-fade-in-up delay-200">
                 <h3 className="font-bold text-gray-900 mb-4">Tổng cộng</h3>
                 <div className="flex justify-between items-end mb-6">
                    <span className="text-sm text-gray-500">Thành tiền:</span>
                    <span className="text-2xl font-bold text-primary">{totalAmount.toLocaleString()}đ</span>
                 </div>
                 
                 <Button 
                    className="w-full justify-center py-3 text-base" 
                    onClick={handleConfirmPayment}
                    disabled={isProcessing}
                    icon={!isProcessing && <LockClosedIcon className="w-5 h-5"/>}
                 >
                    {isProcessing ? 'Đang xử lý...' : 'Thanh toán ZaloPay'}
                 </Button>

                 <p className="text-xs text-center text-gray-400 mt-3">
                    Bảo mật bởi ZaloPay Gateway.
                 </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}