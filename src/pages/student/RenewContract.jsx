import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import Section from '../../components/shared/Section';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { AuthContext } from '../../context/AuthContext';
import { getStudentContractDetail, requestRenewal } from '../../services/contractApi';

export default function RenewContract() {
  const navigate = useNavigate();
  const location = useLocation();

  // Nếu được gọi từ trang khác có thể truyền contract/room trong location.state
  const initialContract = location.state?.contract || null;
  console.debug('[RenewContract] initialContract from location.state:', initialContract);
  const { auth } = useContext(AuthContext);
  // Temporarily ignore initialContract so we always fetch fresh data from API
  const [contract, setContract] = useState(null);
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
    const accountId = auth?.accountId || localStorage.getItem('accountId');
    if (!accountId) {
      alert('Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.');
      return;
    }

    const doRequest = async () => {
      setIsProcessing(true);
      try {
        const result = await requestRenewal(accountId, months);
        console.debug('[RenewContract] requestRenewal result:', result);
        if (result.success) {
          const invoiceId = result.data?.invoiceId || result.data?.message || null;
          alert('Yêu cầu gia hạn đã được tạo.');
          navigate('/student/contract', { state: { invoiceId } });
        } else {
          alert(result.message || 'Không thể tạo yêu cầu gia hạn.');
        }
      } catch (err) {
        console.error('[RenewContract] requestRenewal error:', err);
        alert('Đã xảy ra lỗi khi gửi yêu cầu gia hạn. Vui lòng thử lại.');
      } finally {
        setIsProcessing(false);
      }
    };

    doRequest();
  };

  useEffect(() => {
    
    if (initialContract) {
      console.debug('[RenewContract] using initialContract from location.state');
      setContract(normalizeContract(initialContract));
      setLoading(false);
      return;
    }
    if (contract) {
      console.debug('[RenewContract] skip fetch: contract state already set');
      return;
    }

    const accountId = auth?.accountId || localStorage.getItem('accountId');
    console.debug('[RenewContract] resolved accountId=', accountId);
    if (!accountId) {
      console.debug('[RenewContract] no accountId found, aborting fetch');
      setFetchError('Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.');
      return;
    }

    let mounted = true;
    setLoading(true);
    console.debug('[RenewContract] fetching student contract by accountId=', accountId);
    getStudentContractDetail(accountId)
      .then((res) => {
        console.debug('[RenewContract] getStudentContractDetail response:', res);
        if (!mounted) return;
        // Try to resolve contract object from multiple possible shapes
        let candidate = null;
        if (res.success) {
          candidate = res.data || res.raw?.data || res.raw?.dto || res.raw?.contract || res.raw || null;
          // sometimes BE returns wrapper { dto: {...} } or { data: {...} }
          if (!candidate && res.raw) {
            // attempt to find nested object that looks like a contract
            const keys = Object.keys(res.raw || {});
            for (const k of keys) {
              const v = res.raw[k];
              if (v && typeof v === 'object' && (v.id || v.expiresAt || v.room)) {
                candidate = v;
                break;
              }
            }
          }
        }

        console.debug('[RenewContract] resolved contract candidate:', candidate);
        if (candidate && typeof candidate === 'object') {
          setContract(normalizeContract(candidate));
        } else {
          setContract(null);
          if (res.message) setFetchError(res.message || 'Không tìm thấy hợp đồng cho sinh viên.');
        }
      })
      .catch((err) => {
        console.error('[RenewContract] getStudentContractDetail error:', err);
        if (!mounted) return;
        setFetchError(err?.message || 'Lỗi khi lấy hợp đồng');
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [auth?.accountId]);

  useEffect(() => {
    console.debug('[RenewContract] contract state updated:', contract);
  }, [contract]);

  // Normalize different API shapes into the fields this component expects
  function normalizeContract(src) {
    if (!src || typeof src !== 'object') return null;
    const id = src.id || src.contractID || src.contractId || src.contract_id || src.code || null;

    // room: try nested room object first, otherwise build from roomName/buildingName
    const roomName = src.room?.name || src.roomName || src.room_name || src.roomName?.name || src.room?.roomName || src.roomName || null;
    const building = src.room?.building || src.building || src.buildingName || src.building_name || null;

    const room = roomName || building ? { name: roomName || '-', building: building || '' } : null;

    const expiresAt = src.expiresAt || src.endDate || src.end_date || src.expiry || src.expires_at || src.expiredAt || null;

    const yearlyPrice = src.yearlyPrice || src.roomPrice || src.price || src.room?.price || src.roomPricePerYear || null;

    return {
      ...src,
      id,
      room,
      expiresAt,
      yearlyPrice,
    };
  }

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
                  <span className="font-medium text-gray-900">{contract?.id || '-'}</span>
                </div>
                <div className="flex justify-between items-center w-full">
                  <span className="text-gray-500">Phòng:</span>
                  <span className="font-medium text-gray-900">{contract?.room?.name || '-'} {contract?.room?.building ? `(Tòa ${contract.room.building})` : ''}</span>
                </div>
                <div className="flex justify-between items-center w-full">
                  <span className="text-gray-500">Ngày hết hạn:</span>
                  <span className="font-medium text-gray-900">{contract?.expiresAt ? formatDate(contract.expiresAt) : '-'}</span>
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
                <div className="mt-3 text-sm text-gray-600">{months} tháng ({startDate ? formatDate(startDate) : '-'} - {endDate ? formatDate(endDate) : '-'})</div>
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
