// src/pages/student/Insurance.jsx
import { useState, useEffect,useContext } from 'react'
import { useNavigate,useSearchParams} from 'react-router-dom'
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import InsuranceInfoCard from '../../components/features/student/InsuranceInfoCard';
import InsuranceRegistrationForm from '../../components/features/student/InsuranceRegistrationForm'; 
import { getHealthInsurancePrice,getAllHospital,registerInsurance,getStudentInsurance} from '../../services/insuranceApi';
import { createZaloPayLinkForHealthInsurance } from '../../services/paymentApi';
import { getStudentInfo } from '../../services/studentApi'
import { AuthContext } from '../../context/AuthContext'
export default function StudentInsurance() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { auth } = useContext(AuthContext)

  // State quản lý dữ liệu
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // Data State
  const [studentId, setStudentId] = useState(null);
  const [insuranceYear, setInsuranceYear] = useState(new Date().getFullYear() + 1);
  const [insurancePrice, setInsurancePrice] = useState(0);
  const [hospitalList, setHospitalList] = useState([]);
  const [currentInsurance, setCurrentInsurance] = useState(null);

  //Kiểm tra  tình trạng thanh toán trả về
  useEffect(() => {
    const appTransId = searchParams.get('apptransid');
    const status = searchParams.get('status');

    if (appTransId || status) {
      console.log("Phát hiện callback thanh toán, chuyển hướng...");
      navigate(`/student/insurance/result?${searchParams.toString()}`, { replace: true });
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    let mounted = true;
    const accountId = auth?.accountId || localStorage.getItem('accountId');

    if (!accountId) {
      setError('Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
        try {
            const stuRes = await getStudentInfo(accountId);
            if (!mounted) return;

            if (!stuRes.success || !stuRes.data) {
                throw new Error(stuRes.message || 'Không thể lấy thông tin sinh viên');
            }
            
            // Normalize studentId
            const sId = stuRes.data.studentID || stuRes.data.studentId || stuRes.data.id;
            setStudentId(sId);
            const insuranceRes = await getStudentInsurance(sId);
            if (mounted && insuranceRes.success && insuranceRes.data) {
                setCurrentInsurance(insuranceRes.data); 
            }
            const yearToFetch = new Date().getFullYear() + 1;
            const [priceRes, hospitalRes] = await Promise.all([
                getHealthInsurancePrice(yearToFetch),
                getAllHospital()
            ]);

            if (!mounted) return;

            if (priceRes.success && priceRes.data) {
                setInsurancePrice(priceRes.data.price || priceRes.data.amount || 0);
            }

            if (hospitalRes.success && Array.isArray(hospitalRes.data)) {
                setHospitalList(hospitalRes.data);
            }

        } catch (err) {
            if (mounted) setError(`Lỗi tải dữ liệu: ${err.message}`);
        } finally {
            if (mounted) setLoading(false);
        }
    };

    fetchData();

    return () => { mounted = false; };
  }, [auth,insuranceYear]);

  const handleStart = async () => {
    if (currentInsurance && currentInsurance.status === 'Pending') {
        
        setProcessing(true); // Hiện loading xoay xoay
        try {
            const insuranceId = currentInsurance.healthInsuranceId || currentInsurance.insuranceID;
            
            // Gọi API lấy link thanh toán lại
            const payRes = await createZaloPayLinkForHealthInsurance(insuranceId);
            
            if (payRes.success) {
                const url = payRes.data?.paymentUrl || payRes.data?.data?.paymentUrl || payRes.data?.orderUrl;
                if (url) {
                    sessionStorage.setItem('payment_redirect_to', window.location.pathname);
                    window.location.href = url; // Chuyển hướng
                }
            } else {
                setError("Không thể tạo link thanh toán: " + payRes.message);
            }
        } catch (err) {
            setError("Lỗi xử lý thanh toán: " + err.message);
        } finally {
            setProcessing(false);
        }
        return; 
    }

    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleBack = () => {
      setStep(1);
      setError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  
  const handleConfirmPayment = async (formData) => {
      if (!studentId) {
        setError('Lỗi: Không tìm thấy mã sinh viên.');
        return;
    }

    setProcessing(true);
    setError('');

    try {
        const payload = {
            studentId: studentId,
            hospitalId: formData.hospitalId,
            cardNumber: formData.cardNumber
        };
        
        console.log("1. Đang đăng ký bảo hiểm:", payload);
        const regRes = await registerInsurance(payload);

        if (!regRes.success) {
            throw new Error(regRes.message || 'Đăng ký thất bại');
        }

        // --- BƯỚC 2: LẤY INSURANCE ID ---
        const regData = regRes.data || {};
        const newInsuranceId = regData.insuranceId || regData.id || regData.healthInsuranceId;

        if (!newInsuranceId) {
             console.error("Response đăng ký:", regData);
             throw new Error('Đăng ký thành công nhưng không lấy được ID bảo hiểm.');
        }

        console.log("2. Lấy link thanh toán cho ID:", newInsuranceId);

        // --- BƯỚC 3: GỌI HÀM THANH TOÁN BẠN VỪA CUNG CẤP ---
        const payRes = await createZaloPayLinkForHealthInsurance(newInsuranceId);
        
        if (!payRes.success) {
            throw new Error(payRes.message || 'Không thể tạo đường dẫn thanh toán');
        }

        // --- BƯỚC 4: CHUYỂN HƯỚNG SANG ZALOPAY ---
        const payData = payRes.data || {};
        // Lấy link thanh toán (thường nằm trong payData.paymentUrl hoặc payData.data.paymentUrl)
        const paymentUrl = payData.paymentUrl || payData.data?.paymentUrl || payData.orderUrl;

        if (paymentUrl) {
            sessionStorage.setItem('payment_redirect_to', window.location.pathname);
            window.location.href = paymentUrl; // Redirect
        } else {
            console.error("Payment Res:", payData);
            throw new Error('Hệ thống không trả về đường dẫn thanh toán (URL null).');
        }

    } catch (err) {
        console.error("Quy trình thất bại:", err);
        setError(err.message || 'Đã xảy ra lỗi trong quá trình xử lý.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
        setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 text-sm">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto relative">
      
      {/* 2. Hiển thị Error Alert nếu có lỗi */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
            <ExclamationCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Đã xảy ra lỗi</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700 text-sm">
                Đóng
            </button>
        </div>
      )}

      {/* Header chỉ hiện ở bước 1 */}
      {step === 1 && (
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600 border border-blue-100">
            <ShieldCheckIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Đăng Ký Bảo Hiểm Y Tế</h1>
            {/* Sử dụng biến insuranceYear */}
            <p className="text-gray-500 mt-1">Năm học {insuranceYear}</p>
          </div>
        </div>
      )}

      {/* Content chính */}
      <div className={processing ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
          {step === 1 ? (
            <InsuranceInfoCard
              onRegister={handleStart}
              price={insurancePrice}
              year={insuranceYear} 
              currentInsurance={currentInsurance}
            />
          ) : (
            <InsuranceRegistrationForm
              onCancel={handleBack}
              onConfirm={handleConfirmPayment}
              price={insurancePrice}
              year={insuranceYear} 
              hospitalList={hospitalList}
            />
          )}
      </div>

      {/* 3. Processing Overlay: Hiện khi đang xử lý thanh toán */}
      {processing && (
         <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-50 flex items-center justify-center">
             <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center gap-4 min-w-[300px]">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                 <div className="text-center">
                     <p className="font-semibold text-gray-900">Đang xử lý yêu cầu</p>
                     <p className="text-sm text-gray-500 mt-1">Vui lòng đợi trong giây lát...</p>
                 </div>
             </div>
         </div>
      )}

    </div>
  );
}