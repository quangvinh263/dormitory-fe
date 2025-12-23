import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

/* --- Component con: Status Badge --- */
const StatusBadge = ({ status }) => {
  const configs = {
    paid: { bg: 'bg-green-100', text: 'text-green-700', label: 'Đã thanh toán' },
    unpaid: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Chưa thanh toán' },
    not_entered: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Chưa nhập' },
  };
  const conf = configs[status] || configs.not_entered;

  return (
    <span className={`px-2 py-1 rounded text-[12px] font-bold tracking-wide border border-transparent ${conf.bg} ${conf.text}`}>
      {conf.label}
    </span>
  );
};

/* --- Component Chính --- */
export default function UtilityTable({ data, onEnterClick, selectedMonth, selectedYear }) {
  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  // ✅ Kiểm tra xem có thể nhập chỉ số không (chỉ cho phép tháng hiện tại hoặc quá khứ)
  const canEnterData = () => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Nếu năm nhỏ hơn năm hiện tại -> OK
    if (selectedYear < currentYear) return true;
    
    // Nếu cùng năm, tháng phải nhỏ hơn hoặc bằng tháng hiện tại
    if (selectedYear === currentYear && selectedMonth <= currentMonth) return true;
    
    // Các trường hợp khác -> không cho phép
    return false;
  };

  const isAllowedToEnter = canEnterData();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-sm text-gray-700 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 bg-gray-50 rounded-tl-lg">Phòng</th>
              <th className="px-4 py-3 text-center bg-yellow-50/60 border-l border-white">Điện cũ</th>
              <th className="px-4 py-3 text-center bg-yellow-50/60">Điện mới</th>
              <th className="px-4 py-3 text-center font-bold text-yellow-700 bg-yellow-50 border-r border-white">Tiêu thụ</th>
              <th className="px-4 py-3 text-center bg-blue-50/60">Nước cũ</th>
              <th className="px-4 py-3 text-center bg-blue-50/60">Nước mới</th>
              <th className="px-4 py-3 text-center font-bold text-blue-700 bg-blue-50 border-r border-white">Tiêu thụ</th>
              <th className="px-4 py-3 text-right font-bold bg-gray-50">Tổng tiền</th>
              <th className="px-4 py-3 text-center bg-gray-50">Trạng thái</th>
              <th className="px-4 py-3 text-center bg-gray-50 rounded-tr-lg">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const isEntered = row.status !== 'not_entered';
              const isPaid = row.status === 'paid';
              const isUnpaid = row.status === 'unpaid';

              return (
                <tr key={row.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-bold text-gray-900">{row.id}</td>
                  
                  <td className="px-4 py-4 text-center text-gray-700">
                    {row.oldElec != null ? row.oldElec : '-'}
                  </td>
                  
                  <td className="px-4 py-4 text-center font-medium text-gray-900">
                    {isEntered ? row.newElec : '-'}
                  </td>

                  <td className="px-4 py-4 text-center">
                    {isEntered ? (
                       <span className="text-yellow-700 font-medium bg-yellow-50 px-2 py-1 rounded text-xs border border-yellow-200">
                         {row.usageElec} kWh
                       </span>
                    ) : '-'}
                  </td>

                  <td className="px-4 py-4 text-center text-gray-700">
                    {row.oldWater != null ? row.oldWater : '-'}
                  </td>
                  
                  <td className="px-4 py-4 text-center font-medium text-gray-900">
                    {isEntered ? row.newWater : '-'}
                  </td>

                  <td className="px-4 py-4 text-center">
                    {isEntered ? (
                       <span className="text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded text-xs border border-blue-200">
                         {row.usageWater} m³
                       </span>
                    ) : '-'}
                  </td>

                  <td className="px-4 py-4 text-right font-bold text-gray-900">
                    {isEntered ? formatMoney(row.totalBill) : '-'}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <StatusBadge status={row.status} />
                  </td>

                  <td className="px-4 py-4 text-center">
                    {/* ✅ Chỉ hiển thị nút "Nhập" nếu chưa nhập và trong khoảng thời gian cho phép */}
                    {row.status === 'not_entered' && isAllowedToEnter && (
                      <button 
                        onClick={() => onEnterClick(row)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white border border-transparent rounded hover:bg-blue-700 text-xs font-medium shadow-sm transition-all cursor-pointer"
                      >
                        <PlusIcon className="w-3.5 h-3.5"/> Nhập
                      </button>
                    )}

                    {/* ✅ Hiển thị thông báo nếu không thể nhập */}
                    {row.status === 'not_entered' && !isAllowedToEnter && (
                      <span className="text-gray-400 text-xs italic">Chưa đến kỳ</span>
                    )}

                    {isUnpaid && <span className="text-orange-500 text-xs italic">Chờ thanh toán</span>}
                    {isPaid && <span className="text-gray-300 text-xs italic">Đã chốt</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}