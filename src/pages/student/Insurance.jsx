// src/pages/student/Insurance.jsx
import { useState } from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import InsuranceInfoCard from '../../components/features/student/InsuranceInfoCard';
import InsuranceRegistrationForm from '../../components/features/student/InsuranceRegistrationForm'; 

export default function StudentInsurance() {
  const [step, setStep] = useState(1); 

  // Chuyển sang bước điền form
  const handleStart = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quay lại xem thông tin
  const handleBack = () => {
    setStep(1);
  };

  // Xác nhận thanh toán -> Chuyển sang trang Payment
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
              <p className="text-gray-500 mt-1">Năm học 2024-2025</p>
           </div>
        </div>
      )}

      {/* Logic hiển thị theo Step */}
      {step === 1 ? (
        <InsuranceInfoCard onRegister={handleStart} />
      ) : (
        <InsuranceRegistrationForm 
            onCancel={handleBack} 
            onConfirm={handleConfirmPayment} 
        />
      )}

    </div>
  );
}