import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import Section from '../../components/shared/Section'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import { AuthContext } from '../../context/AuthContext'
import { getStudentContractDetail, createRenewalRequest } from '../../services/contractApi'
import { getStudentInfo } from '../../services/studentApi'

export default function RenewContract() {
  const navigate = useNavigate()
  const { auth } = useContext(AuthContext)

  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [months, setMonths] = useState(6)
  const [processing, setProcessing] = useState(false)

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
        setError('Đã xảy ra lỗi khi tải hợp đồng')
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

    const confirmMsg = `Bạn sẽ gia hạn ${months} tháng. Tiếp tục?`
    if (!window.confirm(confirmMsg)) return

    setProcessing(true)
    try {
      const stu = await getStudentInfo(accountId)
      if (!stu.success || !stu.data) return setError(stu.message || 'Không thể lấy thông tin sinh viên')

      const studentId = stu.data.studentID || stu.data.studentId || stu.data.id
      if (!studentId) return setError('Không tìm thấy mã sinh viên')

      const res = await createRenewalRequest(studentId, months)
      if (res.success) {
        const paymentUrl = res.data?.paymentUrl || res.raw?.paymentUrl
        const invoiceId = res.data?.invoiceId || res.raw?.invoiceId || null
        if (paymentUrl) {
          window.location.href = paymentUrl
          return
        }
        // done, navigate back to contract page
        navigate('/student/contract', { state: { invoiceId } })
      } else if (res.statusCode === 404) {
        setError(res.message || 'Không tìm thấy hợp đồng')
      } else {
        setError(res.message || 'Yêu cầu gia hạn thất bại')
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.')
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