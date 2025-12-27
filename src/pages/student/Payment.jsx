import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { createZaloLink } from '../../services/registrationApi';
import { processZaloPayCallback } from '../../services/paymentApi';
import Button from '../../components/ui/Button';
import InvoiceInfo from '../../components/features/student/InvoiceInfo';
import PaymentMethod from '../../components/features/student/PaymentMethod';

export default function StudentPayment() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const room = location.state?.room;
  const registrationId = location.state?.registrationId;

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [callbackProcessing, setCallbackProcessing] = useState(false);
  const [callbackResult, setCallbackResult] = useState(null);

  useEffect(() => {
    if (!room || !registrationId) {
      alert('Không tìm thấy thông tin đăng ký. Vui lòng chọn phòng lại.');
      navigate('/student/registration');
    }
  }, [room, registrationId, navigate]);

  // If ZaloPay redirects back with query params, call server-side callback processor
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!params || Array.from(params.keys()).length === 0) return;

    const payload = {};
    for (const [k, v] of params.entries()) payload[k] = v;
    // attach registrationId if available
    if (registrationId) payload.registrationId = registrationId;

    const runCallback = async () => {
      try {
        setCallbackProcessing(true);
        setError('');
        const res = await processZaloPayCallback(payload);
        setCallbackResult(res);
        if (!res.success) setError(res.message || 'Thanh toán không thành công');
      } catch (err) {
        setError('Lỗi khi xử lý callback thanh toán');
      } finally {
        setCallbackProcessing(false);
      }
    };

    runCallback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tính lại tổng tiền để hiển thị (Logic giống InvoiceInfo)
  const totalAmount = room ? room.price + 50000 : 0; 

  const handleConfirmPayment = async () => {
    if (!registrationId) {
      alert('Không tìm thấy mã đăng ký. Vui lòng thử lại.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const result = await createZaloLink(registrationId);
      console.log('ZaloPay link result:', result);
      if (result.success && result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        setError(result.message || 'Không thể tạo link thanh toán. Vui lòng thử lại.');
        alert(result.message || 'Không thể tạo link thanh toán. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Error creating ZaloPay link:', err);
      setError('Đã xảy ra lỗi khi tạo link thanh toán.');
      alert('Đã xảy ra lỗi khi tạo link thanh toán. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading state nếu chưa có dữ liệu
  if (!room || !registrationId) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
         <h1 className="text-2xl font-bold text-gray-900">Xác Nhận Thanh Toán</h1>
         <p className="text-gray-500">Vui lòng thanh toán khoản phí để giữ chỗ.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {callbackProcessing && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700 text-sm">Đang xử lý kết quả thanh toán...</p>
        </div>
      )}

      {callbackResult && (
        <div className={`rounded-lg p-4 ${callbackResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`${callbackResult.success ? 'text-green-700' : 'text-red-700'} text-sm`}>{callbackResult.message || (callbackResult.success ? 'Thanh toán thành công' : 'Thanh toán thất bại')}</p>
        </div>
      )}

      <div className="space-y-6">
        <InvoiceInfo room={room} />
        <PaymentMethod />

        <div className="flex flex-col-2 w-full gap-3">
          <button
            onClick={() => navigate(-1)}
            disabled={isProcessing}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Hủy đăng ký
          </button>

          <Button
            className="w-full px-4 py-3 rounded-lg bg-green-600 text-white text-sm justify-center hover:bg-green-700 disabled:bg-gray-400 transition"
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            icon={!isProcessing && <LockClosedIcon className="w-5 h-5" />}
          >
            {isProcessing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
          </Button>
        </div>

        {/* Hiển thị thông tin debug (tùy chọn - có thể xóa sau) */}
        <div className="text-xs text-gray-400 text-center">
          Registration ID: {registrationId}
        </div>
      </div>
    </div>
  );
}