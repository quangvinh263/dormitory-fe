import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';
import { getZaloPayLink } from '../../services/utilityBillApi';
import zaloimg from '../../assets/images/zalopay-logo.png';
import Button from '../../components/ui/Button';

export default function UtilityPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useContext(AuthContext);
  
  const bill = location.state?.bill;

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bill) {
      alert('Không tìm thấy thông tin hóa đơn. Vui lòng thử lại.');
      navigate('/student/utility');
    }
  }, [bill, navigate]);

  const handleConfirmPayment = async () => {
    if (!bill?.id || !auth.accountId) {
      alert('Không tìm thấy thông tin thanh toán. Vui lòng thử lại.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      console.log('Creating ZaloPay link for bill ID:', bill.id, 'and account ID:', auth.accountId);
      const result = await getZaloPayLink(bill.id, auth.accountId);
      console.log('ZaloPay link result:', result);
      
      if (result.success && result.paymentUrl) {
        // Redirect to ZaloPay payment page
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

  if (!bill) {
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
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
         <h1 className="text-2xl font-bold text-gray-900">Xác Nhận Thanh Toán Điện Nước</h1>
         <p className="text-gray-500">Hóa đơn tháng {bill.month}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Thông tin hóa đơn */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Thông tin hóa đơn</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Mã hóa đơn:</span>
              <span className="font-medium">{bill.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kỳ thanh toán:</span>
              <span className="font-medium">{bill.month}</span>
            </div>
            
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tiền điện ({bill.electric.usage} kWh)</span>
              <span className="font-medium">{bill.electric.total.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tiền nước ({bill.water.usage} m³)</span>
              <span className="font-medium">{bill.water.total.toLocaleString()}đ</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Tổng thanh toán:</span>
              <span className="text-2xl font-bold text-green-600">
                {bill.totalAmount.toLocaleString()}đ
              </span>
            </div>
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Phương thức thanh toán</h2>
          <div className="flex items-center gap-3 p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
            <img src={zaloimg} alt="ZaloPay" className="w-12 h-12" />
            <div>
              <p className="font-medium text-gray-900">ZaloPay</p>
              <p className="text-sm text-gray-500">Thanh toán qua ví điện tử ZaloPay</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col-2 w-full gap-3">
          <button
            onClick={() => navigate(-1)}
            disabled={isProcessing}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Quay lại
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

        {/* Debug info */}
        <div className="text-xs text-gray-400 text-center">
          Bill ID: {bill.id} | Account ID: {auth.accountId}
        </div>
      </div>
    </div>
  );
}