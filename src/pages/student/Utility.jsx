import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BillCard from '../../components/features/student/BillCard';

// MOCK DATA (Giống dữ liệu trong ảnh của bạn)
const MOCK_BILLS = [
  { 
    id: 1, 
    month: '08/2024', 
    code: 'HD082024', 
    status: 'unpaid', 
    deadline: '20/08/2024',
    electric: { old: 1250, new: 1350, usage: 100, rate: 3500, total: 350000 },
    water: { old: 85, new: 90, usage: 5, rate: 15000, total: 75000 },
    totalAmount: 425000 
  },
  { 
    id: 2, 
    month: '07/2024', 
    code: 'HD072024', 
    status: 'paid', 
    paidDate: '18/07/2024',
    electric: { old: 1150, new: 1250, usage: 100, rate: 3500, total: 350000 },
    water: { old: 80, new: 85, usage: 5, rate: 15000, total: 75000 },
    totalAmount: 425000 
  },
  { 
    id: 3, 
    month: '06/2024', 
    code: 'HD062024', 
    status: 'paid', 
    paidDate: '19/06/2024',
    electric: { old: 1000, new: 1150, usage: 150, rate: 3500, total: 525000 },
    water: { old: 75, new: 80, usage: 5, rate: 15000, total: 75000 },
    totalAmount: 600000 
  }
];

export default function Utility() {
  const [activeTab, setActiveTab] = useState('unpaid'); // 'unpaid' | 'paid'
  const [bills, setBills] = useState(MOCK_BILLS);
  const navigate = useNavigate();

  // Lọc hóa đơn theo tab
  const filteredBills = bills.filter(b => b.status === activeTab);

  const handlePay = (bill) => {
    // Logic thanh toán (Gọi API hoặc chuyển trang Payment)
    if(window.confirm(`Thanh toán hóa đơn tháng ${bill.month} với số tiền ${bill.totalAmount.toLocaleString()}đ?`)) {
      alert("Đang chuyển sang cổng thanh toán...");
      // navigate('/student/payment', { state: { bill } }); 
      navigate('/student/payment-success'); // Chuyển thẳng sang trang thành công để demo
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Page */}
      <div>
         <h1 className="text-2xl font-bold text-gray-900">Thanh Toán Điện Nước</h1>
         <p className="text-gray-500 mt-1">Quản lý và thanh toán hóa đơn sinh hoạt hàng tháng của bạn.</p>
      </div>

      {/* 2. Tabs Switcher (Giống thiết kế Figma) */}
      <div className="bg-gray-100 p-1 rounded-xl flex w-full md:w-auto">
         <button
            onClick={() => setActiveTab('unpaid')}
            className={`flex-1 md:w-48 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
               activeTab === 'unpaid' 
               ? 'bg-white text-gray-900 shadow-sm' 
               : 'text-gray-500 hover:text-gray-700'
            }`}
         >
            Chưa thanh toán ({bills.filter(b => b.status === 'unpaid').length})
         </button>
         <button
            onClick={() => setActiveTab('paid')}
            className={`flex-1 md:w-48 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
               activeTab === 'paid' 
               ? 'bg-white text-gray-900 shadow-sm' 
               : 'text-gray-500 hover:text-gray-700'
            }`}
         >
            Đã thanh toán ({bills.filter(b => b.status === 'paid').length})
         </button>
      </div>

      {/* 3. Danh sách hóa đơn */}
      <div className="space-y-6">
         {filteredBills.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
               <div className="text-4xl mb-3">🎉</div>
               <p className="text-gray-900 font-medium">Không có hóa đơn nào</p>
               <p className="text-sm text-gray-500">Bạn đã thanh toán hết các khoản phí!</p>
            </div>
         ) : (
            filteredBills.map((bill) => (
               <BillCard 
                  key={bill.id} 
                  bill={bill} 
                  onPay={handlePay}
               />
            ))
         )}
      </div>

    </div>
  );
}