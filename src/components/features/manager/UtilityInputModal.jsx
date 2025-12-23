import React, { useState, useMemo } from 'react';
import { XMarkIcon, CalculatorIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function UtilityInputModal({ room, rates, onClose, onSave }) {
  if (!room) return null;

  // State lưu giá trị nhập (Mặc định là rỗng hoặc giá trị đã nhập trước đó)
  const [newElec, setNewElec] = useState(room.newElec || '');
  const [newWater, setNewWater] = useState(room.newWater || '');

  // Helper: Format tiền tệ
  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  // LOGIC TÍNH TOÁN TỰ ĐỘNG (Dùng useMemo để tối ưu)
  const calculation = useMemo(() => {
    // Ép kiểu về số, nếu rỗng thì coi như = 0 hoặc bằng chỉ số cũ để không bị âm
    const nElec = parseInt(newElec) || 0;
    const nWater = parseInt(newWater) || 0;

    // Tính tiêu thụ (Mới - Cũ). Nếu nhập nhỏ hơn cũ thì = 0
    const usageElec = Math.max(0, nElec - room.oldElec);
    const usageWater = Math.max(0, nWater - room.oldWater);

    // Tính thành tiền
    const costElec = usageElec * rates.electricity;
    const costWater = usageWater * rates.water;
    const total = costElec + costWater;

    return { usageElec, usageWater, costElec, costWater, total };
  }, [newElec, newWater, room.oldElec, room.oldWater, rates]);

  // Xử lý Lưu
  const handleSave = () => {
    // Validate cơ bản
    if (newElec === '' || newWater === '') {
      alert("Vui lòng nhập đầy đủ chỉ số mới!");
      return;
    }
    if (parseInt(newElec) < room.oldElec || parseInt(newWater) < room.oldWater) {
      alert("Chỉ số mới không được nhỏ hơn chỉ số cũ!");
      return;
    }

    // Trả dữ liệu ra ngoài
    onSave({
      ...room,
      newElec: parseInt(newElec),
      newWater: parseInt(newWater),
      usageElec: calculation.usageElec,
      usageWater: calculation.usageWater,
      totalBill: calculation.total,
      status: 'unpaid' // Chuyển trạng thái
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-xl overflow-hidden animate-scale-up">
        
        {/* 1. Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Nhập Chỉ Số Điện Nước</h3>
            <p className="text-sm text-gray-500 mt-1">Phòng {room.id} - Tháng 08/2024</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Form Nhập Liệu */}
        <div className="p-5 space-y-5">
          
          {/* Hàng Điện */}
          <div className="grid grid-cols-2 gap-4">
            {/* Cũ */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-500">Chỉ số điện cũ</label>
              <div className="w-full bg-gray-100 border border-transparent rounded px-3 py-2 text-sm font-medium text-gray-500 cursor-not-allowed">
                {room.oldElec}
              </div>
            </div>
            {/* Mới */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-gray-900">Chỉ số điện mới <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                value={newElec}
                onChange={(e) => setNewElec(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm font-normal text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0"
                placeholder="Nhập số điện mới..."
              />
            </div>
          </div>

          {/* Hàng Nước */}
          <div className="grid grid-cols-2 gap-4">
            {/* Cũ */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-500">Chỉ số nước cũ</label>
              <div className="w-full bg-gray-100 border border-transparent rounded px-3 py-2 text-sm font-medium text-gray-500 cursor-not-allowed">
                {room.oldWater}
              </div>
            </div>
            {/* Mới */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-gray-900">Chỉ số nước mới <span className="text-red-500">*</span></label>
              <input 
                type="number"
                value={newWater}
                onChange={(e) => setNewWater(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm font-normal text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0"
                placeholder="Nhập số nước mới..."
              />
            </div>
          </div>

          {/* 3. Khu vực Tính toán Chi phí  */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="sm font-medium text-gray-900 mb-2 flex items-center gap-1">
              <CalculatorIcon className="w-3.5 h-3.5"/> Tính toán chi phí:
            </div>
            
            <div className="space-y-2 text-sm">
              {/* Dòng Điện */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Điện tiêu thụ:</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">{calculation.usageElec} kWh × {rates.electricity.toLocaleString()} =</span>
                  <span className="font-bold text-gray-900 w-16 text-right">{formatMoney(calculation.costElec)}</span>
                </div>
              </div>

              {/* Dòng Nước */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Nước tiêu thụ:</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">{calculation.usageWater} m³ × {rates.water.toLocaleString()} =</span>
                  <span className="font-bold text-gray-900 w-16 text-right">{formatMoney(calculation.costWater)}</span>
                </div>
              </div>

              {/* Tổng cộng */}
              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center">
                <span className="font-bold text-gray-700">Tổng cộng:</span>
                <span className="font-bold text-blue-600 text-sm">{formatMoney(calculation.total)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4. Footer Buttons */}
        <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            Hủy
          </button>
          
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 shadow-sm flex items-center gap-2 transition-colors"
          >
             <ArrowDownTrayIcon className="w-3.5 h-3.5"/> Lưu chỉ số
          </button>
        </div>

      </div>
    </div>
  );
}