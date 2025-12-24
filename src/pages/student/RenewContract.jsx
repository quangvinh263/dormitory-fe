import { useState, useEffect, useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import Section from '../../components/shared/Section'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import { AuthContext } from '../../context/AuthContext'
import { getStudentContractDetail, createRenewalRequest } from '../../services/contractApi'
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
  
  useEffect(() => {
    // Kiểm tra xem trên URL có tham số của ZaloPay không (apptransid, status, amount...)
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
        const res = await getStudentContractDetail(accountId)
        if (!mounted) return
        if (res.success && res.data) {
          setContract(normalize(res.data))
        } else {
          setError(res.message || 'Không tìm thấy hợp đồng cho sinh viên.')
        }
      } catch (err) {
        if (!mounted) return
        setError('Đã xảy ra lỗi khi tải hợp đồng'+`${err}`)
      } finally {
        mounted && setLoading(false)
      }
    }

    fetch()
    return () => { mounted = false }
  }, [auth])

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