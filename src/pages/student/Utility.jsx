import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getBillsByStudent } from '../../services/utilityBillApi';
import BillCard from '../../components/features/student/BillCard';

// Giá điện và nước (có thể lấy từ config hoặc API)

export default function Utility() {
  const { auth } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('unpaid'); // 'unpaid' | 'paid'
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        const result = await getBillsByStudent(auth.accountId);
        
        if (result.success && result.data) {
          // Transform API data to component format
          const transformedBills = result.data.map(bill => ({
            id: bill.billId,
            month: `${String(bill.month).padStart(2, '0')}/${bill.year}`,
            code: bill.billId,
            status: bill.status.toLowerCase(), // 'Unpaid' -> 'unpaid', 'Paid' -> 'paid'
            deadline: bill.status === 'Unpaid' ? `20/${String(bill.month).padStart(2, '0')}/${bill.year}` : null,
            paidDate: bill.status === 'Paid' ? bill.paidDate : null,
            electric: {
              old: bill.electricityOldIndex,
              new: bill.electricityNewIndex,
              usage: bill.electricityUsage,
              rate: bill.electricityUnitPrice,
              total: bill.electricityUsage * bill.electricityUnitPrice
            },
            water: {
              old: bill.waterOldIndex,
              new: bill.waterNewIndex,
              usage: bill.waterUsage,
              rate: bill.waterUnitPrice,
              total: bill.waterUsage * bill.waterUnitPrice
            },
            totalAmount: bill.totalAmount
          }));
          
          setBills(transformedBills);
        } else {
          setError(result.error || 'Không thể tải danh sách hóa đơn');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    if (auth.accountId) {
      fetchBills();
    }
  }, [auth.accountId]);

  // Lọc hóa đơn theo tab
  const filteredBills = bills.filter(b => b.status === activeTab);

  const handlePay = (bill) => {
    // Chuyển sang trang thanh toán với thông tin bill
    navigate('/student/utility/payment', { state: { bill } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Đang tải danh sách hóa đơn...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

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
               <p className="text-sm text-gray-500">
                  {activeTab === 'unpaid' 
                     ? 'Bạn không có hóa đơn chưa thanh toán!' 
                     : 'Chưa có hóa đơn đã thanh toán nào!'}
               </p>
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