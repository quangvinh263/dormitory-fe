import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import Section from '../../components/shared/Section';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { AuthContext } from '../../context/AuthContext';
import { getCurrentContract } from '../../services/contractApi';

export default function RenewContract() {
  const navigate = useNavigate();
  const location = useLocation();

  // Nếu được gọi từ trang khác có thể truyền contract/room trong location.state
  const initialContract = location.state?.contract || null;
  const { auth } = useContext(AuthContext);
  const [contract, setContract] = useState(initialContract);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const [months, setMonths] = useState(6);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = contract?.yearlyPrice ? (contract.yearlyPrice / 12) * months : 0;

  const parseDate = (d) => {
    const dt = new Date(d);
    return dt;
  };

  const formatDate = (d) => {
    const dt = new Date(d);
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const yyyy = dt.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  // compute start = day after current expiry, end = start + months - 1 day
  const expiry = contract?.expiresAt ? parseDate(contract.expiresAt) : null;
  let startDate = null;
  let endDate = null;
  if (expiry) {
    startDate = new Date(expiry);
    startDate.setDate(startDate.getDate() + 1);
    endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + months);
    endDate.setDate(endDate.getDate() - 1);
  }

  const breakdownText = `${months} tháng = ${totalAmount.toLocaleString()}đ`;

  const handleConfirm = () => {
    setIsProcessing(true);
    // giả lập gọi API gia hạn
    setTimeout(() => {
      setIsProcessing(false);
      // chuyển về trang hợp đồng
      navigate('/student/contract');
    }, 1200);
  };

  useEffect(() => {
    // nếu đã có contract từ location thì không cần gọi
    if (contract) return;

    const accountId = auth?.accountId || localStorage.getItem('accountId');
    if (!accountId) {
      setFetchError('Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.');
      return;
    }

    let mounted = true;
    setLoading(true);
    getCurrentContract(accountId)
      .then((res) => {
        if (!mounted) return;
        if (res.success && res.data) {
          setContract(res.data);
        } else {
          setContract(null);
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setFetchError(err?.message || 'Lỗi khi lấy hợp đồng');
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [auth?.accountId]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gia hạn hợp đồng</h1>
        <p className="text-gray-500">Chọn thời gian gia hạn để áp dụng cho sinh viên.</p>
      </div>

      {loading ? (
        <Section>
          <div>Đang tải hợp đồng hiện tại...</div>
        </Section>
      ) : fetchError ? (
        <Section>
          <div className="text-red-600">{fetchError}</div>
        </Section>
      ) : !contract ? (
        <Section>
          <div className="py-6 text-center">
            <div className="text-lg font-medium text-gray-800">Bạn chưa có hợp đồng để tiến hành gia hạn.</div>
            <div className="text-lg font-medium text-gray-800">Vui lòng đăng ký hợp đồng ở ký túc xá.</div>
          </div>
        </Section>
      ) : (
        <Section>
          <div className="space-y-4">
            <div className="bg-[#EFF6FF] rounded-xl p-5 border border-blue-100">
              <h3 className="font-bold text-base mb-4 text-gray-700">Thông tin hợp đồng hiện tại:</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center w-full">
                  <span className="text-gray-500">Mã hợp đồng:</span>
                  <span className="font-medium text-gray-900">{contract.id}</span>
                </div>
                <div className="flex justify-between items-center w-full">
                  <span className="text-gray-500">Phòng:</span>
                  <span className="font-medium text-gray-900">{contract.room.name} (Tòa {contract.room.building})</span>
                </div>
                <div className="flex justify-between items-center w-full">
                  <span className="text-gray-500">Ngày hết hạn:</span>
                  <span className="font-medium text-gray-900">{formatDate(contract.expiresAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian gia hạn</label>
                <div className="w-full">
                  <Select
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                  >
                    <option value={6}>6 tháng</option>
                    <option value={12}>12 tháng</option>
                  </Select>
                </div>
                <div className="mt-3 text-sm text-gray-600">{months} tháng ({formatDate(startDate)} - {formatDate(endDate)})</div>
              </div>

              <div className="w-52 bg-white border border-gray-100 rounded-md p-3">
                <div className="text-sm text-gray-500">Chi phí dự kiến</div>
                <div className="mt-2 text-sm text-gray-700">{breakdownText}</div>
                <div className="mt-3 font-bold text-green-600 text-lg">{totalAmount.toLocaleString()} đ</div>
              </div>
            </div>
            <div className="flex flex-col-2 w-full gap-3">
              <Button variant="white" onClick={() => navigate(-1)} className="w-full">Hủy</Button>
              <Button onClick={handleConfirm} className="w-full" disabled={isProcessing}>
                {isProcessing ? 'Đang xử lý...' : `Gia hạn ${months} tháng & Thanh toán`}
              </Button>
            </div>
          </div>
        </Section>
      )}

      
    </div>
  );
}
