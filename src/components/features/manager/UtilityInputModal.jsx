import React, { useState, useMemo, useEffect } from 'react';
import { XMarkIcon, CalculatorIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { getActiveParameter, createUtilityBill, getLastMonthIndex } from '../../../services/utilityBillApi';

export default function UtilityInputModal({ room, month, year, onClose, onSave }) {
  if (!room) return null;

  // State lưu giá trị nhập
  const [newElec, setNewElec] = useState('');
  const [newWater, setNewWater] = useState('');
  const [saving, setSaving] = useState(false);
  
  // State cho chỉ số cũ (lấy từ API)
  const [oldIndices, setOldIndices] = useState({
    oldElec: 0,
    oldWater: 0
  });
  
  // State cho giá hiện hành từ API
  const [rates, setRates] = useState({
    electricity: 3500,
    water: 15000
  });
  
  const [loading, setLoading] = useState(true);

  // ✅ Load chỉ số tháng trước và giá hiện hành khi modal mở
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Gọi song song 2 API
        const [lastMonthResult, parameterResult] = await Promise.all([
          getLastMonthIndex({
            roomId: room.roomID,
            month: month,
            year: year
          }),
          getActiveParameter()
        ]);

        // Set chỉ số cũ từ tháng trước
        if (lastMonthResult.success && lastMonthResult.data) {
          setOldIndices({
            oldElec: lastMonthResult.data.lastElectricIndex || 0,
            oldWater: lastMonthResult.data.lastWaterIndex || 0
          });
        }

        // Set giá hiện hành
        if (parameterResult.success && parameterResult.data) {
          setRates({
            electricity: parameterResult.data.defaultElectricityPrice,
            water: parameterResult.data.defaultWaterPrice
          });
        }
      } catch (error) {
        console.error('Error fetching modal data:', error);
        alert('Có lỗi khi tải dữ liệu. Vui lòng thử lại!');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [room.roomID, month, year]);

  // Helper: Format tiền tệ
  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  // LOGIC TÍNH TOÁN TỰ ĐỘNG
  const calculation = useMemo(() => {
    const nElec = parseInt(newElec) || 0;
    const nWater = parseInt(newWater) || 0;

    const usageElec = Math.max(0, nElec - oldIndices.oldElec);
    const usageWater = Math.max(0, nWater - oldIndices.oldWater);

    const costElec = usageElec * rates.electricity;
    const costWater = usageWater * rates.water;
    const total = costElec + costWater;

    return { usageElec, usageWater, costElec, costWater, total };
  }, [newElec, newWater, oldIndices, rates]);

  // ✅ Xử lý Lưu - Gọi API
  const handleSave = async () => {
    if (newElec === '' || newWater === '') {
      alert("Vui lòng nhập đầy đủ chỉ số mới!");
      return;
    }
    if (parseInt(newElec) < oldIndices.oldElec || parseInt(newWater) < oldIndices.oldWater) {
      alert("Chỉ số mới không được nhỏ hơn chỉ số cũ!");
      return;
    }

    setSaving(true);
    try {
      const requestData = {
        roomId: room.roomID,
        electricityIndex: parseInt(newElec),
        waterIndex: parseInt(newWater)
      };

      console.log('Creating utility bill with data:', requestData);
      const result = await createUtilityBill(requestData);

      if (result.success) {
        alert(result.message || 'Lưu chỉ số thành công!');
        
        // Gọi callback để parent refresh data
        if (onSave) {
          await onSave();
        }
        
        onClose();
      } else {
        alert(result.error || 'Lưu chỉ số thất bại!');
      }
    } catch (error) {
      console.error('Error creating utility bill:', error);
      alert('Có lỗi xảy ra khi lưu chỉ số!');
    } finally {
      setSaving(false);
    }
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
            <p className="text-sm text-gray-500 mt-1">
              Phòng {room.id} - Tháng {month}/{year}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={saving}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-10 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="text-sm text-gray-500">Đang tải dữ liệu...</div>
          </div>
        ) : (
          <>
            {/* 2. Form Nhập Liệu */}
            <div className="p-5 space-y-5">
              
              {/* Hàng Điện */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-gray-500">Chỉ số điện cũ</label>
                  <div className="w-full bg-gray-100 border border-transparent rounded px-3 py-2 text-sm font-medium text-gray-500 cursor-not-allowed">
                    {oldIndices.oldElec}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-900">Chỉ số điện mới <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    value={newElec}
                    onChange={(e) => setNewElec(e.target.value)}
                    disabled={saving}
                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm font-normal text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Nhập số điện mới..."
                  />
                </div>
              </div>

              {/* Hàng Nước */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-gray-500">Chỉ số nước cũ</label>
                  <div className="w-full bg-gray-100 border border-transparent rounded px-3 py-2 text-sm font-medium text-gray-500 cursor-not-allowed">
                    {oldIndices.oldWater}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-900">Chỉ số nước mới <span className="text-red-500">*</span></label>
                  <input 
                    type="number"
                    value={newWater}
                    onChange={(e) => setNewWater(e.target.value)}
                    disabled={saving}
                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm font-normal text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Nhập số nước mới..."
                  />
                </div>
              </div>

              {/* 3. Khu vực Tính toán Chi phí  */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
                  <CalculatorIcon className="w-3.5 h-3.5"/> Tính toán chi phí:
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Điện tiêu thụ:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{calculation.usageElec} kWh × {rates.electricity.toLocaleString()} =</span>
                      <span className="font-bold text-gray-900 w-24 text-right">{formatMoney(calculation.costElec)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nước tiêu thụ:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{calculation.usageWater} m³ × {rates.water.toLocaleString()} =</span>
                      <span className="font-bold text-gray-900 w-24 text-right">{formatMoney(calculation.costWater)}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center">
                    <span className="font-bold text-gray-700">Tổng cộng:</span>
                    <span className="font-bold text-blue-600 text-base">{formatMoney(calculation.total)}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* 4. Footer Buttons */}
            <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button 
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="w-3.5 h-3.5"/> Lưu chỉ số
                  </>
                )}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}