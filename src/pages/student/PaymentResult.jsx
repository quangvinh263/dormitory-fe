import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy toàn bộ tham số từ ZaloPay trả về
    const params = searchParams.toString();
    
    // Chuyển hướng NGAY LẬP TỨC sang trang Gia Hạn
    // Kèm theo params để trang kia hiển thị thông báo thành công
    navigate(`/student/extension?${params}`, { replace: true });
    
  }, [navigate, searchParams]);

  // Hiển thị tạm trong lúc chờ chuyển hướng (rất nhanh, người dùng khó thấy)
  return (
    <div className="flex justify-center items-center h-screen">
      <p>Đang xử lý kết quả thanh toán...</p>
    </div>
  );
};

export default PaymentResult;