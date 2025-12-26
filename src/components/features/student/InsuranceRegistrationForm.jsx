import { useState } from 'react';
import { ExclamationTriangleIcon, BuildingOffice2Icon, CreditCardIcon } from '@heroicons/react/24/outline';
import Button from '../../ui/Button';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};
export default function InsuranceRegistrationForm({ onCancel, onConfirm,price,year,hospitalList }) {
  const [cardNumber, setCardNumber] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState('');
  const isValid = cardNumber.trim().length > 0 && selectedHospitalId !== '';

  const handleConfirm = () => {
      const selectedHospital = hospitalList.find(h => h.hospitalId === selectedHospitalId);
      onConfirm({
          cardNumber: cardNumber,
          hospitalId: selectedHospitalId,
          hospitalName: selectedHospital?.hospitalName 
      });
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden max-w-full mx-auto">
      
      {/* 1. Header */}
      <div className="p-6 border-b border-gray-100">
         <h2 className="text-lg font-bold text-gray-900">Thông Tin Đăng Ký BHYT</h2>
         <p className="text-sm text-gray-500 mt-1">Vui lòng điền đầy đủ thông tin</p>
      </div>

      {/* 2. Body */}
      <div className="p-6 space-y-6">

         {/*Input: So BHYT */}
         <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 flex gap-1">
               Số thẻ bảo hiểm y tế <span className="text-red-500">*</span>
            </label>
            <div className="relative">
               <input 
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="VD: SV1234567890"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
               />
               <CreditCardIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
         </div>

         {/* Input: Tên cơ sở y tế */}
         <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 flex gap-1">
               Tên cơ sở khám chữa bệnh ban đầu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
               <select 
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                  value={selectedHospitalId}
                  onChange={(e) => setSelectedHospitalId(e.target.value)}
               >
                  <option value="">-- Chọn cơ sở y tế --</option>
                  {hospitalList.map((h) => (
                      <option key={h.hospitalId} value={h.hospitalId}>
                          {h.hospitalName}
                      </option>
                  ))}
               </select>
               <BuildingOffice2Icon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-xs text-gray-500">Cơ sở y tế bạn sẽ đăng ký khám chữa bệnh ban đầu</p>
         </div>

         {/* Warning Box */}
         <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 space-y-2">
            <h4 className="text-xs font-bold text-yellow-900 uppercase flex items-center gap-2">
               <ExclamationTriangleIcon className="w-4 h-4"/> Lưu ý quan trọng:
            </h4>
            <ul className="list-disc list-inside text-xs text-yellow-800 space-y-1 pl-1">
               <li>Thông tin cơ sở khám chữa bệnh cần chính xác</li>
               <li>Bạn chỉ được khám tại cơ sở đã đăng ký (trừ trường hợp cấp cứu)</li>
               <li>Có thể thay đổi cơ sở khám sau khi đăng ký (phải làm thủ tục chuyển)</li>
            </ul>
         </div>

         {/* Tổng chi phí */}
         <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
            <div>
               <p className="text-md font-medium text-gray-600">Tổng chi phí:</p>
               <p className="text-sm text-gray-400 mt-1">Hiệu lực: 01/01/{year} - 31/12/{year}</p>
            </div>
            <span className="text-xl font-bold text-green-700">{formatCurrency(price)}</span>
         </div>

      </div>

      {/* 3. Footer Action */}
      <div className="p-6 pt-0 flex gap-3">
         <Button 
            variant="white" 
            onClick={onCancel}
            className="flex-1 justify-center"
         >
            Quay lại
         </Button>
         
         <Button 
            disabled={!isValid}
            onClick={handleConfirm}
            className="flex-1 justify-center"
            icon={<CreditCardIcon className="w-5 h-5"/>}
         >
            Thanh toán
         </Button>
      </div>

    </div>
  );
}