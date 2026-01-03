import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import { createHealthPrice, getHealthInsurancePrice } from '../../../services/insuranceApi';

const InsuranceConfig = forwardRef((props, ref) => {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toISOString().split('T')[0];
  
  const [config, setConfig] = useState({
    amount: 250000,
    year: currentYear,
    effectiveDate: currentDate,
  });
  
  const [originalConfig, setOriginalConfig] = useState({
    amount: 250000,
    year: currentYear,
    effectiveDate: currentDate,
  });
  
  const location = useLocation();

  const formatVND = (v) => new Intl.NumberFormat('vi-VN').format(v);

  const hasUnsavedChanges = () => {
    return config.amount !== originalConfig.amount;
  };

  const saveConfig = async () => {
    const insuranceData = {
      amount: config.amount,
      year: config.year,
      effectiveDate: config.effectiveDate,
    };
    
    const result = await createHealthPrice(insuranceData);
    console.log('Save Insurance Config Result:', result);
    if (result.success) {
      setOriginalConfig({ ...config });
    }
    return result;
  };

  // Xử lý thay đổi giá và tự động cập nhật effectiveDate
  const handleAmountChange = (newAmount) => {
    // Nếu giá trị mới bằng giá trị gốc, khôi phục lại date gốc
    if (newAmount === originalConfig.amount) {
      setConfig({
        ...config,
        amount: newAmount,
        effectiveDate: originalConfig.effectiveDate,
        year: originalConfig.year
      });
    } else {
      // Nếu giá trị khác, cập nhật date về hiện tại
      const now = new Date().toISOString().split('T')[0];
      setConfig({
        ...config,
        amount: newAmount,
        effectiveDate: now,
        year: new Date().getFullYear()
      });
    }
  };

  useImperativeHandle(ref, () => ({
    hasUnsavedChanges,
    saveConfig
  }));

  // Intercept navigation
  useEffect(() => {
    const handleNavigation = (e) => {
      if (hasUnsavedChanges()) {
        const confirmLeave = window.confirm(
          'Bạn có chỉnh sửa chưa được lưu. Xác nhận rời đi?'
        );
        if (!confirmLeave) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
      return true;
    };

    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      link.addEventListener('click', handleNavigation);
    });

    const handlePopState = (e) => {
      if (hasUnsavedChanges()) {
        const confirmLeave = window.confirm(
          'Bạn có chỉnh sửa chưa được lưu. Xác nhận rời đi?'
        );
        if (!confirmLeave) {
          e.preventDefault();
          window.history.pushState(null, '', location.pathname);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleNavigation);
      });
      window.removeEventListener('popstate', handlePopState);
    };
  }, [config, originalConfig, location]);

  useEffect(() => {
    const fetchHealthInsurancePrice = async () => {
      const result = await getHealthInsurancePrice(currentYear);
      if (result.success && result.data) {
        const newConfig = {
          amount: result.data.price,
          year: result.data.year || currentYear,
          effectiveDate: result.data.effectiveDate || currentDate,
        };
        setConfig(newConfig);
        setOriginalConfig(newConfig);
      }
    };

    fetchHealthInsurancePrice();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [config, originalConfig]);

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm animate-fade-in flex flex-col gap-6">
      
      {/* Header Section */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-green-50 rounded-xl text-green-600">
          <ShieldCheckIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-md font-bold text-gray-900">Cấu Hình Tiền BHYT</h3>
          <p className="text-sm text-gray-500">Thiết lập đơn giá BHYT</p>
        </div>
      </div>

      {/* Form Body */}
      <div className="flex flex-col gap-6">
        
        {/* Giá BHYT */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Giá BHYT (VND/năm)</label>
          <div className="relative w-full flex items-center">
            <input
              type="number"
              value={config.amount}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
              className="block w-full pl-3 pr-12 py-2.5 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            />
            <span className="absolute right-3 text-gray-400 text-xs font-bold pointer-events-none whitespace-nowrap">
              VND
            </span>
          </div>
          <p className="text-xs text-gray-400 italic font-normal">Chi phí bảo hiểm y tế cho sinh viên</p>
        </div>

        {/* Năm và Ngày áp dụng - Read only */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Năm áp dụng</label>
            <input
              type="text"
              value={config.year}
              readOnly
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-gray-100 text-gray-600 cursor-not-allowed sm:text-sm"
            />
            <p className="text-xs text-gray-400 italic font-normal">Năm hiện tại (tự động)</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Ngày áp dụng</label>
            <input
              type="text"
              value={new Date(config.effectiveDate).toLocaleDateString('vi-VN')}
              readOnly
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-gray-100 text-gray-600 cursor-not-allowed sm:text-sm"
            />
            <p className="text-xs text-gray-400 italic font-normal">Ngày hiện tại (tự động)</p>
          </div>
        </div>

        {/* Box Thông tin */}
        <div className="bg-green-50/50 rounded-xl p-5 border border-green-100 mt-2">
          <h4 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
            Thông tin cấu hình dự kiến:
          </h4>
          <div className="text-sm text-green-900/80 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span>Mức phí BHYT:</span>
              <span className="text-right font-bold">{formatVND(config.amount)}đ/năm</span>
              <span>Năm áp dụng:</span>
              <span className="text-right font-bold">{config.year}</span>
              <span>Ngày có hiệu lực:</span>
              <span className="text-right font-bold">{new Date(config.effectiveDate).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

export default InsuranceConfig;