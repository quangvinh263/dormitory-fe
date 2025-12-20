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
         <h1 className="text-2xl font-bold text-gray-900">Xác Nhận Thanh Toán</h1>
         <p className="text-gray-500">Vui lòng thanh toán khoản phí để giữ chỗ.</p>
      </div>

      <div className="space-y-6">
        <InvoiceInfo room={room} />
        <PaymentMethod />

        <div className="flex flex-col-2 w-full gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white"
          >
            Hủy đăng ký
          </button>

          <Button
            className="w-full px-4 py-3 rounded-lg bg-green-600 text-white text-sm justify-center"
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            icon={!isProcessing && <LockClosedIcon className="w-5 h-5" />}
          >
            {isProcessing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
          </Button>
        </div>
      </div>
    </div>
  );
}