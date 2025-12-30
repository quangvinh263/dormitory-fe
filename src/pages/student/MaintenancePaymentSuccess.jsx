import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ArrowDownTrayIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';

const ContractPaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    // 1. Lấy dữ liệu từ state được truyền từ PaymentResult
    const paymentData = location.state?.paymentData;
    console.log("Dữ liệu thanh toán nhận được:", paymentData);

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

  // Nếu chưa có dữ liệu (đang redirect hoặc state null) thì không render gì cả
  if (!data) return null; 

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
                   <p className="text-sm text-gray-500 mt-1">
                     Mã giao dịch: <span className="font-bold text-gray-700">{data.transId || data.zpTransId}</span>
                   </p>
                </div>
             </div>
    
             {/* 2. Body Info */}
             <div className="p-6 space-y-6">
                
                {/* Thông báo chính & Số tiền */}
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 space-y-2">
                   <p className="text-sm text-green-800 font-medium text-center">
                      Hóa đơn bảo trì sửa chữa thiết bị đã được thanh toán thành công.
                   </p>
                   <p className="text-green-700 font-bold text-2xl text-center">
                      {formatCurrency(data.amount)}
                   </p>
                </div>
    
                {/* Chi tiết giao dịch */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                   <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-2">
                     Thông tin giao dịch:
                   </h3>
                   
                   {/* Mã tham chiếu */}
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Mã tham chiếu:</span>
                      <span className="font-medium text-gray-900">{data.transId}</span>
                   </div>
    
                   {/* Thời gian */}
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Thời gian:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(data.serverTime || Date.now())}
                      </span>
                   </div>
    
                   {/* Nội dung (Có xử lý xuống dòng nếu dài) */}
                   <div className="flex justify-between items-start text-sm">
                      <span className="text-gray-500 shrink-0 mr-4 pt-0.5">Nội dung:</span>
                      <span className="font-medium text-gray-900 text-right break-words flex-1">
                        {data.description || "Thanh toán hóa đơn dịch vụ"}
                      </span>
                   </div>
    
                   {/* Trạng thái */}
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Trạng thái:</span>
                      <span className="font-bold text-green-600">Đã thanh toán</span>
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
                   onClick={() => navigate('/student/maintenance')} // Quay về trang Điện nước
                >
                   Quay lại
                </Button>
             </div>
    
          </div>
          
        </div>
  );
};

export default ContractPaymentSuccess;