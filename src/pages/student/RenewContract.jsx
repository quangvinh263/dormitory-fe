import { useState, useEffect, useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import Section from '../../components/shared/Section'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import { AuthContext } from '../../context/AuthContext'
import { getStudentContractDetail, createRenewalRequest,getPendingRequest } from '../../services/contractApi'
import { getStudentInfo } from '../../services/studentApi'
import { createZaloPayLinkForRenewal } from '../../services/paymentApi'

export default function RenewContract() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { auth } = useContext(AuthContext)

  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [months, setMonths] = useState(6)
  const [processing, setProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [pendingReq, setPendingReq] = useState(null);
  
  useEffect(() => {
    const appTransId = searchParams.get('apptransid');
    const status = searchParams.get('status');

    // Nếu có mã giao dịch -> Đây là người vừa thanh toán xong
    if (appTransId || status) {
      console.log("Phát hiện thanh toán, đang chuyển hướng về trang Kết quả...");
    
      navigate(`/student/extension?${searchParams.toString()}`, { replace: true });
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    let mounted = true
    const accountId = auth?.accountId || localStorage.getItem('accountId')
    if (!accountId) {
      setError('Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.')
      setLoading(false)
      return
    }

  const fetch = async () => {
    try {
      const stuRes = await getStudentInfo(accountId);
      if (!mounted) return;
      if (!stuRes.success || !stuRes.data) {
        throw new Error(stuRes.message || 'Không thể lấy thông tin sinh viên');
      }
      // Lấy studentId (xử lý nhiều trường hợp key khác nhau)
      const studentId = stuRes.data.studentID || stuRes.data.studentID || stuRes.data.id;

      const [contractRes, pendingRes] = await Promise.all([
          getStudentContractDetail(accountId),
          getPendingRequest(studentId)
        ]);
      if (!mounted) return;
      if (contractRes.success && contractRes.data) {
        setContract(normalize(contractRes.data))
      } else {
        setError(contractRes.message || 'Không tìm thấy hợp đồng cho sinh viên.')
      }
      if (pendingRes.success && pendingRes.data) {
          console.log("Pending Data:", pendingRes.data);
          setPendingReq(pendingRes.data.data); 
          console.log(pendingReq)
        } else {
          setPendingReq(null); // Không có đơn chờ
        }
    } 
    catch (err) 
    {
      if (!mounted) return
      setError('Đã xảy ra lỗi khi tải hợp đồng'+`${err}`)
    } 
    finally 
    {
      mounted && setLoading(false)
    }
  }
    fetch()
    return () => { mounted = false }
  }, [auth])

  const handleRepay = async () => {
    if (!pendingReq) return;
  
    const receiptId = pendingReq.receiptId || pendingReq.paymentId || pendingReq.id;

    if (!receiptId) {
      setError("Lỗi dữ liệu: Không tìm thấy mã hóa đơn trong yêu cầu cũ.");
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // Gọi thẳng API lấy link ZaloPay
      const payRes = await createZaloPayLinkForRenewal(receiptId);
      
      if (!payRes.success) {
         setError(payRes.message || 'Không lấy được link thanh toán');
         return;
      }
      
      const payBody = payRes.data || {};
      const link = payBody.paymentUrl || payBody.PaymentUrl || payBody.data?.paymentUrl;

      if (link) {
         // Chuyển hướng sang ZaloPay
         window.location.href = link; 
      } else {
         setError("Hệ thống không trả về đường dẫn thanh toán.");
      }
    } catch (err) {
      setError("Lỗi khi kết nối thanh toán: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirm = async () => {
    const accountId = auth?.accountId || localStorage.getItem('accountId')
    if (!accountId) return setError('Vui lòng đăng nhập lại.')

    setProcessing(true)
    setError('')
    try {
      const stu = await getStudentInfo(accountId)
      if (!stu.success || !stu.data) {
        setError(stu.message || 'Không thể lấy thông tin sinh viên')
        return
      }

      const studentId = stu.data.studentId || stu.data.studentID || stu.data.id
      if (!studentId) {
        setError('Không tìm thấy mã sinh viên')
        return
      }

      const res = await createRenewalRequest(studentId, months)
      // Accept multiple response shapes: top-level receiptId, res.data.receiptId, or nested ids
      if (!res.success && !res.receiptId && !res.data && !res.id) {
        setError(res.message || 'Yêu cầu gia hạn thất bại')
        return
      }

      const body = res.data ?? {}
      console.log("Renewal Response:", res, "body:", body);

      const receiptId = res.receiptId || res.paymentId || body.receiptId || body.paymentId || body.data?.receiptId || body.data?.paymentId || res.id || body.id || null
      if (!receiptId) {
          console.error("Không tìm thấy Receipt ID");
          setError('Lỗi hệ thống: Không lấy được mã hóa đơn');
          return;
      }
      if (receiptId) {
        const payRes = await createZaloPayLinkForRenewal(receiptId)
        if (!payRes.success) {
          setError(payRes.message || 'Không thể tạo đường dẫn thanh toán')
          return
        }
        const payBody = payRes.data || {}
        const link = payBody.paymentUrl || payBody.PaymentUrl || payBody.data?.paymentUrl || payBody.data?.PaymentUrl || null
        if (link) {
            sessionStorage.setItem('payment_redirect_to', window.location.pathname);
            window.location.href = link;
            return; 
        }
        else
        {
          setError('Lỗi: Hệ thống không trả về đường dẫn thanh toán.');
        } 
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.' + `${err}`)
    } finally {
      setProcessing(false)
    }
  }

  const normalize = (s) => {
    if (!s) return null
    const id = s.id || s.contractID || s.contractId || s.code
    const roomName = s.room?.name || s.roomName || s.roomName?.name
    const building = s.room?.building || s.building || s.buildingName
    const room = roomName || building ? { name: roomName || '-', building: building || '' } : null
    const expiresAt = s.expiresAt || s.endDate || s.expiry
    const yearlyPrice = s.yearlyPrice || s.roomPrice || s.price || s.room?.price
    return { ...s, id, room, expiresAt, yearlyPrice }
  }

  const formatDate = (d) => {
    if (!d) return '-'
    const dt = new Date(d)
    return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`
  }

  const totalAmount = contract?.yearlyPrice ? (contract.yearlyPrice / 12) * months : 0

  if (paymentSuccess) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-10">
        <Section>
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h2>
            <p className="text-gray-600 mb-6">
              Hợp đồng của bạn đã được gia hạn thêm <b>{months} tháng</b>.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => navigate('/student/dashboard')}>
                Về trang chủ
              </Button>
              <Button variant="white" onClick={() => window.location.reload()}>
                Gia hạn tiếp
              </Button>
            </div>
          </div>
        </Section>
      </div>
    )
  }
  
  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải hợp đồng...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-600 font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg">Thử lại</button>
          </div>
        </div>
      </div>
    )
  }

  if (!contract) {
    return (
      <Section>
        <div className="py-6 text-center">
          <div className="text-lg font-medium text-gray-800">Bạn chưa có hợp đồng để tiến hành gia hạn.</div>
          <div className="text-lg font-medium text-gray-800">Vui lòng đăng ký hợp đồng ở ký túc xá.</div>
        </div>
      </Section>
    )
  }

  if (pendingReq){
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 shadow-sm animate-fade-in-up">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* Cột 1: Icon và Tiêu đề */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600 text-xl">
                ⏳
              </span>
              <h3 className="text-lg font-bold text-orange-800">
                Đơn gia hạn chưa thanh toán
              </h3>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">
              Hệ thống ghi nhận bạn đã tạo một yêu cầu gia hạn nhưng chưa hoàn tất thanh toán. 
              Vui lòng thanh toán để hệ thống cập nhật hợp đồng mới.
            </p>

            {/* Thông tin chi tiết đơn hàng */}
            <div className="bg-white bg-opacity-60 rounded-lg p-4 border border-orange-100 grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs text-gray-500 uppercase font-semibold">Gia hạn</span>
                <span className="text-gray-900 font-medium">
                  {pendingReq.months || 0} Tháng
                </span>
              </div>
              
              <div>
                <span className="block text-xs text-gray-500 uppercase font-semibold">Ngày tạo</span>
                <span className="text-gray-900 font-medium">
                  {pendingReq.receiptDate ? new Date(pendingReq.receiptDate).toLocaleDateString('vi-VN') : '---'}
                </span>
              </div>

              <div className="col-span-2 border-t border-orange-200 pt-3 mt-1">
                <span className="block text-xs text-gray-500 uppercase font-semibold">Tổng tiền cần thanh toán</span>
                <span className="text-2xl font-bold text-orange-600">
                  {pendingReq.totalAmount ? pendingReq.totalAmount.toLocaleString('vi-VN') : 0} đ
                </span>
              </div>
            </div>
          </div>

          {/* Cột 2: Nút hành động */}
          <div className="w-full md:w-auto flex flex-col gap-3 min-w-[200px]">
            {/* Nút Thanh toán lại */}
            <button
              onClick={handleRepay}
              disabled={processing}
              className={`
                w-full py-3 px-6 rounded-lg font-bold shadow-md transition-all flex items-center justify-center gap-2
                ${processing 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transform hover:-translate-y-0.5'
                }
              `}
            >
              {processing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png" alt="ZaloPay" className="w-6 h-6 rounded bg-white p-0.5"/>
                  <span>Thanh toán ngay</span>
                </>
              )}
            </button>

            {/* Nút Hủy (Optional - Nếu bạn chưa làm logic hủy thì có thể ẩn đi) */}
            {/* <button 
              className="w-full py-2 px-4 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              onClick={() => alert('Chức năng hủy đang phát triển')}
            >
              Hủy yêu cầu & Tạo mới
            </button> 
            */}
          </div>
        </div>
      </div>
    );
  }
    

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gia hạn hợp đồng</h1>
        <p className="text-gray-500">Chọn thời gian gia hạn và thanh toán nếu cần.</p>
      </div>

      <Section>
        <div className="space-y-4">
          <div className="bg-[#EFF6FF] rounded-xl p-5 border border-blue-100">
            <h3 className="font-bold text-base mb-4 text-gray-700">Thông tin hợp đồng hiện tại</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Mã hợp đồng</span>
                <span className="font-medium">{contract.id || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phòng</span>
                <span className="font-medium">{contract.room?.building ? `${contract.room.building} - ` : ''}{contract.room?.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày hết hạn</span>
                <span className="font-medium">{contract.expiresAt ? formatDate(contract.expiresAt) : '-'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian gia hạn</label>
              <Select value={months} onChange={(e) => setMonths(Number(e.target.value))}>
                <option value={6}>6 tháng</option>
                <option value={12}>12 tháng</option>
              </Select>
              <div className="mt-3 text-sm text-gray-600">{months} tháng</div>
            </div>

            <div className="w-52 bg-white border border-gray-100 rounded-md p-3">
              <div className="text-sm text-gray-500">Chi phí dự kiến</div>
              <div className="mt-2 text-sm text-gray-700">{totalAmount.toLocaleString()} đ</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="white" onClick={() => navigate(-1)} className="w-full">Hủy</Button>
            <Button onClick={handleConfirm} className="w-full" disabled={processing}>{processing ? 'Đang xử lý...' : `Gia hạn ${months} tháng & Thanh toán`}</Button>
          </div>
        </div>
      </Section>
    </div>
  )
}