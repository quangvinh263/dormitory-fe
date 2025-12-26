// src/pages/student/Insurance.jsx
import { useState, useEffect } from 'react'
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import InsuranceInfoCard from '../../components/features/student/InsuranceInfoCard';
import InsuranceRegistrationForm from '../../components/features/student/InsuranceRegistrationForm'; 
import {getHealthInsurancePrice,getAllHospital} from '../../services/insuranceApi'
export default function StudentInsurance() {
  const [step, setStep] = useState(1); 
  const [insuranceYear, setInsuranceYear] = useState(new Date().getFullYear()+1); // Mặc định là năm nay (2025)
  const [insurancePrice, setInsurancePrice] = useState(0);
  const [hospitalList, setHospitalList] = useState([]);


  // Chuyển sang bước điền form
  const handleStart = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quay lại xem thông tin
  const handleBack = () => {
    setStep(1);
  };
  useEffect(() => {
    const fetchData = async () => {
        try {
            const yearToFetch = new Date().getFullYear() + 1;
            const [priceRes, hospitalRes] = await Promise.all([
                getHealthInsurancePrice(yearToFetch),
                getAllHospital()
            ]);
            
            if (priceRes.success && priceRes.data) {
                setInsurancePrice(priceRes.data.price || priceRes.data.amount || 0);
            }
            if (hospitalRes.success && Array.isArray(hospitalRes.data)) {
                setHospitalList(hospitalRes.data);
            } else {
                console.warn("API bệnh viện không trả về mảng:", hospitalRes);
            }
        } catch (error) {
            console.error("Lỗi lấy giá bảo hiểm:", error);
        }
    };

    fetchData();
  }, []);

  
  const handleConfirmPayment = (hospitalName) => {
    // navigate('/student/payment', { state: { ... } });
    alert(`Đang chuyển hướng thanh toán cho cơ sở: ${hospitalName}`);
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* Header chỉ hiện ở bước 1 cho đỡ rối, hoặc giữ nguyên tùy ý */}
      {step === 1 && (
        <div className="flex items-start gap-3">
           <div className="p-2 bg-red-50 rounded-lg text-red-600 border border-red-100">
              <ShieldCheckIcon className="w-8 h-8"/>
           </div>
           <div>
              <h1 className="text-2xl font-bold text-gray-900">Đăng Ký Bảo Hiểm Y Tế</h1>
              <p className="text-gray-500 mt-1">Năm học {insuranceYear-2}-{insuranceYear-1}</p>
           </div>
        </div>
      )}

      {/* Logic hiển thị theo Step */}
      {step === 1 ? (
        <InsuranceInfoCard 
          onRegister={handleStart}
          price={insurancePrice}
          year ={insuranceYear}
        />
      ) : (
        <InsuranceRegistrationForm 
            onCancel={handleBack} 
            onConfirm={handleConfirmPayment} 
            price={insurancePrice}
            year ={insuranceYear}
            hospitalList={hospitalList}
        />
      )}

    </div>
  );
}