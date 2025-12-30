import React, { useEffect, useState } from 'react';
import { CheckmarkIcon } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowDownTrayIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
const ContractPaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    // 1. Lấy dữ liệu từ state được truyền từ PaymentResult
    const paymentData = location.state?.paymentData;
    console.log("Dữ liệu thanh toán nhận được:", paymentData);
    // 2. Kiểm tra nếu không có dữ liệu (Ví dụ: Người dùng reload lại trang này)
    if (!paymentData) {
      navigate('/student/extension', { replace: true });
    } else {
      setData(paymentData);
    }
  }, [location, navigate]);

  // Hàm format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Hàm format ngày tháng
  const formatDate = (timestamp) => {
    if (!timestamp) return new Date().toLocaleString('vi-VN');
    return new Date(timestamp).toLocaleString('vi-VN');
  };

  if (!data) return null; 

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        
        {/* Header xanh lá */}
        <div className="bg-green-500 p-6 text-center">
          <div className="flex justify-center mb-4">
            <CheckmarkIcon className="text-white w-16 h-16" />
          </div>
          <h1 className="text-2xl font-bold text-white">Gia hạn thành công!</h1>
          <p className="text-green-100 mt-2">Hợp đồng của bạn đã được cập nhật.</p>
        </div>

        {/* Nội dung chi tiết giao dịch */}
        <div className="p-6 space-y-4">
          <div className="text-center pb-4 border-b border-gray-100">
            <p className="text-gray-500 text-sm">Tổng thanh toán</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {formatCurrency(data.amount)}
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Mã giao dịch:</span>
              <span className="font-medium text-gray-700">{data.transId}</span>
            </div>
            

            <div className="flex justify-between">
              <span className="text-gray-500">Thời gian:</span>
              <span className="font-medium text-gray-700">{formatDate(data.serverTime || Date.now())}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Nội dung:</span>
              <span className="font-medium text-gray-700 text-right w-1/2">
                {data.description || "Gia hạn hợp đồng phòng"}
              </span>
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
               onClick={() => navigate('/student/extension')} 
            >
               Quay lại
            </Button>
         </div>
      </div>
    </div>
  );
};

export default ContractPaymentSuccess;