import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PAYMENT_TYPES } from '../../utils/constants';
import { getResultFromZaloPayCallback } from '../../services/paymentApi';
const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const processPayment = async () => {
      const appTransId = searchParams.get('apptransid');
      const status = searchParams.get('status'); 
      const params = searchParams.toString();
      console.log("PaymentResult - Tham số URL nhận được:", {params });
      console.log("appTransId:", appTransId, "status:", status);

      try {
        // 2. QUAN TRỌNG: Thêm 'await' ở đây
        const paymentRes = await getResultFromZaloPayCallback(appTransId);
        if (paymentRes.success && paymentRes.data) {
          const paymentData = paymentRes.data;
          console.log("Kết quả thanh toán từ API:", paymentData);
          // Tạo object state để truyền sang trang đích (đỡ phải gọi API lại)
          const stateData = { paymentData };

          // 3. Điều hướng dựa trên loại thanh toán
          switch (paymentData.paymentType) {
            case PAYMENT_TYPES.RENEWAL:
              // Lưu ý: route này phải trùng với route bạn định nghĩa trong App.js cho trang ContractPaymentSuccess
              navigate(`/student/renewal-payment-success?${params}`, { state: stateData, replace: true });
              break;
              
            case PAYMENT_TYPES.REGISTRATION:
              navigate(`/student/regis-payment-success?${params}`, { state: stateData, replace: true });
              break;
              
            case PAYMENT_TYPES.UTILITY:
              navigate(`/student/utility-payment-success?${params}`, { state: stateData, replace: true });
              break;
            case PAYMENT_TYPES.HEALTH_INSURANCE:
              navigate(`/student/insurance-payment-success?${params}`, { state: stateData, replace: true });
              break;
            case PAYMENT_TYPES.MAINTENANCE:
              navigate(`/student/maintenance-payment-success?${params}`, { state: stateData, replace: true });
              break;
            default:
              console.warn("Loại thanh toán không xác định:", paymentData.paymentType);
              navigate('/student', { replace: true });
          }
        } else {
            // Trường hợp API trả về success: false
             navigate('/student', { replace: true });
        }
      } catch (error) {
        console.error("Lỗi khi lấy kết quả thanh toán:", error);
        navigate('/student', { replace: true });
      }
    };
    processPayment();
  }, [navigate, searchParams]);

  // Hiển thị tạm trong lúc chờ chuyển hướng (rất nhanh, người dùng khó thấy)
  return (
    <div className="flex justify-center items-center h-screen">
      <p>Đang xử lý kết quả thanh toán...</p>
    </div>
  );
};

export default PaymentResult;